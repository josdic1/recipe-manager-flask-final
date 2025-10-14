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

# Recipe Endpoints #


# Category Endpoints #



