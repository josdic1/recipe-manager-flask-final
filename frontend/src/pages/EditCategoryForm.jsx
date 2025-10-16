import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CategoryContext from "../contexts/CategoryContext"

function EditCategoryForm() {
    const { categories, handleEdit } = useContext(CategoryContext)
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (categories.length > 0) {
            const categoryToEdit = categories.find(c => c.id === Number(id))
            
            if (categoryToEdit) {
                setFormData({
                    id: categoryToEdit.id,
                    name: categoryToEdit.name
                })
                setLoading(false)
            } else {
                console.error('Category not found!')
                setLoading(false)
            }
        }
    }, [id, categories])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function onSubmit(e) {
        e.preventDefault()
        const editedCategory = {
            id: formData.id,
            name: formData.name.trim()
        }
        
        if (editedCategory.name) {
            handleEdit(editedCategory)
            navigate('/categories')
        } else {
            alert("Category name cannot be empty.")
        }
    }

    if (loading) {
        return <p>Loading category...</p>
    }

    if (!formData) {
        return (
            <>
                <h2>Category Not Found</h2>
                <button onClick={() => navigate('/categories')}>Go Back</button>
            </>
        )
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <h2>Edit Category</h2>
                
                <label>
                    Name:
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/categories')}>Cancel</button>
            </form>
        </>
    )
}

export default EditCategoryForm