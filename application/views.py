from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, current_user
from .models import db, User, Product, ProductUser, Role, Category
from .sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from celery.result import AsyncResult
from sqlalchemy import or_, and_
from .tasks import create_transaction_csv, create_product_csv
from datetime import datetime
import pytz
import time

@app.get('/')
def home():
        return render_template('index.html')

@app.post('/user-login')
def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email:
                return jsonify({'message': 'Error: Email not provided!!'}), 400
        if not password:
                return jsonify({'message': 'Error: Password not provided!!'}), 400

        user = datastore.find_user(email=email)
        if not user:
                return jsonify({'message': 'Error: User not exists!!'}), 404

        if check_password_hash(user.password, password):
                return jsonify({'token':user.get_auth_token(), 'email':user.email, 'role':user.roles[0].name})
        else:
                return jsonify({'message': 'Error: Wrong password!!'}), 400
        
@app.post('/user-register')
def user_register():
        username=None
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        if data.get('username'):
                username = data.get('username')
        if not email:
                return jsonify({'message': 'Error: Email not provided!!'}), 400
        if not password:
                return jsonify({'message': 'Error: Password not provided!!'}), 400
        if not role:
                return jsonify({'message': 'Error: Role not specified!!'}), 400

        user = datastore.find_user(email=email)
        if user:
                return jsonify({'message': 'Error: User already exists!!'}), 404

        if role=='manager':
                active=False
        elif role=='customer': 
                active=True
        elif role=='admin':
                return jsonify({'message': 'Error: Admin role can not registered!!'}), 400
        else:
                return jsonify({'message': 'Error: Invalid error!!'}), 400
        
        datastore.create_user(username=username, 
                              email=email, 
                              password=generate_password_hash(password), 
                              roles=[role], 
                              active=active)
        db.session.commit()
        user = datastore.find_user(email=email)
        return jsonify({'token':user.get_auth_token(), 'email':user.email, 'role':user.roles[0].name})

################################################ Customer ######################################################

@app.get('/customer/cart/add/<int:product_id>')
@auth_required('token')
@roles_required('customer')
def add_to_cart(product_id, quantity=1):
        # print('I am here')
        if product_id==1:
                return jsonify({'message': 'Error: Base product can not be added to cart!!'}), 404
        if product_id<1:
                return jsonify({'message': 'Error: Invalide product ID!!'}), 404
        products = Product.query.all()
        product_ids = list(map(lambda x: x.id,products))
        if product_id not in product_ids:
                return jsonify({'message': 'Error: Product does not exists!!'}), 404
        
        product = Product.query.get(product_id)
        if product.stock<=0:
                return jsonify({'message': f'Error: Sorry, {product.name} is "Out Of Stock"!!'}), 404
        
        # try: 
        cartCard = ProductUser.query.filter(ProductUser.user_id==current_user.id,
                                        ProductUser.product_id==product_id, 
                                        ProductUser.commit==False).first()
        if not cartCard:
                cardCard = ProductUser(user_id=current_user.id,product_id=product_id,quantity=quantity)
                db.session.add(cardCard)
        else:
                if cartCard.quantity>=product.stock:
                        return jsonify({'message': f'Error: Sorry, You have reached {product.name} stock limit!!'}), 404

                cartCard.quantity += quantity
        
        try:
                db.session.commit()
                return jsonify({'message': f'Success: One {product.name} added to the cart!!'}), 201
        except:
                return jsonify({'message': 'Error: Unknown server error!!'}), 500


@app.get('/customer/cart/remove/<int:product_id>')
@auth_required('token')
@roles_required('customer')
def remove_from_cart(product_id):
        if product_id==1:
                return jsonify({'message': 'Error: Base product can not removed!!'}), 404
        if product_id<1:
                return jsonify({'message': 'Error: Invalide product ID!!'}), 404

        products = Product.query.all()
        product_ids = list(map(lambda x: x.id,products))
        if product_id not in product_ids:
                return jsonify({'message': f'Error: Product does not exists!!'}), 404
        product = Product.query.get(product_id)
        cartCard = ProductUser.query.filter(ProductUser.user_id==current_user.id,
                                        ProductUser.product_id==product_id, 
                                        ProductUser.commit==False).first()
        if not cartCard:
                return jsonify({'message': f'Error: {product.name} not in your cart!!'}), 404
        else:
                if cartCard.quantity>0:
                        cartCard.quantity-=1
                else:
                        return jsonify({'message': f'Error: You do not have {product.name} in your cart!!'}), 404                
        try:
                db.session.commit()
                return jsonify({'message': f'Success: One {product.name} removed from your cart!!'}), 201
        except:
                return jsonify({'message': 'Error: Unknown server error!!'}), 500

