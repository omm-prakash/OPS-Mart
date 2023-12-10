from flask_restful import Resource, Api, reqparse, fields, marshal_with
from flask_security import auth_required, roles_required, current_user
from .utils import *
# from .validation import *
from .models import db, Category, Product, User
from flask import abort, jsonify

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
parser.add_argument('id', type=int, help="Error: ID is required and should be in integer format and distinct", required=True)
parser.add_argument('name', type=str, help="Error: Name is required and should be in string format", required=True)
parser.add_argument('description', type=str, help="Description should be in string format", default=None)

category_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
}
class CategoryResource(Resource):
        @marshal_with(category_fields)
        def get(self, id):
                try:
                        if id==0:
                                categories = Category.query.all()
                                return categories
                        elif id==1:
                                category = Category.query.get(id)
                                return category
                        else:
                                category = Category.query.get(id)
                                if category:
                                        return category
                                else:
                                        # return abort(500, description='Category does not exist!!')
                                        # raise NotFoundError('asdaas', 400)
                                        return {'message': 'Error: Category does not exist!!'}, 404
                except:
                        raise abort(500, description='Error: Unknown error occure!!')
        
        @auth_required('token')
        @roles_required('admin')
        def post(self):
                args = parser.parse_args()
                message = ''
                categories = Category.query.all()
                ids = list(map(lambda x: x.id,categories)) 
                names = list(map(lambda x: x.name,categories))
                if args['id']==1:
                        return jsonify({'message': 'Error: New global category can not be build!!'}), 405
                if args['id'] in ids:
                        return jsonify({'message': 'Error: Category already exists!!'}), 404
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
                        return jsonify({'message': f'Success: New Category {category.name} created!!'+message}), 201
                except:
                        return jsonify({'message': 'Error: Unknown category commit error'}), 500
        
        @auth_required('token')
        @roles_required('admin')
        def delete(self,id):
                categories = Category.query.all()
                ids = list(map(lambda x: x.id,categories)) 
                if id==1:
                        return jsonify({'message': 'Error: Global category can not be deleted!!'}), 405
                if id not in ids:
                        return jsonify({'message': 'Error: Category does not exists!!'}), 404
                try:
                        category = Category.query.get(id)
                        db.session.delete(category)
                        db.session.commit()
                        return jsonify({'message': f'Success: Category {category.name} deleted!!'}), 201
                except Exception as e:
                        return jsonify({'message': 'Error: Unknown category commit error'}), 404
        
        @auth_required('token')
        @roles_required('admin')
        def put(self):
                args = parser.parse_args()
                message = ''
                categories = Category.query.all()
                ids = list(map(lambda x: x.id,categories)) 
                if args['id']==1:
                        return jsonify({'message': 'Error: Global category can not be updated!!'}), 405
                if args['id'] not in ids:
                        return jsonify({'message': 'Error: Category does not exists!!'}), 404
                if args['name'] is None or args['name']=='':
                        message += ', Warning: Please add category name!!'
                if args['description'] is None or args['description']=='':
                        message += ', Warning: Please add category description!!'
                try:
                        category = Category.query.get(args['id'])
                        category.name = args['name']
                        category.description = args['description']
                        db.session.commit()
                        return jsonify({'message': 'Success: Category updated!!'+message}), 201
                except:
                        return jsonify({'message': 'Error: Unknown category commit error'}), 500

