import { useContext } from "react";
import { Link } from "react-router-dom";
import CategoryContext from "../contexts/CategoryContext";

function CategoryList() {
    const { categories } = useContext(CategoryContext);

    if (!categories || categories.length === 0) {
        return <h2>No categories found. Create a recipe to add one!</h2>;
    }

    return (
        <div>
            <h1>Categories & Recipes</h1>
            {categories.map(category => (
                // Only show categories that actually have recipes
                category.recipes.length > 0 && (
                    <div key={category.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
                        <h2>{category.name}</h2>
                        <ul>
                            {category.recipes.map(recipe => (
                                <li key={recipe.id}>
                                    <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
                                    (by {recipe.user.name})
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
}

export default CategoryList;