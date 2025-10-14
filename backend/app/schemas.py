from app.extensions import ma
from app.models import Recipe, User, Category

# Schema definitions
class RecipeSchema(ma.SQLAlchemyAutoSchema):
    # Nested relationships
    categories = ma.Nested('CategorySchema', many=True, exclude=('recipes',))

    class Meta:
        model = Recipe
        load_instance = True
        include_fk = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    # Nested relationships
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('user',))

    class Meta:
        model = User
        load_instance = True
        include_fk = True

class CategorySchema(ma.SQLAlchemyAutoSchema):
    # Nested relationships
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('categories',))

    class Meta:
        model = Category
        load_instance = True
        include_fk = True

# Create ready-to-use instances of your schemas
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
