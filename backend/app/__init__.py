from flask import Flask
from config import Config
from rich.traceback import install
from app.extensions import db, ma, migrate, cors, admin

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    install(show_locals=True, width=120)
    
    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": "http://localhost:5173",  # Be sure this is your frontend's origin
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        }
    })
    admin.init_app(app)
    
    # Flask-Admin setup
    from flask_admin.contrib.sqla import ModelView
    from app.models import User, Recipe, Category
    

    class UserView(ModelView):
        # Take 'recipes' out of this list
        column_list = ['id', 'name', 'created_at'] 
        column_searchable_list = ['name']
        form_excluded_columns = ['recipes']
    
    class RecipeView(ModelView):
        # Added 'categories' to list view and form
        column_list = ['id', 'name', 'user', 'categories', 'created_at']
        column_searchable_list = ['name']
        form_columns = ['name', 'user', 'categories']
    
    class CategoryView(ModelView):
        # Added 'recipes' to list view and form
        column_list = ['id', 'name', 'recipes', 'created_at']
        column_searchable_list = ['name']
        form_columns = ['name', 'recipes']
    
    admin.add_view(UserView(User, db.session))
    admin.add_view(RecipeView(Recipe, db.session)) 
    admin.add_view(CategoryView(Category, db.session))
    
    # Register blueprints and commands
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    from app.commands import register_commands
    register_commands(app)
    
    return app