@app.get('/customer/cart/delete/<int:product_id>')
@auth_required('token')
@roles_required('customer')
def delete_cart(product_id):
        if product_id==1:
                return jsonify({'message': 'Error: Base product can not deleted!!'}), 404
        if product_id<1:
                return jsonify({'message': 'Error: Invalide product ID!!'}), 404

        products = Product.query.all()
        product_ids = list(map(lambda x: x.id,products))
        if product_id not in product_ids:
                return jsonify({'message': f'Error: Product does not exists!!'}), 404
        product = Product.query.get(product_id)
        cartCard = ProductUser.query.filter(ProductUser.user_id==current_user.id,
                                        ProductUser.product_id==product_id, 
                                        ProductUser.commit==False).first()
        if not cartCard:
                return jsonify({'message': f'Error: {product.name} not in your cart!!'}), 404
        else:
                try:
                        db.session.delete(cartCard)
                        db.session.commit()
                        return jsonify({'message': f'Success: {product.name} deleted from your cart!!'}), 201
                except:
                        return jsonify({'message': 'Error: Unknown server error!!'}), 500

@app.post('/customer/buy')
@auth_required('token')
@roles_required('customer')
def buy_product():
        data = request.get_json()
        id = data.get('id')
        card = ProductUser.query.get(id)
        # print(card)
        if card is None:
                return jsonify({'message': 'Error: Transaction failed!!'}), 404
        if card.user_id!=current_user.id:
                return jsonify({'message': 'Error: Invalid access!!'}), 403
        if card.commit:
                return jsonify({'message': 'Error: Transacetion already complete!!'}), 404

        product = Product.query.get(card.product_id)
        if product.stock<=0:
                return jsonify({'message': f'Error: {product.name} is out of stock!!'}), 404
        if product.stock<card.quantity:
                return jsonify({'message': f'Error: Desired {product.name} quantity not avialable!!'}), 404
        
        current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
        card.commit = True
        card.transaction_date = current_time
        product.stock-=card.quantity
        try:
                db.session.commit()
        except Exception as e:
                # print(e)
                return jsonify({'message': 'Error: Unknown server error!!'}), 500
        return jsonify({'message': f'Success: Transaction completed!!'}), 201



        # for id in data.get('ids'):
        #         with db.session.begin():
        #                 start = time.time()
        #                 card = ProductUser.query.get(id)
        #                 if not card:
        #                         return jsonify({'message': 'Error: Transaction failed!!'}), 404
        #                 if card.user_id!=3:#current_user.id:
        #                         return jsonify({'message': 'Error: Invalid access!!'}), 403
        #                 if card.commit:
        #                         return jsonify({'message': 'Error: Transacetion already complete!!'}), 404
        #                 current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
        #                 card.commit = True
        #                 card.transaction_date = current_time
        #                 db.session.commit()
        #         time.sleep(5)
                        # break
        # try:
        #         db.session.commit()
        # except Exception as e:
        #         print(e)
        #         return jsonify({'message': 'Error: Unknown server error!!'}), 500
                        # break
        # print(time.time()-start)
        # return jsonify({'message': f'Success: Transaction completed!!'}), 201

class CategoryField(fields.Raw):
        def format(self, category):
                if category.active:
                        return category.name
                else:
                        return None
                
class DateFormat(fields.Raw):
    def format(self, value):
        return value.strftime('%Y-%m-%d')
    
class ManagerField(fields.Raw):
        def format(self, user):
                return user.email

product_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'cost': fields.Float,
        'stock': fields.Float,
        'type': fields.String,
        'manufacture_date': DateFormat,
        'expiry_date': DateFormat,
        'rating': fields.Integer,
        'category_id': fields.Integer,
        'manager_id': fields.Integer,
        'category': CategoryField
}

class ProductName(fields.Raw):
        def format(self, id):
                prod = Product.query.get(id)
                return marshal(prod,product_fields)

card_fields = {
        'id': fields.Integer,
        'product_id': ProductName,
        'quantity': fields.Float,
        'transaction_date': fields.DateTime
}
@app.get('/customer/cart/get')
@auth_required('token')
@roles_required('customer')
def get_cart():
        cards = ProductUser.query.filter_by(user_id=current_user.id, commit=False).all()
        # if not cards:
        #         return jsonify({'message': 'Error: No product in cart!!'}), 404
        return marshal(cards, card_fields)

