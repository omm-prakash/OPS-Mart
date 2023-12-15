from datetime import datetime
import pytz
from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from .utils import *
# from .validation import *
from .models import db, Category, Product, User
from flask import abort, jsonify, make_response

api = Api(prefix='/api')


parser = reqparse.RequestParser()
parser.add_argument('id', type=int, help="Error: ID is required and should be in integer format and distinct", required=True)
parser.add_argument('username', type=str, help="Error: Username is required and should be in string format", required=True)
parser.add_argument('email', type=str, help="Error: Email is required and should be in string format", required=True)
parser.add_argument('password', type=str, help="Error: Password should be in string format", required=True)
parser.add_argument('active', type=bool, help="Error: Active should be in boolean format", required=False)
parser.add_argument('fs_uniquifier', type=str, help="Error: fs_uniquifier should be in string format", required=True)


user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'password': fields.String,
    'active': fields.Boolean,
    'fs_uniquifier': fields.String,
    'roles': fields.List(fields.Nested({
        'name': fields.String,
        'description': fields.String,
    })),
    'products': fields.List(fields.Nested({
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        # Include additional fields for 'Product' as needed
    })),
}

class User(Resource):
        def get(self):
                return {'message':'hello world from api!!'}
        def post(self):
                pass



parser = reqparse.RequestParser()
def category_parser(required=True):
        parser.add_argument('id', type=int, help="Error: ID is required and should be in integer format and distinct", required=required)
        parser.add_argument('name', type=str, help="Error: Name is required and should be in string format", required=True)
        parser.add_argument('description', type=str, help="Description should be in string format", default=None)
        return parser

category_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'active': fields.Boolean,
        'edit_request': fields.Integer,
        'delete_request': fields.Integer,
}
class CategoryResource(Resource):
        @auth_required('token')
        @roles_required('admin')
        def get(self, id):
                try:
                        if id==0:
                                categories = Category.query.all()
                                # print(categories)
                                return marshal(categories,category_fields)
                        elif id==1:
                                category = Category.query.get(id)
                                return category
                        else:
                                category = Category.query.get(id)
                                if category:
                                        return marshal(categories,category_fields)
                                else:
                                        return jsonify({'message': 'Error: Category does not exist!!'}), 404
                except:
                        return jsonify({'message': 'Error: Unknown error occure!!'}), 500
        
        @auth_required('token')
        @roles_required('admin')
        def post(self):
                parser = category_parser(False)
                args = parser.parse_args()
                print(args)
                message = ''
                categories = Category.query.all()
                # ids = list(map(lambda x: x.id,categories)) 
                names = list(map(lambda x: x.name,categories))
                # if args['id']==1:
                #         return jsonify({'message': 'Error: New global category can not be build!!'}), 405
                # if args['id'] in ids:
                #         return jsonify({'message': 'Error: Category already exists!!'}), 404
                if args['name'] in names:
                        return jsonify({'message': 'Error: Category name already exists!!'}), 404
                if args['name'] is None or args['name']=='':
                        message += ', Warning: Please add category name!!'
                if args['description'] is None or args['description']=='':
                        message += ', Warning: Please add category description!!'
                
                try:
                        category = Category(**args)
                        db.session.add(category)
                        db.session.commit()
                        return make_response(jsonify({'message': f'Success: New Category {category.name} created!!'+message}), 201)
                except:
                        return make_response(jsonify({'message': 'Error: Unknown category commit error'}), 500)
        
        @auth_required('token')
        @roles_required('admin')
        def delete(self,id):
                categories = Category.query.all()
                ids = list(map(lambda x: x.id,categories)) 
                
                if id==1:
                        return make_response(jsonify({'message': 'Error: Global category can not be deleted!!'}), 405)
                if id not in ids:
                        return make_response(jsonify({'message': 'Error: Category does not exists!!'}), 404)
                try:
                        category = Category.query.get(id)
                        db.session.delete(category)
                        db.session.commit()
                        return make_response(jsonify({'message': f'Success: Category {category.name} deleted!!'}), 201)
                except:
                        return make_response(jsonify({'message': 'Error: Unknown category commit error'}), 404)
        
        @auth_required('token')
        @roles_required('admin')
        def put(self):
                parser = category_parser(True)
                args = parser.parse_args()
                message = ''
                categories = Category.query.all()
                category = Category.query.get(args['id'])
                ids = list(map(lambda x: x.id,categories)) 
                print(args)
                if args['id']==1:
                        return make_response(jsonify({'message': 'Error: Global category can not be updated!!'}), 405)
                if args['id'] not in ids:
                        return make_response(jsonify({'message': 'Error: Category does not exists!!'}), 404)
                if args['name'] is None or args['name']=='':
                        message += ', Warning: Please add category name!!'
                if args['name'] != category.name and args['name'] in list(map(lambda x: x.name,categories)):
                        return make_response(jsonify({'message': 'Error: Category name already exists!!'}), 404)
                if args['description'] is None or args['description']=='':
                        message += ', Warning: Please add category description!!'
                try:
                        
                        category.name = args['name']
                        category.description = args['description']
                        db.session.commit()
                        return make_response(jsonify({'message': f'Success: Category {args["name"]} updated!!'+message}), 201)
                except:
                        return make_response(jsonify({'message': 'Error: Unknown category commit error'}), 500)

