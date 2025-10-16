import { useEffect, useContext } from "react"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext"
import { useNavigate } from "react-router-dom"

function RecipeList({ recipes: propRecipes }) {
    const { recipes: contextRecipes, handleDelete } = useContext(RecipeContext)
    const { categories } = useContext(CategoryContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(categories.length === 0) {
            
        }
    },[categories])

    const recipeData = propRecipes || contextRecipes || []

    const onClick = (id, action) => {
        switch(action) {
            case 'view':
                navigate(`/recipe/${id}`)
                break
            case 'edit':
                navigate(`/recipe/${id}/edit`)
                break
            case 'delete':
                if (window.confirm('Are you sure you want to delete this recipe?')) {
                    handleDelete(id)
                    navigate('/')
                }
                break
            default:
                console.log('Unknown action')
        }
    }

    return (
        <>
            <h2>Recipe List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Recipe</th>
                        <th>Categories</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recipeData.map((recipe) => (
                        <tr key={recipe.id}>
                            <td>{recipe.id}</td>
                            <td>{recipe.name}</td>
                            <td>
                                {recipe.recipe_categories?.map(rc => `${rc.category.name} (${rc.rating}⭐)`).join(', ') || 'None'}
                            </td>
                            <td>{recipe.user?.name || recipe.user_id}</td>
                            <td>
                                <button type='button' onClick={() => onClick(recipe.id, 'view')}>View</button>
                                <button type='button' onClick={() => onClick(recipe.id, 'edit')}>Edit</button>
                                <button type='button' onClick={() => onClick(recipe.id, 'delete')}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default RecipeList