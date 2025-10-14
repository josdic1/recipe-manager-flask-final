import click
from app.extensions import db
from app.models import User, Recipe, Category

def register_commands(app):
    """Register CLI commands."""
    
    @app.cli.command()
    def seed():
        """Seed the database with sample data."""
        from seed import seed_database
        seed_database()
    
    @app.cli.command()
    def reset():
        """Drop all tables and recreate them (clears database)."""
        click.echo("⚠️  Dropping all tables...")
        db.drop_all()
        click.echo("✅ Creating all tables...")
        db.create_all()
        click.echo("✅ Database cleared! Ready to seed.")
    
    @app.cli.command()
    def export_seed():
        """Export current database to seed.py file."""
        users = User.query.all()
        categories = Category.query.all()
        recipes = Recipe.query.all()
        
        # Generate seed file content
        output = """from app import create_app
from app.extensions import db
from app.models import User, Recipe, Category

def seed_database():
    \"\"\"Seed the database with sample data.\"\"\"
    db.create_all()
    
    # Create categories\n"""
        
        # Add categories
        cat_vars = {}
        for i, cat in enumerate(categories):
            var_name = f"cat_{i+1}"
            cat_vars[cat.id] = var_name
            output += f"    {var_name} = Category(name=\"{cat.name}\")\n"
        
        output += f"    \n    db.session.add_all([{', '.join(cat_vars.values())}])\n\n"
        
        # Add users
        output += "    # Create users\n"
        user_vars = {}
        for i, user in enumerate(users):
            var_name = f"user_{i+1}"
            user_vars[user.id] = var_name
            email = f', email="{user.email}"' if hasattr(user, 'email') and user.email else ''
            output += f"    {var_name} = User(name=\"{user.name}\"{email})\n"
        
        output += f"    \n    db.session.add_all([{', '.join(user_vars.values())}])\n"
        output += "    db.session.commit()\n\n"
        
        # Add recipes
        output += "    # Create recipes\n"
        for i, recipe in enumerate(recipes):
            var_name = f"recipe_{i+1}"
            user_var = user_vars.get(recipe.user_id, 'None')
            output += f"    {var_name} = Recipe(\n"
            output += f"        name=\"{recipe.name}\",\n"
            output += f"        user_id={user_var}.id\n"
            output += f"    )\n"
            
            if recipe.categories:
                cat_list = [cat_vars[cat.id] for cat in recipe.categories if cat.id in cat_vars]
                output += f"    {var_name}.categories = [{', '.join(cat_list)}]\n"
            
            output += f"\n"
        
        output += f"    db.session.add_all([{', '.join([f'recipe_{i+1}' for i in range(len(recipes))])}])\n"
        output += "    db.session.commit()\n"
        output += "    \n    print(\"✅ Database seeded successfully!\")\n\n"
        
        output += """# Allow running directly with: python seed.py
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_database()
"""
        
        # Write to seed.py
        with open('seed.py', 'w') as f:
            f.write(output)
        
        click.echo(f"✅ Exported {len(users)} users, {len(categories)} categories, and {len(recipes)} recipes to seed.py")