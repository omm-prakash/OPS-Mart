class Config(object):
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True # enable flask debugging
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db' # location for .db file
    SECRET_KEY = "ops" # flask_security based on flask_plugin, flask_plugin based on flask session, for session security key is must
    SECURITY_PASSWORD_SALT = "salt" # used for encrypting the password
    SQLALCHEMY_TRACK_MODIFICATIONS = False # to ask flask not to track the modification
    WTF_CSRF_ENABLED = False # needed to ensure the data is coming from legitimate frontend
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token' # name of header with which the authentication token would come
#     CACHE_TYPE = "RedisCache"
#     CACHE_REDIS_HOST = "localhost"
#     CACHE_REDIS_PORT = 6379
#     CACHE_REDIS_DB = 3