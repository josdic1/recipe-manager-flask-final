import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext"

import { useNavigate } from "react-router-dom"

function NewRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { handleNew } = useContext(RecipeContext)
    const { categories } = useContext(CategoryContext)
    const navigate = useNavigate()
    
    // ❌ Change this from categoryIds to categoriesData:
    const [categoriesData, setCategoriesData] = useState([])  // {category_id, rating}
    const [formData, setFormData] = useState({
        name: '',
        user_id: loggedInUser.id || ""
    })

    useEffect(() => {
        if (!loggedInUser?.id) navigate('/')
    }, [loggedInUser, navigate])

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onSelect = (e) => {
        const selectedId = Number(e.target.value)
        if (!categoriesData.find(c => c.category_id === selectedId)) {
            setCategoriesData(prev => [...prev, { 
                category_id: selectedId, 
                rating: 3  // Default rating
            }])
        }
    }

    // ❌ ADD THIS FUNCTION:
    const updateRating = (categoryId, rating) => {
        setCategoriesData(prev => 
            prev.map(c => c.category_id === categoryId ? { ...c, rating: Number(rating) } : c)
        )
    }

    const removeCategory = (idToRemove) => {
        setCategoriesData(prev => prev.filter(c => c.category_id !== idToRemove))
    }

    function onSubmit(e) {
        e.preventDefault()
        const newRecipe = {
            name: formData.name,
            user_id: loggedInUser.id,
            categories_data: categoriesData  // ❌ Changed from category_ids!
        }
        handleNew(newRecipe)
        navigate('/')
    }

    const selectedCategories = categoriesData.map(cd => ({
        ...categories.find(c => c.id === cd.category_id),
        rating: cd.rating
    }))

    return (
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
                                
                                {/* ❌ ADD THIS RATING INPUT: */}
                                <label> Rating (1-5): </label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={cat.rating}
                                    onChange={(e) => updateRating(cat.id, e.target.value)}
                                />
                                
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
    )
}
export default NewRecipeForm