from main import app 
from application.models import db, Role

with app.app_context():
        db.create_all()
        admin = Role(id='admin', name='Admin', description='has superior power of application, manage product category and managers')
        manager = Role(id='manager', name='Manager', description='manage products')
        user = Role(id='user', name='Customer', description='customer of products')

        db.session.add(admin)
        db.session.add(manager)
        db.session.add(user)
        try:
                db.session.commit()
        except:
                pass