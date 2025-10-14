from app import create_app
from app.extensions import db

app = create_app()

@app.route('/')
def index():
    return {"message": "Recipe Manager API"}

if __name__ == '__main__':
    app.run(debug=True, port=5555)