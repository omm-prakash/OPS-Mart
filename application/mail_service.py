from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
# from mailhog import Mailhog
# mailhog = Mailhog()

# ref: https://github.com/mailhog/MailHog

# mail service
SMTP_HOST = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'admin@omart.com'
SENDER_PASSWORD = ''

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