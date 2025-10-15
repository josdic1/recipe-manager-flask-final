import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext"
import { useNavigate, useParams } from "react-router-dom"

function EditRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { recipes, handleEdit } = useContext(RecipeContext)
    const { categories } = useContext(CategoryContext)
    const [categoryIds, setCategoryIds] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState(null)  
    const [loading, setLoading] = useState(true)    


    useEffect(() => {
        if (!loggedInUser?.id) {
            navigate('/')
        }
    }, [loggedInUser, navigate])


useEffect(() => {
    if (recipes.length > 0) { 
        const recipeToEdit = recipes.find(r => r.id === Number(id))
        
        if (recipeToEdit) {
            setFormData({
                id: recipeToEdit.id,
                name: recipeToEdit.name,
                user_id: recipeToEdit.user_id,
                categories: recipeToEdit.categories.map(c => c.name).join(', ')
            })
            

            setCategoryIds(recipeToEdit.categories.map(c => c.id))
            
            setLoading(false)  
        } else {
            console.error('Recipe not found!')
            setLoading(false)
        }
    }
}, [id, recipes])
    

    

 const onChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


     const onSelect = (e) => {
        const selectedId = Number(e.target.value)
        if (!categoryIds.includes(selectedId)) {
            setCategoryIds(prev => [...prev, selectedId])
        }
    }

        const removeCategory = (idToRemove) => {
        setCategoryIds(prev => prev.filter(id => id !== idToRemove))
    }

 function onSubmit(e) {
    e.preventDefault()
    const updatedRecipe = {
        id: formData.id,
        name: formData.name,
        user_id: formData.user_id,
        category_ids: categoryIds  
    }
    handleEdit(updatedRecipe)
    navigate('/')
}

  
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

        const selectedCategories = categories.filter(c => categoryIds.includes(c.id))
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
                
                {/* <label htmlFor="categories">Categories (comma-separated):</label>
                <input 
                    type="text" 
                    id="categories" 
                    name="categories" 
                    onChange={onChange} 
                    placeholder='Categories...' 
                    value={formData.categories}
                /> */}

                 <label htmlFor="cat-selector">Add Categories:</label>
                <select name='cat-selector' onChange={onSelect} defaultValue="">
                    <option value="" disabled>Choose a category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>  
                        
                    ))}
                </select>

        
                <div>
                    <strong>Selected Categories:</strong>
                    {selectedCategories.length === 0 ? (
                        <p>No categories selected</p>
                    ) : (
                        <ul>
                            {selectedCategories.map(cat => (
                                <li key={cat.id}>
                                    {cat.name} 
                                    <button 
                                        type="button" 
                                        onClick={() => removeCategory(cat.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/')}>Cancel</button>
            </form>
        </>
    )
}

export default EditRecipeForm