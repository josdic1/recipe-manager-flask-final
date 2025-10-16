import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext"
import { useNavigate, useParams } from "react-router-dom"

function EditRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const { recipes, handleEdit } = useContext(RecipeContext)
    const { categories } = useContext(CategoryContext)
    const [categoriesData, setCategoriesData] = useState([])  // {category_id, rating}
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
                    name: recipeToEdit.name
                })
                
                // Load existing categories with ratings
                if (recipeToEdit.recipe_categories) {
                    setCategoriesData(recipeToEdit.recipe_categories.map(rc => ({
                        category_id: rc.category.id,
                        rating: rc.rating || 3
                    })))
                }
                
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
        if (!categoriesData.find(c => c.category_id === selectedId)) {
            setCategoriesData(prev => [...prev, { 
                category_id: selectedId, 
                rating: 3 
            }])
        }
    }

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
        const updatedRecipe = {
            id: formData.id,
            name: formData.name,
            categories_data: categoriesData
        }
        handleEdit(updatedRecipe)
        navigate('/')
    }

    if (loading) {
        return <p>Loading recipe...</p>
    }

    if (!formData) {
        return (
            <>
                <h2>Recipe Not Found</h2>
                <button onClick={() => navigate('/')}>Go Home</button>
            </>
        )
    }

    const selectedCategories = categoriesData.map(cd => ({
        ...categories.find(c => c.id === cd.category_id),
        rating: cd.rating
    }))

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
                
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/')}>Cancel</button>
            </form>
        </>
    )
}

export default EditRecipeForm