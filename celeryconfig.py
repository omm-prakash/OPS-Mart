broker_url = "redis://localhost:6379/1"
result_backend = "redis://localhost:6379/2"
timezone = "Asia/Kolkata" 
broker_connection_retry_on_startup=True


# to run the celery CLI
# celery -A main:celery_app worker --loglevel INFO      
# celery -A main:celery_app beat --loglevel INFO      