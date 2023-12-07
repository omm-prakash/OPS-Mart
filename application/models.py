from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

roles_users = db.Table('roles_users',
                       db.Column('user_id',db.Integer(),db.ForeignKey('user.id')),
                       db.Column('role_id',db.Integer(),db.ForeignKey('role.id')))

categories_users = db.Table('categories_users',
                            db.Column('user_id',db.Integer(),db.ForeignKey('user.id')),
                            db.Column('category_id',db.Integer(),db.ForeignKey('category.id')))

class User(db.Model, UserMixin):
        __tablename__='user'
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String, unique=False)
        email = db.Column(db.String, unique=True)
        password = db.Column(db.String(255))
        active = db.Column(db.Boolean())
        fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
        roles = db.relationship('Role', 
                                secondary='roles_users',
                                backref=db.backref('users', lazy='dynamic'))
        products = db.relationship('Product', 
                                   secondary='products_users',
                                   backref=db.backref('users', lazy='dynamic'))
        categories = db.relationship('Category', 
                                     secondary='categories_users',
                                     backref=db.backref('users', lazy='dynamic'))

class Role(db.Model, RoleMixin):
        __tablename__='role'
        id = db.Column(db.String, primary_key=True)
        name = db.Column(db.String(80), nullable=False)
        description = db.Column(db.String(255))

products_users = db.Table('products_users',
                          db.Column('product_id',db.Integer(),db.ForeignKey('product.id')),
                          db.Column('user_id',db.Integer(),db.ForeignKey('user.id')),
                          db.Column('rating',db.Integer()),
                          db.Column('quantity', db.Float(), nullable=False))

class Product(db.Model):
        __tablename__='product'
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String, nullable=False)
        cost = db.Column(db.Float, nullable=False)
        stock = db.Column(db.Float, nullable=False)
        type = db.Column(db.String(5), nullable=False) # ltr/kg/unit

        manufacture_date = db.Column(db.DateTime)
        expiry_date = db.Column(db.DateTime)

        rating = db.Column(db.Integer)
        # realation with category
        category_id = db.Column(db.String(50), db.ForeignKey('category.id'))
        category = db.relationship('Category', backref=db.backref('products'))

class Category(db.Model):
        __tablename__='category'
        id = db.Column(db.String(50), primary_key=True)
        name = db.Column(db.String(80), unique=True)
        description = db.Column(db.String(255))