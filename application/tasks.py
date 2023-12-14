from celery import shared_task
from .models import User
import flask_excel as excel
# from .mail_service import send_message
from .models import User, Role
from jinja2 import Template

@shared_task(ignore_result=False)
def create_resource_csv():
        # print('I am here')
        stud_res = User.query.with_entities(User.id, User.username, User.email).all()

        csv_output = excel.make_response_from_query_sets(stud_res, ['id','username','email'], "csv")
        filename = "test.csv"

        with open(filename, 'wb') as f:
                f.write(csv_output.data)

        return filename
