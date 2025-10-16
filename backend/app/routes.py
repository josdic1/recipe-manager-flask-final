from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Recipe, Category
from app.schemas import recipe_schema, recipes_schema, category_schema, categories_schema, user_schema, users_schema

api = Blueprint('api', __name__)

def _cleanup_orphan_categories(category_ids):
    """
    Checks a list of categories by ID. If a category has no more
    associated recipes, it is deleted.
    """
    if not category_ids:
        return
    for cat_id in category_ids:
        category = Category.query.get(cat_id)
        if category and not category.recipes:
            db.session.delete(category)
    db.session.commit()

# --- Recipe Endpoints ---
@api.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify(recipes_schema.dump(recipes))

@api.route('/recipes', methods=['POST'])
def create_recipe():
    data = request.get_json()
    
    new_recipe = Recipe(name=data['name'], user_id=data['user_id'])
    
    if data.get('category_ids'):
        existing_categories = Category.query.filter(Category.id.in_(data['category_ids'])).all()
        new_recipe.categories.extend(existing_categories)
        
    if data.get('new_category_names'):
        for cat_name in data['new_category_names']:
            existing_cat = Category.query.filter_by(name=cat_name).first()
            if existing_cat:
                if existing_cat not in new_recipe.categories:
                    new_recipe.categories.append(existing_cat)
            else:
                new_cat = Category(name=cat_name)
                db.session.add(new_cat)
                new_recipe.categories.append(new_cat)

    db.session.add(new_recipe)
    db.session.commit()
    
    # THIS IS THE FIX: Reload the recipe from the DB before sending it back
    db.session.refresh(new_recipe)
    
    return jsonify(recipe_schema.dump(new_recipe)), 201

@api.route('/recipes/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    data = request.get_json()
    
    old_category_ids = {cat.id for cat in recipe.categories}
    
    recipe.name = data.get('name', recipe.name)
    recipe.categories.clear()

    if data.get('category_ids'):
        existing_categories = Category.query.filter(Category.id.in_(data['category_ids'])).all()
        recipe.categories.extend(existing_categories)
    
    if data.get('new_category_names'):
        for cat_name in data['new_category_names']:
            existing_cat = Category.query.filter_by(name=cat_name).first()
            if existing_cat:
                 if existing_cat not in recipe.categories:
                    recipe.categories.append(existing_cat)
            else:
                new_cat = Category(name=cat_name)
                db.session.add(new_cat)
                recipe.categories.append(new_cat)
                
    db.session.commit()
    db.session.refresh(recipe) # Also refresh here for edits
    _cleanup_orphan_categories(old_category_ids)
    
    return jsonify(recipe_schema.dump(recipe)), 200

@api.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    category_ids_to_check = [cat.id for cat in recipe.categories]
    db.session.delete(recipe)
    db.session.commit()
    _cleanup_orphan_categories(category_ids_to_check)
    return '', 204

# --- Category Endpoints ---
@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.name).all() 
    return jsonify(categories_schema.dump(categories))

# --- User Endpoints ---
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify(users_schema.dump(users))

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or 'name' not in data or not data['name'].strip():
        return jsonify({"error": "Name is required"}), 400
    
    new_user = User(name=data['name'])
    db.session.add(new_user)
    db.session.commit()
    db.session.refresh(new_user)
    return jsonify(user_schema.dump(new_user)), 201