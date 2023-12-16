from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from weasyprint import HTML
from jinja2 import Template

# from mailhog import Mailhog
# mailhog = Mailhog()

# ref: https://github.com/mailhog/MailHog

# mail service
SMTP_HOST = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'admin@omart.com'
SENDER_PASSWORD = ''

# email service
def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to      
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html')) #plain
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

# send_message(to='21f1005497@ds.study.iitm.ac.in', subject='Daily Test', content_body='<h1>Hello OPS!!</h1>')


# PDF report service
def format_report(file,data):
    with open(file) as f:
        template = Template(f.read())
        return template.render(data=data)
    
def create_pdf_report(file, data, output_file):
    message = format_report(file, data)
    html = HTML(string=message)
    html.write_pdf(target=output_file)

def create_html_report(file, data, output_file):
    message = format_report(file, data)
    with open(output_file, 'w') as html_file:
        html_file.write(message)

# data = {'email': 'customer@omart.com', 'username': 'Customer Lead', 'month': 'December', 'year': '2023', 'transaction': [{'name': 'Biriyani', 'seller': 'Manager Lead', 'quantity': 1.0, 'type': 'kg', 'cost': 100.0, 'transaction_date': '2023-12-16 01:27'}, {'name': 'Sprit', 'seller': 'Rahul', 'quantity': 2.0, 'type': 'unit', 'cost': 30.0, 'transaction_date': '2023-12-16 01:27'}, {'name': 'Door Screen', 'seller': 'Manager Lead', 'quantity': 2.0, 'type': 'unit', 'cost': 1000.0, 'transaction_date': '2023-12-16 01:27'}, {'name': 'Biriyani', 'seller': 'Manager Lead', 'quantity': 1.0, 'type': 'kg', 'cost': 100.0, 'transaction_date': '2023-12-16 01:28'}, {'name': 'Biriyani', 'seller': 'Manager Lead', 'quantity': 1.0, 'type': 'kg', 'cost': 100.0, 'transaction_date': '2023-12-16 05:02'}], 'total': 2360.0}
# file = 'application/templates/this_month_transaction.html'

# data['username'] = 'OPS'
# create_pdf_report(file, data, output_file='ops.pdf')