from app.extensions import ma
from app.models import Recipe, User, Category

# Schema definitions
class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
        include_fk = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('user',))

    class Meta:
        model = User
        load_instance = True
        include_fk = True

class RecipeSchema(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSchema, exclude=('recipes',))
    categories = ma.Nested(CategorySchema, many=True) 

    class Meta:
        model = Recipe
        load_instance = True
        include_fk = True

# Create ready-to-use instances of your schemas
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)