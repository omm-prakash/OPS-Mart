from datetime import datetime
import datetime as dt
import random
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
                datastore.create_user(username='Alisha', email='admin@omart.com', password=generate_password_hash('admin'), roles=['admin'])
        if not datastore.find_user(email='manager@omart.com'):
                datastore.create_user(username='Manager Lead', email='manager@omart.com', password=generate_password_hash('manager'), roles=['manager'], active=True)
        if not datastore.find_user(email='customer1@omart.com'):
                datastore.create_user(username='Customer Lead', email='customer@omart.com', password=generate_password_hash('customer'), roles=['customer'])
        db.session.commit()

        # base category
        category = Category(name='Global', description='This the default category for any product without category declaration during declaration.')
        db.session.add(category)
        db.session.commit()

        # base product
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')) #.strftime("%d/%m/%y %H:%M:%S")
        product = Product(name='base', cost=0, stock=1, type='ltr', manufacture_date=current_time)
        db.session.add(product)
        db.session.commit()
 


        # random data addition
        users = ['Ram', 'Hari', 'Raghu', 'Omm', 'Rakesh']
        email_domain = 'omart.com'
        for user in users:
                email = f'{user.lower()}@omart.com'
                if not datastore.find_user(email=email):
                        datastore.create_user(username=user, 
                                              email=email, 
                                              password=generate_password_hash(user.lower()), 
                                              roles=['customer'])
        db.session.commit()
        print('following users added to database:',users)
        
        managers = ['Rahul', 'Raj']
        email_domain = 'omart.com'
        for user in managers:
                email = f'{user.lower()}@omart.com'
                if not datastore.find_user(email=email):
                        datastore.create_user(username=user, 
                                              email=email, 
                                              password=generate_password_hash(user.lower()), 
                                              roles=['manager'])
        db.session.commit()
        
        managers1 = ['Avinash', 'Naman']
        email_domain = 'omart.com'
        for user in managers1:
                email = f'{user.lower()}@omart.com'
                if not datastore.find_user(email=email):
                        datastore.create_user(username=user, 
                                              email=email, 
                                              password=generate_password_hash(user.lower()), 
                                              roles=['manager'],
                                              active=False)
        db.session.commit()
        print('following managers added to database:',managers+managers1)

        # by admin
        category = Category(name='Food', description='This category contain all types of food items')
        db.session.add(category)
        category = Category(name='Decoration', description='This category contain all types home design objects')
        db.session.add(category)

        # by Rahul        
        category = Category(name='Drinks', description='This category contain all types of cold drink items', creator_id=9)
        db.session.add(category)
        
        # by Raj
        category = Category(name='Dress', description='This category contain all types of fashion items', creator_id=10, active=False)
        db.session.add(category)
        
        db.session.commit()
        print('Category Food, Decoration, Drink, Dress added')

        # adding product 
        def time():
                current_time = datetime.now(pytz.timezone('Asia/Kolkata'))#.strftime("%d/%m/%y %H:%M:%S")
                manuf = current_time - dt.timedelta(days=random.randint(10,40))
                exp = current_time + dt.timedelta(days=random.randint(10,365))
                return (current_time, manuf, exp)
        
        (c,m,e) = time()
        product = Product(name='Biriyani', cost=100, stock=10, type='kg', 
                          manufacture_date=m,
                           expiry_date=e,
                            onboard_date=c,
                             category_id = 2, )
        db.session.add(product)
        db.session.commit()
        print('product Biriyani added')

        (c,m,e) = time()
        product = Product(name='Door Screen', cost=1000, stock=16, type='unit', 
                          manufacture_date=m,
                           expiry_date=e,
                            onboard_date=c,
                             category_id = 3 )
        db.session.add(product)
        db.session.commit()
        print('product Door Screen added')

        (c,m,e) = time()
        product = Product(name='Sprit', cost=30, stock=100, type='unit', 
                          manufacture_date=m,
                           expiry_date=e,
                            onboard_date=c,
                             category_id = 4,
                             manager_id=9)
        db.session.add(product)
        db.session.commit()
        print('product Sprit added')
