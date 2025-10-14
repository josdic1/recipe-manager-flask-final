from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_cors import CORS
from flask_admin import Admin

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
cors = CORS()
admin = Admin(name='Recipe Manager', template_mode='bootstrap4')