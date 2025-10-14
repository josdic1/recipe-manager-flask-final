from app import create_app
from app.extensions import db
from app.models import User, Recipe, Category

def seed_database():
    """Seed the database with sample data."""
    db.create_all()
    
    # Create categories
    cat_1 = Category(name="Breakfast")
    cat_2 = Category(name="Lunch")
    cat_3 = Category(name="Dinner")
    cat_4 = Category(name="Vegan")
    cat_5 = Category(name="Vegetarian")
    cat_6 = Category(name="Kosher")
    cat_7 = Category(name="Healthy")
    cat_8 = Category(name="Protein")
    cat_9 = Category(name="Famous")
    cat_10 = Category(name="Fan Favorite")
    cat_11 = Category(name="Beginner")
    cat_12 = Category(name="Intermediate")
    cat_13 = Category(name="Expert")
    cat_14 = Category(name="Dessert")
    cat_15 = Category(name="Secret Recipe")
    
    db.session.add_all([cat_1, cat_2, cat_3, cat_4, cat_5, cat_6, cat_7, cat_8, cat_9, cat_10, cat_11, cat_12, cat_13, cat_14, cat_15])

    # Create users
    user_1 = User(name="Josh")
    user_2 = User(name="Dorrie")
    user_3 = User(name="Ariel")
    user_4 = User(name="Zach")
    user_5 = User(name="Jason")
    user_6 = User(name="Gabe")
    user_7 = User(name="Reed")
    user_8 = User(name="Sarah")
    
    db.session.add_all([user_1, user_2, user_3, user_4, user_5, user_6, user_7, user_8])
    db.session.commit()

    # Create recipes
    recipe_1 = Recipe(
        name="French Toast",
        user_id=None.id
    )

    recipe_2 = Recipe(
        name="Pizza",
        user_id=None.id
    )

    recipe_3 = Recipe(
        name="Acai Bowl",
        user_id=None.id
    )

    recipe_4 = Recipe(
        name="Friend Chicken",
        user_id=None.id
    )

    recipe_5 = Recipe(
        name="Impossible Whopper",
        user_id=None.id
    )

    recipe_6 = Recipe(
        name="Cinnabon",
        user_id=None.id
    )

    recipe_7 = Recipe(
        name="Poke",
        user_id=None.id
    )

    recipe_8 = Recipe(
        name="Brownies",
        user_id=None.id
    )

    recipe_9 = Recipe(
        name="Ceasar Salad",
        user_id=None.id
    )

    recipe_10 = Recipe(
        name="Famous Eggs",
        user_id=None.id
    )

    recipe_11 = Recipe(
        name="Ramen",
        user_id=None.id
    )

    recipe_12 = Recipe(
        name="Apricot Chicken",
        user_id=None.id
    )

    recipe_13 = Recipe(
        name="Rice Cakes",
        user_id=None.id
    )

    recipe_14 = Recipe(
        name="Kugel",
        user_id=None.id
    )

    recipe_15 = Recipe(
        name="Chocolate Chip Cookies",
        user_id=None.id
    )

    recipe_16 = Recipe(
        name="Cheeseburger",
        user_id=None.id
    )

    recipe_17 = Recipe(
        name="Chicken Soup",
        user_id=None.id
    )

    recipe_18 = Recipe(
        name="Gyro",
        user_id=None.id
    )

    recipe_19 = Recipe(
        name="Vegan Meatballs",
        user_id=None.id
    )

    db.session.add_all([recipe_1, recipe_2, recipe_3, recipe_4, recipe_5, recipe_6, recipe_7, recipe_8, recipe_9, recipe_10, recipe_11, recipe_12, recipe_13, recipe_14, recipe_15, recipe_16, recipe_17, recipe_18, recipe_19])
    db.session.commit()
    
    print("✅ Database seeded successfully!")

# Allow running directly with: python seed.py
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_database()