def product_parser(required=True,id_required=False):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=int, help="Error: ID should be in integer format and distinct", required=id_required)
        parser.add_argument('name', type=str, help="Error: Name should be in string format", required=required)
        parser.add_argument('cost', type=float, help="Error: Cost should be in float format", required=required)
        parser.add_argument('stock', type=float, help="Error: Stock should be in float format", required=required)
        parser.add_argument('type', type=str, help="Error: Type should be in string format", required=required)
        parser.add_argument('manufacture_date', type=str, help="Error: Manufacture date should be in string of with format 'YYYY-MM-DD'", default=None)
        parser.add_argument('expiry_date', type=str, help="Error: Expiry date should be in string of with format 'YYYY-MM-DD'", default=None)
        # parser.add_argument('rating', type=int, help="Error: Rating should be in integer format")
        parser.add_argument('category_id', type=int, help="Error: Category ID should be in integer format", default=1)
        # parser.add_argument('manager_id', type=int, help="Error: Manager ID should be in integer format", required=True)
        return parser

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
class ProductResource(Resource):
        @auth_required('token')
        @roles_required('manager')
        def get(self):
                try:
                        manager_id = current_user.id
                        products = Product.query.filter(Product.manager_id==manager_id).all()
                except:
                        make_response(jsonify({'message': 'Error: Unknown error occure!!'}), 500)
                if len(products)==0:
                        return make_response(jsonify({'message': 'Error: No product avialable!!'}), 404)
                return marshal(products,product_fields)

        @auth_required('token')
        @roles_required('manager')
        def post(self):
                parser = product_parser(required=True, id_required=False)
                args = parser.parse_args()
                
                message = ''
                category_ids = list(map(lambda x: x.id,Category.query.all()))
                if args['name'] is None or args['name']==' ':
                        message += ', Warning: Please add product name!!'
                if args['cost'] is not None and args['cost']<0:
                        return make_response(jsonify({'message': 'Error: Product cost can not be negative!!'}), 404)
                if args['stock'] is not None and args['stock']<0:
                        return make_response(jsonify({'message': 'Error: Product stock can not be negative!!'}), 404)
                if args['type'] is not None and args['type'] not in ['ltr','kg','unit']:
                        return make_response(jsonify({'message': 'Error: Product type should among ltr/kg/unit!!'}), 404)
                if args['category_id'] is not None and args['category_id'] != 1 and args['category_id'] not in category_ids:
                        return make_response(jsonify({'message': 'Error: Product category not exists!!'}), 404)
                current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
                if args['manufacture_date'] is not None:
                        if not is_valid_datetime_format(args['manufacture_date']):
                                return make_response(jsonify({'message': "Error: Manufacture date should be in string of with format 'YYYY-MM-DD'"}), 404)
                        else:
                                manufacture_date = datetime.strptime(args['manufacture_date'], '%Y-%m-%d')
                                manufacture_date = pytz.timezone('Asia/Kolkata').localize(manufacture_date)
                                if manufacture_date>current_time:
                                        # print(manufacture_date)
                                        return make_response(jsonify({'message': "Error: Not manufactured!"}), 404)
                                args['manufacture_date'] = manufacture_date
                
                if args['expiry_date'] is not None:
                        if not is_valid_datetime_format(args['expiry_date']):
                                return make_response(jsonify({'message': "Error: Expiry date should be in string of with format 'YYYY-MM-DD'"}), 404)
                        else:
                                expiry_data = datetime.strptime(args['expiry_date'], '%Y-%m-%d')
                                expiry_data = pytz.timezone('Asia/Kolkata').localize(expiry_data)
                                if expiry_data<current_time:
                                        return make_response(jsonify({'message': "Error: Expired product!"}), 404)
                                args['expiry_date'] = expiry_data
                if args['manufacture_date'] is not None and args['expiry_date'] is not None and args['manufacture_date']>args['expiry_date']:
                        return make_response(jsonify({'message': "Error: Expiry date after manufacturing date"}), 404)
                args['manager_id'] = current_user.id
                args['onboard_date'] = current_time

                try:
                        product = Product(**args)
                        db.session.add(product)
                        db.session.commit()
                        return make_response(jsonify({'message': f'Success: New produst {product.name} created!!'+message}), 201)
                except:
                        return make_response(jsonify({'message': 'Error: Unknown category commit error'}), 500)
        
        @auth_required('token')
        @roles_required('manager')
        def delete(self,id):
                products = Product.query.all()
                ids = list(map(lambda x: x.id,products)) 
                if id==1:
                        return make_response(jsonify({'message': 'Error: Base product can not be deleted!!'}), 405)
                if id not in ids:
                        return make_response(jsonify({'message': 'Error: Product does not exists!!'}), 404)
                product = Product.query.get(id)
                if product.manager_id != current_user.id:
                        return make_response(jsonify({'message': 'Error: Product can not be deleted by current manager!!'}), 403)
                
                try:
                        db.session.delete(product)
                        db.session.commit()
                        return make_response(jsonify({'message': f'Success: Product {product.name} deleted!!'}), 201)
                except :
                        return make_response(jsonify({'message': 'Error: Unknown category commit error'}), 404)

        @auth_required('token')
        @roles_required('manager')
        def put(self):
                parser = product_parser(required=False, id_required=True)
                print(parser)
                args = parser.parse_args()
                message = ''
                products = Product.query.all()
                product = Product.query.get(args['id'])
                ids = list(map(lambda x: x.id,products)) 
                category_ids = list(map(lambda x: x.id,Category.query.all()))
                
                if args['id']==1:
                        return make_response(jsonify({'message': 'Error: Base product can not be updated!!'}), 405)
                if args['id'] not in ids:
                        return make_response(jsonify({'message': 'Error: Product does not exists!!'}), 404)
                if product.manager_id != current_user.id:
                        return make_response(jsonify({'message': 'Error: Product can not be updated by current manager!!'}), 403)
                
                
                if args['name'] is not None and args['name']=='':
                        message += ', Warning: Please add product name!!'
                # if args['id']<0:
                #         return {'message': 'Error: Product ID can not be negative!!'}, 404
                if args['cost'] is not None and args['cost']<0:
                        return make_response(jsonify({'message': 'Error: Product cost can not be negative!!'}), 404)
                if args['stock'] is not None and args['stock']<0:
                        return make_response(jsonify({'message': 'Error: Product stock can not be negative!!'}), 404)
                if args['type'] is not None and args['type'] not in ['ltr','kg','unit']:
                        return make_response(jsonify({'message': 'Error: Product type should among ltr/kg/unit!!'}), 404)
                # if args['manager_id']<0:
                #         return {'message': 'Error: Manager ID can not be negative!!'}, 404
                if args['category_id'] != 1 and args['category_id'] not in category_ids:
                        return make_response(jsonify({'message': 'Error: Product category not exists!!'}), 404)
                
                # datatime handle
                if args['manufacture_date'] is not None:
                        if not is_valid_datetime_format(args['manufacture_date']):
                                return make_response(jsonify({'message': "Error: Manufacture date should be in string of with format 'YYYY-MM-DD'"}), 404)
                        else:
                                args['manufacture_date'] = datetime.strptime(args['manufacture_date'], '%Y-%m-%d')
                if args['expiry_date'] is not None:
                        if not is_valid_datetime_format(args['expiry_date']):
                                return make_response(jsonify({'message': "Error: Expiry date should be in string of with format 'YYYY-MM-DD'"}), 404)
                        else:
                                args['expiry_date'] = datetime.strptime(args['expiry_date'], '%Y-%m-%d')
                if args['manufacture_date'] is not None and args['expiry_date'] is not None and args['manufacture_date']>args['expiry_date']:
                        return make_response(jsonify({'message': "Error: Expiry date after manufacturing date"}), 404)

                
                args['manager_id'] = current_user.id
                try:
                        for key in args.keys():
                                if args[key] is not None:
                                        setattr(product, key, args[key])
                        db.session.commit()
                        return make_response(jsonify({'message': f'Success: Product {product.name} updated!!'+message}), 201)
                except:
                        return make_response(jsonify({'message': 'Error: Unknown prduct commit error'}), 500)

class UserRole(fields.Raw):
        def format(self, roles):
                print(roles[0].name)
                return roles[0].name
        
user_fields = {
        'id': fields.Integer,
        'username': fields.String,
        'email': fields.String,
        'active': fields.Boolean,
        'roles': UserRole
}

class Profile(Resource):
        @auth_required('token')
        def get(self):
                # print(current_user, current_user.email)
                return marshal(current_user, user_fields)

api.add_resource(User, '/user')
api.add_resource(Profile, '/profile')
api.add_resource(CategoryResource, '/category', '/category/<int:id>')
api.add_resource(ProductResource, '/product', '/product/<int:id>')