import { useContext } from "react"
import RecipeContext from "../contexts/RecipeContext"

function RecipeList() {
    const { recipes } = useContext(RecipeContext)


return (
<>
    <h2>Recipe List</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Recipe</th>
            </tr>
        </thead>
        <tbody>
            {recipes.map((recipe) => (
                <tr key={recipe.id}>
                    <td>{recipe.id}</td>
                    <td>{recipe.name}</td>
                </tr>
            ))}
        </tbody>
    </table>
</>
)}

export default RecipeList
