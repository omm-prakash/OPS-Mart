from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

# ref: https://pythonhosted.org/Flask-Security/quickstart.html#id2

db = SQLAlchemy()


class RoleUser(db.Model):
        __tablename__='roles_users'
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer(),db.ForeignKey('user.id'))
        role_id = db.Column(db.Integer(),db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
        __tablename__='user'
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String, unique=False)
        email = db.Column(db.String, unique=True, nullable=False)
        password = db.Column(db.String(255))
        active = db.Column(db.Boolean, default=True)
        fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
        roles = db.relationship('Role', 
                                secondary='roles_users',
                                backref=db.backref('users', lazy='dynamic'))
        products = db.relationship('Product', 
                                   secondary='products_users',
                                   backref=db.backref('users', lazy='dynamic'))

class Role(db.Model, RoleMixin):
        __tablename__='role'
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(80), unique=True)
        description = db.Column(db.String(255))

# customer transaction
class ProductUser(db.Model):
        __tablename__='products_users'
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
        product_id = db.Column(db.Integer,db.ForeignKey('product.id'))
        # rating = db.Column(db.Integer, default=None)
        quantity = db.Column(db.Float, default=0)
        commit = db.Column(db.Boolean, default=False)
        transaction_date = db.Column(db.DateTime, default=None)

class Category(db.Model):
        __tablename__='category'
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(80), unique=True, nullable=False)
        description = db.Column(db.String(255))
        active = db.Column(db.Boolean, default=True)
        edit_request = db.Column(db.Integer, default=0)
        delete_request = db.Column(db.Integer, default=0)
        creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), default=1)
        creator = db.relationship('User', backref=db.backref('categories'))

class Product(db.Model):
        __tablename__='product'
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String, nullable=False)
        cost = db.Column(db.Float, nullable=False)
        stock = db.Column(db.Float, nullable=False)
        type = db.Column(db.String(5), nullable=False) # ltr/kg/unit

        manufacture_date = db.Column(db.DateTime)
        expiry_date = db.Column(db.DateTime)
        onboard_date = db.Column(db.DateTime)     

        # rating = db.Column(db.Integer)
        # realation with category
        category_id = db.Column(db.Integer, db.ForeignKey('category.id'), default=1)
        category = db.relationship('Category', backref=db.backref('products')) # Category.query.get(category_id)

        # realation with category
        manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), default=2)
        manager = db.relationship('User', backref=db.backref('sells')) # Category.query.get(category_id)
