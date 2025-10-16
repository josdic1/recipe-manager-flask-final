from app.extensions import db
from datetime import datetime, timezone



class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = db.relationship('User', back_populates='recipes')
    # ❌ REMOVE THIS LINE:
    # categories = db.relationship('Category', secondary='recipe_categories', back_populates='recipes')
    
    # ✅ KEEP ONLY THIS:
    recipe_categories = db.relationship('RecipeCategory', back_populates='recipe', cascade='all, delete-orphan')

    def __repr__(self):
        return f'{self.name}' 
    
    def __str__(self):
        return self.name


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    # recipes = db.relationship('Recipe', secondary='recipe_categories', back_populates='categories')
    
    recipe_categories = db.relationship('RecipeCategory', back_populates='category')
    
    def __repr__(self):
        return f'{self.name}' 
    
    def __str__(self):
        return self.name


class RecipeCategory(db.Model):
    __tablename__ = 'recipe_categories'
    
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), primary_key=True)
    rating = db.Column(db.Integer, default=3)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    recipe = db.relationship('Recipe', back_populates='recipe_categories')
    category = db.relationship('Category', back_populates='recipe_categories')
    
    # Add this:
    def __repr__(self):
        return f'<{self.category.name}: {self.rating}⭐>'


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    recipes = db.relationship('Recipe', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'{self.name}' 
    
    def __str__(self):
        return self.name