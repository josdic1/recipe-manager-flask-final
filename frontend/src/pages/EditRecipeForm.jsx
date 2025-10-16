import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext"
import UserContext from "../contexts/UserContext"

function EditRecipeForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { loggedInUser } = useContext(UserContext)
    const { recipes, handleEdit } = useContext(RecipeContext)
    const { categories } = useContext(CategoryContext)
    
    // Form state
    const [formData, setFormData] = useState({ name: '' })
    const [categoryIds, setCategoryIds] = useState([])
    const [newCategoryNames, setNewCategoryNames] = useState([])
    const [newCategoryName, setNewCategoryName] = useState("")
    const [loading, setLoading] = useState(true)

    // Effect to load recipe data once component mounts or recipes/id change
    useEffect(() => {
        const recipeToEdit = recipes.find(r => r.id === Number(id))
        
        if (recipeToEdit) {
            // Ensure the logged-in user owns the recipe before allowing edits
            if (loggedInUser?.id !== recipeToEdit.user_id) {
                console.error("Unauthorized: You can only edit your own recipes.")
                navigate('/')
                return
            }
            
            setFormData({ id: recipeToEdit.id, name: recipeToEdit.name })
            setCategoryIds(recipeToEdit.categories?.map(c => c.id) || [])
            setLoading(false)
        }
    }, [id, recipes, loggedInUser, navigate])

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSelect = (e) => {
        const selectedId = Number(e.target.value)
        if (!categoryIds.includes(selectedId)) setCategoryIds(prev => [...prev, selectedId])
    }
    const handleAddNewCategory = () => {
        if (newCategoryName && !newCategoryNames.includes(newCategoryName)) {
            setNewCategoryNames(prev => [...prev, newCategoryName])
            setNewCategoryName("")
        }
    }
    const removeSelectedCategory = (idToRemove) => setCategoryIds(prev => prev.filter(catId => catId !== idToRemove))
    const removeNewCategory = (nameToRemove) => setNewCategoryNames(prev => prev.filter(catName => catName !== nameToRemove))

    function onSubmit(e) {
        e.preventDefault()
        const updatedRecipe = {
            id: formData.id,
            name: formData.name,
            category_ids: categoryIds,
            new_category_names: newCategoryNames
        }
        handleEdit(updatedRecipe)
        navigate('/')
    }

    if (loading) return <p>Loading recipe...</p>

    const selectedCategories = categories.filter(c => categoryIds.includes(c.id))

    return (
        <form onSubmit={onSubmit}>
            <h2>Edit Recipe</h2>
            <label htmlFor="name">Recipe Name:</label>
            <input type="text" id="name" name="name" onChange={onChange} value={formData.name} required />

            <label htmlFor="cat-selector">Select Existing Categories:</label>
            <select onChange={onSelect} defaultValue="">
                <option value="" disabled>Choose a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <label htmlFor="new-cat-input">Or, Add a New Category:</label>
            <input type="text" id="new-cat-input" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <button type="button" onClick={handleAddNewCategory}>Add Category</button>

            <div>
                <strong>Categories for this Recipe:</strong>
                <ul>
                    {selectedCategories.map(cat => (
                        <li key={`sel-${cat.id}`}>
                            {cat.name} <button type="button" onClick={() => removeSelectedCategory(cat.id)}>X</button>
                        </li>
                    ))}
                    {newCategoryNames.map(name => (
                        <li key={`new-${name}`}>
                            {name} (new) <button type="button" onClick={() => removeNewCategory(name)}>X</button>
                        </li>
                    ))}
                </ul>
            </div>

            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </form>
    )
}

export default EditRecipeForm