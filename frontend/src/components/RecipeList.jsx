import { useContext } from "react"
import RecipeContext from "../contexts/RecipeContext"
import { useNavigate } from "react-router-dom"

function RecipeList({ recipes: propRecipes }) {  // Rename prop to avoid confusion
    const { recipes: contextRecipes, handleDelete } = useContext(RecipeContext)
    
    const navigate = useNavigate()

    // Use prop if provided, otherwise use all recipes from context
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
            handleDelete(id) 
            navigate('/')
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recipeData.map((recipe) => (
                        <tr key={recipe.id}>
                            <td>{recipe.id}</td>
                            <td>{recipe.name}</td>
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