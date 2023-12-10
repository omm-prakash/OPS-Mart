from datetime import datetime
import pytz
from main import app
from application.models import db, Role, Category, Product
from application.sec import datastore
# from flask_security.utils import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
        db.create_all()
        datastore.find_or_create_role(name='admin', description='user is an admin')
        datastore.find_or_create_role(name='manager', description='user is an manager')
        datastore.find_or_create_role(name='customer', description='user is an customer')
        # print('error loc 1')
        db.session.commit()

        if not datastore.find_user(email='admin@omart.com'):
                datastore.create_user(username='OPS', email='admin@omart.com', password=generate_password_hash('admin'), roles=['admin'])
        if not datastore.find_user(email='manager@omart.com'):
                datastore.create_user(username='Manager Lead', email='manager@omart.com', password=generate_password_hash('manager'), roles=['manager'], active=True)
        if not datastore.find_user(email='customer1@omart.com'):
                datastore.create_user(username='Customer Lead', email='customer@omart.com', password=generate_password_hash('customer'), roles=['customer'])
        db.session.commit()
        # admin = Role(id='admin', name='Admin', description='has superior power of application, manage product category and managers')
        # manager = Role(id='manager', name='Manager', description='manage products')
        # user = Role(id='user', name='Customer', description='customer of products')

        # db.session.add(admin)
        # db.session.add(manager)
        # db.session.add(user)
        # try:
        #         db.session.commit()
        # except:
        #         pass

        # creating global category
        category = Category(name='Global', description='This the default category for any product without category declaration during declaration.')
        db.session.add(category)
        db.session.commit()

        # base product
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')) #.strftime("%d/%m/%y %H:%M:%S")
        product = Product(name='base', cost=0, stock=1, type='ltr', manufacture_date=current_time)
        db.session.add(product)
        db.session.commit()
 