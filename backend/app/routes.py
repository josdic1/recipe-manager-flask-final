from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Recipe, Category
from app.schemas import user_schema, users_schema, recipe_schema, recipes_schema, category_schema, categories_schema

api = Blueprint('api', __name__)


# User Endpoints #
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify(users_schema.dump(users)), 200

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user_schema.dump(user)), 200

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(name=data['name'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(user_schema.dump(new_user)), 201

@api.route('/users/<int:user_id>', methods=['PUT', 'PATCH'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.name = data.get('name', user.name)
    db.session.commit()
    return jsonify(user_schema.dump(user)), 200

@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204


# Recipe Endpoints #
@api.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify(recipes_schema.dump(recipes)), 200

@api.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify(recipe_schema.dump(recipe)), 200

@api.route('/recipes', methods=['POST'])
def create_recipe():
    from app.models import RecipeCategory
    data = request.get_json()
    new_recipe = Recipe(name=data['name'], user_id=data['user_id'])
    
    if 'categories_data' in data:
        for cat_data in data['categories_data']:
            rc = RecipeCategory(
                category_id=cat_data['category_id'],
                rating=cat_data.get('rating', 3)  # 👈 Get rating from user
            )
            new_recipe.recipe_categories.append(rc)
    
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(recipe_schema.dump(new_recipe)), 201

@api.route('/recipes/<int:recipe_id>', methods=['PUT', 'PATCH'])
def update_recipe(recipe_id):
    from app.models import RecipeCategory
    recipe = Recipe.query.get_or_404(recipe_id)
    data = request.get_json()
    
    if 'name' in data:
        recipe.name = data['name']
    
    if 'categories_data' in data:
        recipe.recipe_categories = []
        for cat_data in data['categories_data']:
            rc = RecipeCategory(
                category_id=cat_data['category_id'],
                rating=cat_data.get('rating', 3)
            )
            recipe.recipe_categories.append(rc)
    
    db.session.commit()
    return jsonify(recipe_schema.dump(recipe)), 200


@api.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return '', 204


# Category Endpoints #
@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories)), 200

@api.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify(category_schema.dump(category)), 200

@api.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    new_category = Category(name=data['name'])
    db.session.add(new_category)
    db.session.commit()
    return jsonify(category_schema.dump(new_category)), 201

@api.route('/categories/<int:category_id>', methods=['PUT', 'PATCH'])
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    category.name = data.get('name', category.name)
    db.session.commit()
    return jsonify(category_schema.dump(category)), 200

@api.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    return '', 204







