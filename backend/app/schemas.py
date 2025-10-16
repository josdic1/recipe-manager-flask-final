from app.extensions import ma
from app.models import Recipe, User, Category

class CategorySchema(ma.SQLAlchemyAutoSchema):
    # This line tells the schema to include the list of recipes.
    # The 'exclude' part prevents an infinite loop.
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('categories',))

    class Meta:
        model = Category
        load_instance = True
        include_fk = True
        include_relationships = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    recipes = ma.Nested('RecipeSchema', many=True, exclude=('user',))
    
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        include_relationships = True

class RecipeSchema(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSchema, exclude=('recipes',))
    categories = ma.Nested(CategorySchema, many=True, exclude=('recipes',))
    
    class Meta:
        model = Recipe
        load_instance = True
        include_fk = True
        include_relationships = True

# Create instances
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)