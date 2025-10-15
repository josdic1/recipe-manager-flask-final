import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import { useNavigate } from "react-router-dom"

function NewRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { handleNew } = useContext(RecipeContext)
    const [ formData, setFormData ] = useState({
        name: '',
        user_id: loggedInUser.id || "HUGE ERROR: NO USER LOGGED IN",
        categories: []
    })

    const navigate = useNavigate()

    useEffect(() => {
        {!loggedInUser.id ? navigate('/') : console.log(`valid login for ${loggedInUser.name}`)}
    },[loggedInUser])

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            name: name === 'name' ? value : formData.name,
            user_id: loggedInUser.id || "HUGE ERROR: NO USER LOGGED IN",
            categories: name === 'categories' ? value.split(',').map(cat => cat.trim()) : formData.categories
        })}

    function onSubmit(e) {
        e.preventDefault()
        const newRecipe = {
            ...formData
            }
            handleNew(newRecipe)
            navigate('/')
            setFormData({
                name: '',
                user_id: "",
                categories: []
            })
        }

return (
<>
<form onSubmit={onSubmit}>
    <h2>New Recipe</h2>
    <label htmlFor="name">Recipe Name:</label>
    <input type="text" id="name" name="name" onChange={onChange} placeholder='Recipe name...' value={formData.name} required />
    <input type="text" id="user_id" name="user_id" onChange={onChange} placeholder='User name...' value={formData.user_id} readOnly/>
<input type="text" id="categories" name="categories" onChange={onChange} placeholder='Categories...' value={formData.categories}/>
    <button type="submit">Add Recipe</button>
</form>

</>
)}

export default NewRecipeForm
