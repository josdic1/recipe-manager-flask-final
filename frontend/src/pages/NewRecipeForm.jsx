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
    
    // State for existing category IDs
    const [categoryIds, setCategoryIds] = useState([])
    // State for NEW categories by name
    const [newCategoryNames, setNewCategoryNames] = useState([])
    const [newCategoryName, setNewCategoryName] = useState("")

    const [formData, setFormData] = useState({
        name: '',
        user_id: loggedInUser?.id || ""
    })

    useEffect(() => {
        if (!loggedInUser?.id) navigate('/')
    }, [loggedInUser, navigate])

    const onChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})
    const onSelect = (e) => {
        const selectedId = Number(e.target.value)
        if (!categoryIds.includes(selectedId)) setCategoryIds(prev => [...prev, selectedId])
    }
    const handleAddNewCategory = () => {
        if (newCategoryName && !newCategoryNames.includes(newCategoryName)) {
            setNewCategoryNames(prev => [...prev, newCategoryName])
            setNewCategoryName("") // Clear input
        }
    }
    const removeSelectedCategory = (id) => setCategoryIds(prev => prev.filter(catId => catId !== id))
    const removeNewCategory = (name) => setNewCategoryNames(prev => prev.filter(catName => catName !== name))

    function onSubmit(e) {
        e.preventDefault()
        const newRecipe = {
            ...formData,
            category_ids: categoryIds,
            new_category_names: newCategoryNames
        }
        handleNew(newRecipe)
        navigate('/')
    }

    const selectedCategories = categories.filter(c => categoryIds.includes(c.id))

    return (
        <form onSubmit={onSubmit}>
            <h2>New Recipe</h2>
            <label htmlFor="name">Recipe Name:</label>
            <input type="text" id="name" name="name" onChange={onChange} value={formData.name} required />
            
            {/* Existing Categories Selector */}
            <label htmlFor="cat-selector">Select Existing Categories:</label>
            <select onChange={onSelect} defaultValue="">
                <option value="" disabled>Choose a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {/* New Category Input */}
            <label htmlFor="new-cat-input">Or, Add a New Category:</label>
            <input type="text" id="new-cat-input" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <button type="button" onClick={handleAddNewCategory}>Add Category</button>

            {/* Display selected and new categories */}
            <div>
                <strong>Categories for this Recipe:</strong>
                <ul>
                    {selectedCategories.map(cat => (
                        <li key={`sel-${cat.id}`}>{cat.name} <button type="button" onClick={() => removeSelectedCategory(cat.id)}>X</button></li>
                    ))}
                    {newCategoryNames.map(name => (
                        <li key={`new-${name}`}>{name} (new) <button type="button" onClick={() => removeNewCategory(name)}>X</button></li>
                    ))}
                </ul>
            </div>
            <button type="submit">Create Recipe</button>
        </form>
    )
}
export default NewRecipeForm