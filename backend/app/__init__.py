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
    
    # Add admin views with custom configuration
    from flask_admin.contrib.sqla import ModelView
    from app.models import User, Recipe, Category
    
    # Simple ModelViews without custom forms
    class SimpleRecipeView(ModelView):
        column_list = ['id', 'name', 'categories', 'user', 'created_at']
        column_searchable_list = ['name']
        # Don't customize form - let Flask-Admin auto-generate

        form_columns = ['name', 'user', 'categories'] 
        
        def __str__(self):
            return self.name  
    
    class UserView(ModelView):
        column_list = ['id', 'name', 'created_at']
        column_searchable_list = ['name']

        def __str__(self):
            return self.name  
    
    class CategoryView(ModelView):
        column_list = ['id', 'name', 'created_at']
        column_searchable_list = ['name']

        def __str__(self):
            return self.name  
    
    admin.add_view(UserView(User, db.session))
    admin.add_view(SimpleRecipeView(Recipe, db.session))
    admin.add_view(CategoryView(Category, db.session))
    
    # Register blueprints
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    # Register CLI commands
    from app.commands import register_commands
    register_commands(app)
    
    return app