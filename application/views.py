from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required, current_user
from .models import db, User, Product, ProductUser, Role, Category
from .sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields


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

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
}

@app.get('/profile1')
@auth_required('token')
# @roles_required('admin')
def profile1():
        print(current_user)
        return marshal(current_user, user_fields)


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


@app.get('/cart/add/<int:product_id>/<float:quantity>')
@auth_required('token')
@roles_required('customer')
def add_to_cart(product_id, quantity):
        if product_id==1:
                return jsonify({'message': 'Error: Base product can not be added to cart!!'}), 404
        if product_id<1:
                return jsonify({'message': 'Error: Invalide product ID!!'}), 404
        products = Product.query.all()
        product_ids = list(map(lambda x: x.id,products))
        # if args['id'] not in ids:
        #         return jsonify({'message': 'Error: Product does not exists!!'}), 404
        
        product = Product.query.get(product_id)
        if product.stock<=0:
                return jsonify({'message': 'Error: Sorry, product is "Out Of Stock"!!'}), 404
        if quantity>product.stock:
                return jsonify({'message': 'Error: Sorry, product out of stock!!'}), 404
        
        # try: 
        cartCard = ProductUser.query.filter(ProductUser.user_id==current_user.id,
                                        ProductUser.product_id==product_id, 
                                        ProductUser.commit==False).first()
        if not cartCard:
                cardCard = ProductUser(user_id=current_user.id,product_id=product_id,quantity=quantity)
                db.session.add(cardCard)
        else:
                cartCard.quantity += quantity
        
        try:
                db.session.commit()
                return jsonify({'message': 'Success: Product added to the cart!!'}), 201
        except:
                return jsonify({'message': 'Error: Unknown server error!!'}), 500

# @app.get('/cart/remove/<int:product_id>')
# @app.get('/cart/remove/<int:product_id>/<float:quantity>')
# @auth_required('token')
# @roles_required('customer')


