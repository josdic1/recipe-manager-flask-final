from flask import Flask
from config import Config
from rich.traceback import install
from app.extensions import db, ma, migrate, cors, admin

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    install(show_locals=True, width=120)
    
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": "http://localhost:5173",
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        }
    })
    admin.init_app(app)
    
    from flask_admin.contrib.sqla import ModelView
    from app.models import User, Recipe, Category
    
    class UserView(ModelView):
        column_list = ['id', 'name', 'created_at']
        column_searchable_list = ['name']
    
    class RecipeView(ModelView):
        column_list = ['id', 'name', 'user', 'created_at']
        column_searchable_list = ['name']
    
        # Explicitly define what's in the form (don't include recipe_categories)
        form_columns = ['name', 'user']
    
        # Also exclude it explicitly
        form_excluded_columns = ['recipe_categories', 'created_at', 'updated_at']
    
    class CategoryView(ModelView):
        column_list = ['id', 'name', 'created_at']
        column_searchable_list = ['name']
    

        form_columns = ['name']  # Only name field
        form_excluded_columns = ['recipe_categories', 'created_at', 'updated_at']
    
    admin.add_view(UserView(User, db.session))
    admin.add_view(RecipeView(Recipe, db.session)) 
    admin.add_view(CategoryView(Category, db.session))
    
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    from app.commands import register_commands
    register_commands(app)
    
    return app