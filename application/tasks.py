from celery import shared_task
from .models import User
from sqlalchemy import or_, and_
import flask_excel as excel
# from .mail_service import send_message
from .models import User, Role, ProductUser, Product, db
from jinja2 import Template
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
