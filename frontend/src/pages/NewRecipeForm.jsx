import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext"

import { useNavigate } from "react-router-dom"

function NewRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { handleNew } = useContext(RecipeContext)
    const [categoryIds, setCategoryIds] = useState([])
    const [ formData, setFormData ] = useState({
        name: '',
        user_id: loggedInUser.id || "HUGE ERROR: NO USER LOGGED IN",
        categories: []
    })

    const { categories } = useContext(CategoryContext)
    const navigate = useNavigate()

    useEffect(() => {
        {!loggedInUser.id ? navigate('/') : ''}
    },[loggedInUser])

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
        const newRecipe = {
            name: formData.name,
            user_id: loggedInUser.id,
            category_ids: categoryIds  // 👈 Send category_ids, not categories!
        }
        handleNew(newRecipe)
        navigate('/')
    }

    // Get category names for display
    const selectedCategories = categories.filter(c => categoryIds.includes(c.id))

    return (
        <>
            <form onSubmit={onSubmit}>
                <h2>New Recipe</h2>
                
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
                    value={loggedInUser.id} 
                    readOnly 
                />
                
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

                <button type="submit">Add Recipe</button>
            </form>
        </>
    )
}

export default NewRecipeForm