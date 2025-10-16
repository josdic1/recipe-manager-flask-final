import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import CategoryContext from "../contexts/CategoryContext"

function CategoryList() {
    const { categories, handleDelete } = useContext(CategoryContext)

    const navigate = useNavigate()

    const onClick = (e) => {
        const {id, name} = e.target
            switch(name) {
                case 'edit':
                    navigate(`/category/${id}/edit`)
                    break
                case 'delete':
                    const categoryIdToDelete = parseInt(id)
                    handleDelete(categoryIdToDelete)
                    navigate('/')
                default:
                    console.log('Unknown action')
            }
    }
    
return (
<>
    <h2>Category List</h2>
    <button type='button' onClick={() => navigate('/category/new')}>Add Category</button>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody>
            {categories.map((category) => (
                <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                        <button type='button' name='edit' id={category.id} onClick={onClick}>Edit</button>
                        <button type='button' name='delete' id={category.id} onClick={onClick}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</>
)}

export default CategoryList
