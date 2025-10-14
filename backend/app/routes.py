from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Recipe, Category


api = Blueprint('api', __name__)