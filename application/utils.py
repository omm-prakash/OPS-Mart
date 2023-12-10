import re
from datetime import datetime

def is_valid_datetime_format(date_string, format='%Y-%m-%d %H:%M:%S'):
    pattern = (
        r'\d{4}-\d{2}-\d{2}'  # Year-month-day
        r' '
        r'\d{2}:\d{2}:\d{2}'  # Hour:minute:second
    )
    return re.match(pattern, date_string) is not None