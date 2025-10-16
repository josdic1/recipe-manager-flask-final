import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import Login from "./Login"
import RecipeList from "../components/RecipeList"


function Home() {
    const { loggedInUser } = useContext(UserContext)
    const { recipes, handleDelete } = useContext(RecipeContext)

    const navigate = useNavigate()
    
    // If not logged in, show login
    if (!loggedInUser?.id) {
        return (
            <>
                <h1>Please Log in</h1>
                <Login />
            </>
        )
    }

    // Filter recipes for logged-in user
    const userRecipes = recipes
        .filter(recipe => recipe.user_id === loggedInUser.id)

    return (
        <>
            { loggedInUser.id ? 
            <>
                <h1>Welcome Back, {loggedInUser.name}</h1> 
                <p>Manage your recipes with ease!</p>
                <button type='button' onClick={() => navigate('recipe/new')}>Add Recipe</button>
                   <button type='button' onClick={() => navigate('/user/new')}>Add User</button>
                <RecipeList recipes={userRecipes} handleDelete={handleDelete}/></> : console.log('please log in')}

        </>
    )
}

export default Home