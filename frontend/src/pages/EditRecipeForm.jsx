import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import { useNavigate, useParams } from "react-router-dom"

function EditRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { recipes, handleEdit } = useContext(RecipeContext)
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState(null)  // 👈 Start with null
    const [loading, setLoading] = useState(true)    // 👈 Add loading state

    // Redirect if not logged in
    useEffect(() => {
        if (!loggedInUser?.id) {
            navigate('/')
        }
    }, [loggedInUser, navigate])

    // Load recipe data
    useEffect(() => {
        if (recipes.length > 0) {  // 👈 Only run when recipes are loaded
            const recipeToEdit = recipes.find(r => r.id === Number(id))
            
            if (recipeToEdit) {
                setFormData({
                    id: recipeToEdit.id,
                    name: recipeToEdit.name,
                    user_id: recipeToEdit.user_id,
                    categories: recipeToEdit.categories || []
                })
                setLoading(false)  // 👈 Done loading
            } else {
                console.error('Recipe not found!')
                setLoading(false)
            }
        }
    }, [id, recipes])

    const onChange = (e) => {
        const { name, value } = e.target
        
        if (name === 'categories') {
            setFormData(prev => ({
                ...prev,
                categories: value.split(',').map(cat => cat.trim())
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    function onSubmit(e) {
        e.preventDefault()
        handleEdit(formData)
        navigate('/')
    }

    // 👇 Add loading check
    if (loading) {
        return <p>Loading recipe...</p>
    }

    // 👇 Check if recipe not found
    if (!formData) {
        return (
            <>
                <h2>Recipe Not Found</h2>
                <button onClick={() => navigate('/')}>Go Home</button>
            </>
        )
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <h2>Edit Recipe</h2>
                
                <label htmlFor="name">Recipe Name:</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    onChange={onChange} 
                    placeholder='Recipe name...' 
                    value={formData.name} 
                    required 
                />
                
                <label htmlFor="user_id">User ID:</label>
                <input 
                    type="text" 
                    id="user_id" 
                    name="user_id" 
                    value={formData.user_id} 
                    readOnly 
                />
                
                <label htmlFor="categories">Categories (comma-separated):</label>
                <input 
                    type="text" 
                    id="categories" 
                    name="categories" 
                    onChange={onChange} 
                    placeholder='Categories...' 
                    value={formData.categories.join(', ')} 
                />
                
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/')}>Cancel</button>
            </form>
        </>
    )
}

export default EditRecipeForm