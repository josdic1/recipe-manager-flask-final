import { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RecipeContext from '../contexts/RecipeContext';
import UserContext from '../contexts/UserContext';

function RecipeCard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { recipes, handleDelete } = useContext(RecipeContext);
    const { loggedInUser } = useContext(UserContext);

    const recipe = recipes.find(r => r.id === Number(id));

    if (!recipe) {
        return (
            <div>
                <h2>Recipe not found.</h2>
                <Link to="/">Go Home</Link>
            </div>
        );
    }

    const canModify = loggedInUser?.id === recipe.user?.id;

    function onDelete() {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            handleDelete(recipe.id);
            navigate('/');
        }
    }

    return (
        <div>
            <h2>Recipe Card for {recipe.name}</h2>
            <p><strong>ID:</strong> {recipe.id}</p>
            <p><strong>Name:</strong> {recipe.name}</p>
            <p><strong>Owner:</strong> {recipe.user ? recipe.user.name : `User ID: ${recipe.user_id}`}</p>
            <p>
                <strong>Categories:</strong>
                {recipe.categories && recipe.categories.length > 0
                    ? recipe.categories.map(cat => cat.name).join(', ')
                    : "No categories assigned"
                }
            </p>

            {canModify && (
                <div>
                    <button onClick={() => navigate(`/recipe/${recipe.id}/edit`)}>Edit</button>
                    <button onClick={onDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default RecipeCard;