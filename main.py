from flask import Flask
from application.models import db
from application.resources import api
from application.cache import cache
from config import DevelopmentConfig
from flask_security import SQLAlchemyUserDatastore, Security
from application.sec import datastore 
from application.worker import celery_init_app 
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import customer_monthly_transactions, customer_daily_request

def create_app():
        app = Flask(__name__)
        app.config.from_object(DevelopmentConfig)
        db.init_app(app)
        api.init_app(app)
        excel.init_excel(app)
        # datastore = SQLAlchemyUserDatastore(db, User, Role)
        app.security = Security(app, datastore)
        cache.init_app(app)
        with app.app_context():
                import application.views
        return app

app= create_app()
celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
def send_email_monthly_customer(sender, **kwargs):
    sender.add_periodic_task(
        # 10,
        crontab(hour=9, minute=0, day_of_month=1),
        customer_monthly_transactions.s('OPS Mart: Your Monthly Transaction Report'),
    )

@celery_app.on_after_configure.connect
def send_email_daily_customer(sender, **kwargs):
    print('I am here')
    sender.add_periodic_task(
        # 10,
        crontab(hour=18, minute=30),
        customer_daily_request,
    )

if __name__=='__main__':
        app.run(debug=True)