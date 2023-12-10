from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required, current_user
from .models import db, User, Product, ProductUser
from .sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash

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

# class User(db.Model, UserMixin):
#         __tablename__='user'
#         id = db.Column(db.Integer, primary_key=True)
#         username = db.Column(db.String, unique=False)
#         email = db.Column(db.String, unique=True, nullable=False)
#         password = db.Column(db.String(255))
#         active = db.Column(db.Boolean, default=True)
#         fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
#         roles = db.relationship('Role', 
#                                 secondary='roles_users',
#                                 backref=db.backref('users', lazy='dynamic'))
#         products = db.relationship('Product', 
#                                    secondary='products_users',
#                                    backref=db.backref('users', lazy='dynamic'))
        
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

@app.get('/admin')
@auth_required('token')
@roles_required('admin')
def admin():
        return "welcome admin from OPS"

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
        return jsonify({'message': 'Success: Manager activated!!'})

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
        if args['id'] not in ids:
                return jsonify({'message': 'Error: Product does not exists!!'}), 404
        
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