@app.get('/customer/transactions')
@auth_required('token')
# @roles_required('customer')
def old_transaction():
        if 'manager' in current_user.roles:
                product_ids = list(map(lambda x: x.id, Product.query.filter_by(manager_id=current_user.id).all()))
                cards = ProductUser.query.filter(and_(ProductUser.product_id.in_(product_ids), ProductUser.commit==True)).all()
                # if not cards:
                #         return jsonify({'message': 'Error: No product sold!!'}), 404
        elif 'customer' in current_user.roles:
                cards = ProductUser.query.filter_by(user_id=current_user.id, commit=True).all()
                # if not cards:
                #         return jsonify({'message': 'Error: No product bought!!'}), 404
        else:        
                print('I am here')
                cards = ProductUser.query.filter_by(commit=True).all()
                # if not cards:
                #         return jsonify({'message': 'Error: Transaction chart empty!!'}), 404
        return marshal(cards, card_fields)


################################################ Manager ######################################################

category_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'active': fields.Boolean,
}
@app.get('/get/category')
@auth_required('token')
def category():
        roles = list(map(lambda x: x.name, current_user.roles))
        if 'manager' in roles:
                if not current_user.active:
                        return jsonify({'message': 'Not permitted!! Meet admit for account activation'}), 403
                categories = Category.query.filter(or_(Category.active==True, Category.creator_id==current_user.id)).all()
        elif 'customer' in roles:
                categories = Category.query.filter(Category.active==True).all()
        else:
                return jsonify({'message': 'Error: Method not allowed!!'}), 400
        # print(categories)
        if len(categories)==0:
                return jsonify({'message': 'Error: No category found!!'}), 400
        else:
                return marshal(categories, category_fields)

@app.post('/manager/add/category')
@auth_required('token')
@roles_required('manager')
def register_category():
        if not current_user.active:
                return jsonify({'message': 'Not permitted!! Meet admit for account activation'}), 403
        args = request.get_json()
        message = ''
        categories = Category.query.all()
        names = list(map(lambda x: x.name,categories))
        if args['name'] in names:
                return jsonify({'message': 'Error: Category name already exists!!'}), 404
        if args['name'] is None or args['name']=='':
                message += ', Warning: Please add category name!!'
        if args['description'] is None or args['description']=='':
                message += ', Warning: Please add category description!!'
        
        args['creator_id'] = current_user.id
        args['active'] = False
        
        try:
                category = Category(**args)
                db.session.add(category)
                db.session.commit()
                return jsonify({'message': f'Success: New Category {category.name} created!!'+message}), 201
        except:
                return jsonify({'message': 'Error: Unknown category commit error'}), 500

@app.get('/manager/request/edit/<int:id>')
@auth_required('token')
@roles_required('manager')
def request_edit_category(id):
        if not current_user.active:
                return jsonify({'message': 'Not permitted!! Meet admit for account activation'}), 403
        try:
                category = Category.query.get(id)
        except:
                return jsonify({'message': 'Error: Unknown category commit error'}), 500
        if not category:
                return jsonify({'message': 'Error: Invalid category ID'}), 404
        category.edit_request+=1
        db.session.commit()
        return jsonify({'message': 'Success: Edit request added, Admin is informed!!'})

@app.get('/manager/request/delete/<int:id>')
@auth_required('token')
@roles_required('manager')
def request_delete_category(id):
        if not current_user.active:
                return jsonify({'message': 'Not permitted!! Meet admit for account activation'}), 403
        try:
                category = Category.query.get(id)
        except:
                return jsonify({'message': 'Error: Unknown category commit error'}), 500
        if not category:
                return jsonify({'message': 'Error: Invalid category ID'}), 404
        category.delete_request+=1
        db.session.commit()
        return jsonify({'message': 'Success: Delete request added, Admin is informed!!'})

class CategoryField(fields.Raw):
        def format(self, category):
                if category.active:
                        return category.name
                else:
                        return None

class DateFormat(fields.Raw):
    def format(self, value):
        return value.strftime('%Y-%m-%d')
    
class ManagerField(fields.Raw):
        def format(self, user):
                return user.username

product_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'cost': fields.Float,
        'stock': fields.Float,
        'type': fields.String,
        'manufacture_date': DateFormat,
        'expiry_date': DateFormat,
        'rating': fields.Integer,
        'category_id': fields.Integer,
        'manager_id': fields.Integer,
        'category': CategoryField,
        'onboard_date': DateFormat,
        'manager': ManagerField
}
@app.get('/get/products')
def fetch_products():
        # products = Product.query.filter(Product.id==1)
        products = Product.query.join(Category).filter(Category.active == True).all()
        # print(products)
        return marshal(products,product_fields)

