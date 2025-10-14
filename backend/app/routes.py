from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Recipe, Category
from app.schemas import user_schema, users_schema, recipe_schema, recipes_schema, category_schema, categories_schema

api = Blueprint('api', __name__)

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify(users_schema.dump(users)), 200

