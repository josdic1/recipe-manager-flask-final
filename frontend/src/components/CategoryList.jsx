import { useContext } from "react"
import CategoryContext from "../contexts/CategoryContext"

function CategoryList() {
    const { categories } = useContext(CategoryContext)


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
                </tr>
            ))}
        </tbody>
    </table>
</>
)}

export default CategoryList
