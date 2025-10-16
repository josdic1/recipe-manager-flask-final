from app.extensions import ma
from app.models import Recipe, User, Category, RecipeCategory

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

class RecipeCategorySchema(ma.SQLAlchemyAutoSchema):
    category = ma.Nested(CategorySchema)
    
    class Meta:
        model = RecipeCategory
        load_instance = True
        include_fk = True

# ❌ DELETE THE OLD RecipeSchema - You defined it TWICE!
# Only keep this one:
class RecipeSchema(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSchema, exclude=('recipes',))
    recipe_categories = ma.Nested(RecipeCategorySchema, many=True)
    
    class Meta:
        model = Recipe
        load_instance = True
        include_fk = True

# Create instances
recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)