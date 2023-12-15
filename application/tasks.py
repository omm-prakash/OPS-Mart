from celery import shared_task
from .models import User
from sqlalchemy import or_, and_
import flask_excel as excel
# from .mail_service import send_message
from .models import User, Role, ProductUser, Product, db
from jinja2 import Template
from .mail_service import send_message

from datetime import datetime, timedelta
import pytz
# from flask_security import current_user, auth_required

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
        filename = "transaction_report.csv"

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
        filename = "product_report.csv"

        with open(filename, 'wb') as f:
                f.write(response.data)

        return filename

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

                with open('application/email/monthly_bill.html', 'r') as f:
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
                with open('application/email/daily_reminder.html', 'r') as f:
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
