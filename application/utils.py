import re
from datetime import datetime
from functools import wraps
from flask import request, jsonify
from models import User

# import jwt

def is_valid_datetime_format(date_string, format='%Y-%m-%d %H:%M:%S'):
    pattern = (
        r'\d{4}-\d{2}-\d{2}'  # Year-month-day
        r' '
        r'\d{2}:\d{2}:\d{2}'  # Hour:minute:second
    )
    return re.match(pattern, date_string) is not None

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None
#         # jwt is passed in the request header
#         if 'x-access-token' in request.headers:
#             token = request.headers['x-access-token']
#         # return 401 if token is not passed
#         if not token:
#             return jsonify({'message' : 'Token is missing !!'}), 401
  
#         try:
#             # decoding the payload to fetch the stored details
#             data = jwt.decode(token, app.config['SECRET_KEY'])
#             current_user = User.query\
#                 .filter_by(public_id = data['public_id'])\
#                 .first()
#         except:
#             return jsonify({
#                 'message' : 'Token is invalid !!'
#             }), 401
#         # returns the current logged in users context to the routes
#         return  f(current_user, *args, **kwargs)
  
#     return decorated
  