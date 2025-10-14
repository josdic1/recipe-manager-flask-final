from flask import Flask
from config import Config
from app.extensions import db, ma, migrate, cors, admin

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    admin.init_app(app)
    
    # Add admin views
    from flask_admin.contrib.sqla import ModelView
    from app.models import User, Recipe, Category
    
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Recipe, db.session))
    admin.add_view(ModelView(Category, db.session))
    
    # Register blueprints
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    # Register CLI commands
    from app.commands import register_commands
    register_commands(app)
    
    return app