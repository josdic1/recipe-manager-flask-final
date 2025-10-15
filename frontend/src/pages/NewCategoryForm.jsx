import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import CategoryContext from "../contexts/CategoryContext"

function NewCategoryForm() {
    const { categories, handleNew } = useContext(CategoryContext)
    const [ formData, setFormData ] = useState({
        name: "" 
    })

    const navigate = useNavigate()

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })  }

    function onSubmit(e) {
        e.preventDefault()
        const newCategory = {
            ...formData,
            name: formData.name.trim()
        }
        if (newCategory.name && !categories.find(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
            handleNew(newCategory)
            navigate('/categories')
            setFormData({ name: "" })
        } else {
            alert("Category name cannot be empty or duplicate.")
    }
}

return (
<>
<form onSubmit={onSubmit}>
    <label>
        Name:
        <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
        />
    </label>
    <button type="submit">Create Category</button>  
</form>
</>
)}

export default NewCategoryForm