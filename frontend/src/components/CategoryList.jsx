import { useContext } from "react"
import CategoryContext from "../contexts/CategoryContext"

function CategoryList() {
    const { categories } = useContext(CategoryContext)

    const onClick = (e) => {
        const {id, name} = e.target
            switch(name) {
                case 'view':
                    console.log(`View category ${id}`)
                    break
                case 'edit':
                    console.log(`Edit category ${id}`)
                    break
                case 'delete':
                    console.log(`Delete category ${id}`)
                    break
                default:
                    console.log('Unknown action')
            }
    }
    
return (
<>
    <h2>Category List</h2>
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
                    {/* <td>
              <button type='button' name='view' id={category.id} onClick={onClick}>View</button>
                        <button type='button' name='edit' id={category.id} onClick={onClick}>Edit</button>
                        <button type='button' name='delete' id={category.id} onClick={onClick}>Delete</button>
                    </td> */}
                </tr>
            ))}
        </tbody>
    </table>
</>
)}

export default CategoryList