################################################ Admin ######################################################


class UserRole(fields.Raw):
        def format(self, role):
                return role.name

user_fields = {
        'id': fields.Integer,
        'username': fields.String,
        'email': fields.String,
        'active': fields.Boolean,
        'role': UserRole
}


@app.get('/get/admin')
@auth_required('token')
@roles_required('admin')
def admin():
        admin = User.query.filter(User.roles.any(Role.name == 'admin')).first()
        # print(current_user.roles)
        return marshal(admin, user_fields)

@app.get('/activate/manager/<int:manager_id>')
@auth_required('token')
@roles_required('admin')
def activate_manager(manager_id):
        manager = User.query.get(manager_id)
        if not manager:
                return jsonify({'message': 'Error: Manager not found!!'}), 404
        if 'manager' not in manager.roles:
                return jsonify({'message': 'Error: User is not a manager!!'}), 404
        
        manager.active = True
        db.session.commit()
        return jsonify({'message': f'Success: Manager {manager.username} activated!!'})

@app.get('/deactivate/manager/<int:manager_id>')
@auth_required('token')
@roles_required('admin')
def deactivate_manager(manager_id):
        manager = User.query.get(manager_id)
        if not manager:
                return jsonify({'message': 'Error: Manager not found!!'}), 404
        if 'manager' not in manager.roles:
                return jsonify({'message': 'Error: User is not a manager!!'}), 404
        
        manager.active = False
        db.session.commit()
        return jsonify({'message': f'Success: Manager {manager.username} deactivated!!'})

@app.get('/drop/user/<int:user_id>')
@auth_required('token')
@roles_required('admin')
def drop_user(user_id):
        user = User.query.get(user_id)
        if not user:
                return jsonify({'message': 'Error: User not found!!'}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': f'Success: User {user.username} removed!!'})


@app.get('/get/managers')
@auth_required('token')
@roles_required('admin')
def get_managers():
        managers = User.query.filter(User.roles.any(Role.name == 'manager')).all()
        if len(managers)==0:
                return jsonify({'message': 'Error: No manager found!!'}), 404
        return marshal(managers, user_fields)

@app.get('/get/customers')
@auth_required('token')
@roles_required('admin')
def get_customers():
        customers = User.query.filter(User.roles.any(Role.name == 'customer')).all()
        if len(customers)==0:
                return jsonify({'message': 'Error: No customer found!!'}), 404
        return marshal(customers, user_fields)

@app.get('/activate/category/<int:id>')
@auth_required('token')
@roles_required('admin')
def activate_category(id):
        category = Category.query.get(id)
        if not category:
                return jsonify({'message': 'Error: Category not found!!'}), 404
        
        category.active = True
        db.session.commit()
        return jsonify({'message': f'Success: Category {category.name} activated!!'})

@app.get('/deactivate/category/<int:id>')
@auth_required('token')
@roles_required('admin')
def deactivate_category(id):
        category = Category.query.get(id)
        if not category:
                return jsonify({'message': 'Error: Category not found!!'}), 404
        
        category.active = False
        db.session.commit()
        return jsonify({'message': f'Success: Category {category.name} deactivated!!'})





# @app.get('/download-csv')
# @auth_required('token')
# def download_csv():
        # task = create_resource_csv.apply_async(args=[marshal(current_user, user_fields)])
        # return jsonify({"task-id": task.id})


@app.get('/get-csv/<task_id>')
@auth_required('token')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        print(filename)
        # return 
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
    
@app.get('/manager/get/transaction/report')
@auth_required('token')
@roles_required('manager')
def get_transaction_report():
        task = create_transaction_csv.apply_async(args=[marshal(current_user, user_fields)])
        return jsonify({"task-id": task.id})

@app.get('/manager/download/transaction/report/<task_id>')
# @auth_required('token')
# @roles_required('manager')
def send_transaction_report(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        # print(filename,'is prepared!!')
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404

# create_product_csv
@app.get('/manager/get/product/report')
@auth_required('token')
@roles_required('manager')
def get_product_report():
        task = create_product_csv.apply_async(args=[marshal(current_user, user_fields)])
        return jsonify({"task-id": task.id})

@app.get('/manager/download/product/report/<task_id>')
# @auth_required('token')
# @roles_required('manager')
def send_product_report(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        print(filename,'is prepared!!')
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
