from app.extensions import ma
from app.models import Recipe, Category, User

class RecipeSchema(ma.SQLAlchemyAutoSchema):
    # Nested Relationships
    categories = ma.Nested('CategorySchema', many=True, exclude=('recipes',))
    user = ma.Nested('UserSchema', many=False, exclude=('recipes',))

    class Meta:
        model = Recipe
        load_instance = True
        include_fk = True
        include_relationships = True

class CategorySchema(ma.SQLAlchemyAutoSchema):
    # Nested Relationships
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('categories',))
    users = ma.Nested('UserSchema', many=True, exclude=('categories',))

    class Meta:
        model = Category
        load_instance = True
        include_fk = True
        include_relationships = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    # Nested Relationships
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('user',))
    categories = ma.Nested('CategorySchema', many=True, exclude=('users',))

    class Meta:
        model = User
        load_instance = True
        include_fk = True
        include_relationships = True

# --- Create ready-to-use instances of your schemas ---
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)