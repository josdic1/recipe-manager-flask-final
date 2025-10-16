from app.extensions import db
from datetime import datetime, timezone

# Association table for Categories and Recipes
category_recipes = db.Table('category_recipes',
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
)

# Association table for Categories and Users (e.g., for favorites)
category_users = db.Table('category_users',
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # --- Relationships ---
    # A Recipe has ONE User (Many-to-One)
    user = db.relationship('User', back_populates='recipes')
    # A Recipe can have MANY Categories (Many-to-Many)
    categories = db.relationship('Category', secondary=category_recipes, back_populates='recipes')

    def __repr__(self):
        return f'<Recipe {self.name}>'
    
    def __str__(self):
        return self.name

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # --- Relationships ---
    # A Category can have MANY Recipes
    recipes = db.relationship('Recipe', secondary=category_recipes, back_populates='categories')
    # A Category can be favorited by MANY Users
    users = db.relationship('User', secondary=category_users, back_populates='categories')

    def __repr__(self):
        return f'<Category {self.name}>'
    
    def __str__(self):
        return self.name

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # --- Relationships ---
    # A User can have MANY Recipes (One-to-Many)
    recipes = db.relationship('Recipe', back_populates='user', cascade='all, delete-orphan')
    # A User can favorite MANY Categories
    categories = db.relationship('Category', secondary=category_users, back_populates='users')

    def __repr__(self):
        return f'<User {self.name}>'
    
    def __str__(self):
        return self.name