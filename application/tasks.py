from celery import shared_task
from .models import User
from sqlalchemy import or_, and_
import flask_excel as excel
# from .mail_service import send_message
from .models import User, Role, ProductUser, Product, db
from jinja2 import Template
from .service import send_message, create_pdf_report
import os
from datetime import datetime, timedelta
import pytz
# from flask_security import current_user, auth_required


# CSV file generation
@shared_task(ignore_result=False)
def create_transaction_csv(user=None):
        product_ids = list(map(lambda x: x.id, Product.query.filter_by(manager_id=user['id']).all()))
        commited_cards = ProductUser.query.filter(and_(ProductUser.product_id.in_(product_ids), ProductUser.commit==True)).all()
        commited_card_ids = list(map(lambda x: x.id, commited_cards))
        # print(commited_cards)
        
        results = db.session.query(ProductUser, Product).join(Product, Product.id == ProductUser.product_id).all()
        data = {
                'date':[],
                'name':[],
                'type':[],
                'price':[],
                'quantity':[],
                'bill_amount':[],
                'expiry': []
        }
                
        for (card,product) in results:
                if card.id in commited_card_ids:
                        data['date'].append(card.transaction_date)
                        data['name'].append(product.name)
                        data['type'].append(product.type)
                        data['price'].append(product.cost)
                        data['quantity'].append(card.quantity)
                        data['expiry'].append(product.expiry_date)
                        data['bill_amount'].append(product.cost*card.quantity)
        
        response = excel.make_response_from_dict(data, file_type='csv')

        # csv_output = excel.make_response_from_query_sets(commited_cards, ['id','username','email'], "csv")
        filename = "buffer/transaction_report.csv"

        with open(filename, 'wb') as f:
                f.write(response.data)

        return filename

@shared_task(ignore_result=False)
def create_product_csv(user=None):
        products = Product.query.filter_by(manager_id=user['id']).with_entities(Product.id, 
                                                                                Product.name, 
                                                                                Product.cost, 
                                                                                Product.stock, 
                                                                                Product.type, 
                                                                                Product.manufacture_date, 
                                                                                Product.expiry_date, 
                                                                                Product.onboard_date, 
                                                                                Product.category_id
                                                                                ).all()
        # response = excel.make_response_from_dict(data, file_type='csv')
        cols = ['id','name','cost', 'stock', 'type', 'manufacture_date', 'expiry_date', 'onboard_date', 'category_id']
        response = excel.make_response_from_query_sets(products, cols, "csv")
        filename = "buffer/product_report.csv"

        with open(filename, 'wb') as f:
                f.write(response.data)

        return filename


# @shared_task(ignore_result=False)
# def customer_month_transactions_pdf(user=None):
#         results = db.session.query(ProductUser, Product).join(Product, Product.id == ProductUser.product_id).all()
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
#         # last_month_date = current_time - timedelta(days=2)
#         month = current_time.strftime('%B') 
#         year = current_time.strftime('%Y')
        
#         transaction = []
#         total = 0
#         data = {}
#         data['email'] = user['email']
#         data['username'] = user['username']
#         data['month'] = month
#         data['year'] = year
#         for (card,product) in results:
#                 cardData = {}
#                 transaction_date = card.transaction_date
#                 if transaction_date:
#                         transaction_date = pytz.timezone('Asia/Kolkata').localize(transaction_date)
#                         del_time = current_time-transaction_date
#                 if card.user_id==user['id'] and card.commit and del_time <= timedelta(days=int(current_time.day)):
#                         manager = User.query.get(product.manager_id)
#                         cardData['name'] = product.name
#                         cardData['seller'] = manager.username
#                         cardData['quantity'] = card.quantity
#                         cardData['type'] = product.type
#                         cardData['cost'] = product.cost
#                         cardData['transaction_date'] = card.transaction_date.strftime("%Y-%m-%d %H:%M")
#                         total += product.cost*card.quantity
#                         transaction.append(cardData)
                
#         data['transaction'] = transaction
#         data['total'] = total
#         file = 'application/templates/this_month_transaction.html'
#         output_file = 'customer_transaction.pdf'
#         create_pdf_report(file=file, data=data, output_file=output_file)
#         # print(data)
#         return output_file 


# email

@shared_task(ignore_result=True)
def customer_monthly_transactions(subject):
        users = User.query.filter(User.roles.any(Role.name == 'customer')).all()
        results = db.session.query(ProductUser, Product).join(Product, Product.id == ProductUser.product_id).all()
        current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
        last_month_date = current_time - timedelta(days=2)
        month = last_month_date.strftime('%B') 
        year = last_month_date.strftime('%Y')
        for user in users:
                transaction = []
                total = 0
                for (card,product) in results:
                        cardData = {}
                        transaction_date = card.transaction_date
                        if transaction_date:
                                transaction_date = pytz.timezone('Asia/Kolkata').localize(transaction_date)
                                del_time = current_time-transaction_date
                        if card.user_id==user.id and card.commit and del_time <= timedelta(days=30):
                                manager = User.query.get(product.manager_id)
                                cardData['name'] = product.name
                                cardData['seller'] = manager.username
                                cardData['quantity'] = card.quantity
                                cardData['type'] = product.type
                                cardData['cost'] = product.cost
                                cardData['transaction_date'] = card.transaction_date
                                total += product.cost*card.quantity
                                transaction.append(cardData)

                with open('application/templates/monthly_bill.html', 'r') as f:
                        template = Template(f.read())
                        send_message(user.email, subject, template.render(username=user.username, month=month, year=year, transaction=transaction, total=total))
                # break
        return "OK"
                                
@shared_task(ignore_result=False)
def customer_daily_request(subject=None):
        users = User.query.filter(User.roles.any(Role.name == 'customer')).all()
        results = db.session.query(ProductUser, Product).join(Product, Product.id == ProductUser.product_id).all()
        for user in users:
                cart = []
                dateRef = datetime.min
                for (card,product) in results:
                        cardData = {}
                        if card.user_id==user.id and not card.commit:
                                manager = User.query.get(product.manager_id)
                                cardData['name'] = product.name
                                cardData['seller'] = manager.username
                                cardData['quantity'] = card.quantity
                                cardData['type'] = product.type
                                cardData['cost'] = product.cost
                                cart.append(cardData)
                        if card.user_id==user.id and card.commit:
                                if card.transaction_date > dateRef:
                                        dateRef = card.transaction_date
                if dateRef==datetime.min:
                        isBought = False
                else:
                        isBought = True
                        date = dateRef.day
                        month = dateRef.strftime('%B')
                        year = dateRef.year
                with open('application/templates/daily_reminder.html', 'r') as f:
                        template = Template(f.read())
                        send_message(to=user.email, 
                                     subject=f'OPS Mart: 🌟 We Miss You {user.username}! 🌟', 
                                     content_body=template.render(username=user.username, 
                                                                  month=month, 
                                                                  year=year,
                                                                  date=date, 
                                                                  cart=cart, 
                                                                  isBought=isBought)
                                                                  )
                # break
        return "OK"


# clear memory
@shared_task(ignore_result=False)
def clear_memory(directory_path):
        try:
                files = os.listdir(directory_path)
                for file_name in files:
                        file_path = os.path.join(directory_path, file_name)
                        if os.path.isfile(file_path):
                                os.remove(file_path)
                                print(f"Removed: {file_path}")

                print(f"All files in {directory_path} have been cleared.")
        except Exception as e:
                print(f"An error occurred while clearing the directory: {e}")