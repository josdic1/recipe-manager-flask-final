import click
from app.extensions import db

def register_commands(app):
    """Register CLI commands."""
    
    # SEED #
    @app.cli.command()
    def seed():
        """Seed the database with sample data."""
        from seed import seed_database
        seed_database()
    
    # RESET #
    @app.cli.command()
    def reset():
        """Drop all tables and recreate them (clears database)."""
        click.echo("⚠️  Dropping all tables...")
        db.drop_all()
        
        click.echo("✅ Creating all tables...")
        db.create_all()
        
        click.echo("✅ Database cleared! Ready to seed.")