def product_parser(required=True):
        parser = reqparse.RequestParser()
        datetime_type = lambda x: datetime.strptime(x, '%Y-%m-%d %H:%M:%S')
        parser.add_argument('id', type=int, help="Error: ID should be in integer format and distinct", required=True)
        parser.add_argument('name', type=str, help="Error: Name should be in string format", required=required)
        parser.add_argument('cost', type=float, help="Error: Cost should be in float format", required=required)
        parser.add_argument('stock', type=float, help="Error: Stock should be in float format", required=required)
        parser.add_argument('type', type=str, help="Error: Type should be in string format", required=required)
        parser.add_argument('manufacture_date', type=str, help="Error: Manufacture date should be in string of with format 'YYYY-MM-DD HH:MM:SS'", default=None)
        parser.add_argument('expiry_date', type=str, help="Error: Expiry date should be in string of with format 'YYYY-MM-DD HH:MM:SS'", default=None)
        # parser.add_argument('rating', type=int, help="Error: Rating should be in integer format")
        parser.add_argument('category_id', type=int, help="Error: Category ID should be in integer format", default=1)
        # parser.add_argument('manager_id', type=int, help="Error: Manager ID should be in integer format", required=True)
        return parser

product_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'cost': fields.Float,
        'stock': fields.Float,
        'type': fields.String,
        'manufacture_date': fields.DateTime,
        'expiry_date': fields.DateTime,
        'rating': fields.Integer,
        'category_id': fields.Integer,
        'manager_id': fields.Integer,
}
class ProductResource(Resource):
        @marshal_with(product_fields)
        def get(self, id):
                try:
                        if id==0:
                                products = Product.query.all()
                                return products
                        elif id==1:
                                product = Product.query.get(id)
                                # print(getattr(product,'id'))
                                return product
                        else:
                                product = Product.query.get(id)
                                if product:
                                        return product
                                else:
                                        return jsonify({'message': 'Error: Product does not exist!!'}), 404
                except:
                        raise abort(500, description='Error: Unknown error occure!!')
        
        @auth_required('token')
        @roles_required('manager')
        def post(self):
                parser = product_parser(required=True)
                args = parser.parse_args()
                # if args['manager_id'] != current_user.id:
                #         return {'message': 'Error: Product can not be accessed by current user!!'}, 403
                
                message = ''
                products = Product.query.all()
                ids = list(map(lambda x: x.id,products)) 
                category_ids = list(map(lambda x: x.id,Category.query.all()))
                if args['id']==1:
                        return jsonify({'message': 'Error: New base product can not be build!!'}), 405
                if args['id'] in ids:
                        return jsonify({'message': 'Error: Product already exists!!'}), 404
                if args['name'] is None or args['name']=='':
                        message += ', Warning: Please add product name!!'
                if args['id']<0:
                        return jsonify({'message': 'Error: Product ID can not be negative!!'}), 404
                if args['cost']<0:
                        return jsonify({'message': 'Error: Product cost can not be negative!!'}), 404
                if args['stock']<0:
                        return jsonify({'message': 'Error: Product stock can not be negative!!'}), 404
                if args['type'] not in ['ltr','kg','unit']:
                        return jsonify({'message': 'Error: Product type should among ltr/kg/unit!!'}), 404
                # if args['manager_id']<0:
                #         return {'message': 'Error: Manager ID can not be negative!!'}, 404
                if args['category_id'] != 1 and args['category_id'] not in category_ids:
                        return jsonify({'message': 'Error: Product category not exists!!'}), 404
                
                # datatime handle
                if args['manufacture_date'] is not None:
                        if not is_valid_datetime_format(args['manufacture_date']):
                                return jsonify({'message': "Error: Manufacture date should be in string of with format 'YYYY-MM-DD HH:MM:SS'"}), 404
                        else:
                                args['manufacture_date'] = datetime.strptime(args['manufacture_date'], '%Y-%m-%d %H:%M:%S')
                if args['expiry_date'] is not None:
                        if not is_valid_datetime_format(args['expiry_date']):
                                return jsonify({'message': "Error: Expiry date should be in string of with format 'YYYY-MM-DD HH:MM:SS'"}), 404
                        else:
                                args['expiry_date'] = datetime.strptime(args['expiry_date'], '%Y-%m-%d %H:%M:%S')

                
                args['manager_id'] = current_user.id

                try:
                        product = Product(**args, )
                        db.session.add(product)
                        db.session.commit()
                        return jsonify({'message': f'Success: New produst {product.name} created!!'+message}), 201
                except Exception as e:
                        # return {'message': e},500
                        print(e)
                        return jsonify({'message': 'Error: Unknown category commit error'}), 500
        
        @auth_required('token')
        @roles_required('manager')
        def delete(self,id):
                products = Product.query.all()
                ids = list(map(lambda x: x.id,products)) 
                if id==1:
                        return jsonify({'message': 'Error: Base product can not be deleted!!'}), 405
                if id not in ids:
                        return jsonify({'message': 'Error: Product does not exists!!'}), 404
                product = Product.query.get(id)
                if product.manager_id != current_user.id:
                        return jsonify({'message': 'Error: Product can not be deleted by current manager!!'}), 403
                
                try:
                        db.session.delete(product)
                        db.session.commit()
                        return jsonify({'message': f'Success: Product {product.name} deleted!!'}), 201
                except :
                        return jsonify({'message': 'Error: Unknown category commit error'}), 404

        @auth_required('token')
        @roles_required('manager')
        def put(self):
                parser = product_parser(required=False)
                args = parser.parse_args()
                message = ''
                products = Product.query.all()
                product = Product.query.get(args['id'])
                ids = list(map(lambda x: x.id,products)) 
                category_ids = list(map(lambda x: x.id,Category.query.all()))
                
                if args['id']==1:
                        return jsonify({'message': 'Error: Base product can not be updated!!'}), 405
                if args['id'] not in ids:
                        return jsonify({'message': 'Error: Product does not exists!!'}), 404
                if product.manager_id != current_user.id:
                        return jsonify({'message': 'Error: Product can not be updated by current manager!!'}), 403
                
                
                if args['name'] is not None and args['name']=='':
                        message += ', Warning: Please add product name!!'
                # if args['id']<0:
                #         return {'message': 'Error: Product ID can not be negative!!'}, 404
                if args['cost'] is not None and args['cost']<0:
                        return jsonify({'message': 'Error: Product cost can not be negative!!'}), 404
                if args['stock'] is not None and args['stock']<0:
                        return jsonify({'message': 'Error: Product stock can not be negative!!'}), 404
                if args['type'] is not None and args['type'] not in ['ltr','kg','unit']:
                        return jsonify({'message': 'Error: Product type should among ltr/kg/unit!!'}), 404
                # if args['manager_id']<0:
                #         return {'message': 'Error: Manager ID can not be negative!!'}, 404
                if args['category_id'] != 1 and args['category_id'] not in category_ids:
                        return jsonify({'message': 'Error: Product category not exists!!'}), 404
                
                # datatime handle
                if args['manufacture_date'] is not None:
                        if not is_valid_datetime_format(args['manufacture_date']):
                                return jsonify({'message': "Error: Manufacture date should be in string of with format 'YYYY-MM-DD HH:MM:SS'"}), 404
                        else:
                                args['manufacture_date'] = datetime.strptime(args['manufacture_date'], '%Y-%m-%d %H:%M:%S')
                if args['expiry_date'] is not None:
                        if not is_valid_datetime_format(args['expiry_date']):
                                return jsonify({'message': "Error: Expiry date should be in string of with format 'YYYY-MM-DD HH:MM:SS'"}), 404
                        else:
                                args['expiry_date'] = datetime.strptime(args['expiry_date'], '%Y-%m-%d %H:%M:%S')
                
                
                args['manager_id'] = current_user.id
                try:
                        for key in args.keys():
                                if args[key] is not None:
                                        setattr(product, key, args[key])
                        db.session.commit()
                        return jsonify({'message': f'Success: Product {product.name} updated!!'+message}), 201
                except:
                        return jsonify({'message': 'Error: Unknown prduct commit error'}), 500

api.add_resource(User, '/user', '/category/<int:id>')
api.add_resource(CategoryResource, '/category', '/category/<int:id>')
api.add_resource(ProductResource, '/product', '/product/<int:id>')