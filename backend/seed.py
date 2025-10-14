from app import create_app
from app.extensions import db
from app.models import User, Recipe, Category

app = create_app()

with app.app_context():  # Activate the app's context

    db.create_all() 
    # Create categories
    breakfast = Category(name="Breakfast")
    lunch = Category(name="Lunch")
    dinner = Category(name="Dinner")
    dessert = Category(name="Dessert")
    vegetarian = Category(name="Vegetarian")
    
    db.session.add_all([breakfast, lunch, dinner, dessert, vegetarian])
    
    # Create users
    user1 = User(name="Josh")
    user2 = User(name="Dorrie")
    
    db.session.add_all([user1, user2])
    db.session.commit()
    
    # Create recipes
    recipe1 = Recipe(
        name="Pancakes",
        user_id=user1.id
    )
    recipe1.categories = [breakfast]
    
    recipe2 = Recipe(
        title="Caesar Salad",
        user_id=user2.id
    )
    recipe2.categories = [lunch, vegetarian]
    
    db.session.add_all([recipe1, recipe2])
    db.session.commit()
    
    print("Database seeded successfully!")