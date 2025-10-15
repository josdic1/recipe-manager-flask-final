import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import { useNavigate, useParams } from "react-router-dom"

function EditRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { recipes, handleEdit } = useContext(RecipeContext)
    const [ formData, setFormData ] = useState({
        id: "",
        name: '',
        user_id: loggedInUser.id || "HUGE ERROR: NO USER LOGGED IN",
        categories: []
    })

    const { id } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        {!loggedInUser.id ? navigate('/') : console.log(`valid login for ${loggedInUser.name}`)}
    },[loggedInUser])

    useEffect(() => {
        const recipeToEdit = recipes.find(r => r.id === Number(id))
        setFormData({
        id: recipeToEdit.id,
        name: recipeToEdit.name,
        user_id: loggedInUser.id,
        categories: recipeToEdit.categories
        })
    },[id])

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        }
    )}

    function onSubmit(e) {
        e.preventDefault()
            handleEdit(formData)
            navigate('/')
            setFormData({
                id: '',
                name: '',
                user_id: "",
                categories: []
            })
        }

return (
<>
<form onSubmit={onSubmit}>
    <h2>Edit Recipe</h2>
    <label htmlFor="name">Recipe Name:</label>
    <input type="text" id="name" name="name" onChange={onChange} placeholder='Recipe name...' value={formData.name} required />
    <input type="text" id="user_id" name="user_id" onChange={onChange} placeholder='User name...' value={formData.user_id} readOnly/>
<input type="text" id="categories" name="categories" onChange={onChange} placeholder='Categories...' value={formData.categories}/>
    <button type="submit">Edit Recipe</button>
</form>

</>
)}

export default EditRecipeForm
