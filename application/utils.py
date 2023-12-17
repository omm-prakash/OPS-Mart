import re
from datetime import datetime
from functools import wraps
from flask import request, jsonify

def is_valid_datetime_format(date_string, format='%Y-%m-%d'):
    pattern = (
        r'\d{4}-\d{2}-\d{2}'
    )
    return re.match(pattern, date_string) is not None

