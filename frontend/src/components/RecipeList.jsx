import { useContext } from "react"
import RecipeContext from "../contexts/RecipeContext"

function RecipeList({ recipes: propRecipes }) {  // Rename prop to avoid confusion
    const { recipes: contextRecipes } = useContext(RecipeContext)
    
    // Use prop if provided, otherwise use all recipes from context
    const recipeData = propRecipes || contextRecipes || []

    const onClick = (e) => {
        const {id, name} = e.target
        switch(name) {
            case 'view':
                console.log(`View recipe ${id}`)
                break
            case 'edit':
                console.log(`Edit recipe ${id}`)
                break
            case 'delete':
                console.log(`Delete recipe ${id}`)
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
                                <button type='button' name='view' id={recipe.id} onClick={onClick}>View</button>
                                <button type='button' name='edit' id={recipe.id} onClick={onClick}>Edit</button>
                                <button type='button' name='delete' id={recipe.id} onClick={onClick}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default RecipeList