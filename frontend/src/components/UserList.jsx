import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function UserList() {
    const { users, handleDelete } = useContext(UserContext)

    const navigate = useNavigate()

        const onClick = (e) => {
        const {id, name} = e.target
            switch(name) {
                case 'view':
                    console.log(`View user ${id}`)
                    break
                case 'edit':
                    console.log(`Edit user ${id}`)
                    break
                case 'delete':
                    const userIdToDelete = parseInt(id)
                    handleDelete(userIdToDelete)
                    navigate('/')
                    break
                default:
                    console.log('Unknown action')
            }
    }


return (
<>
    <h2>User List</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                        <button type='button' name='view' id={user.id} onClick={onClick}>View</button>
                        <button type='button' name='edit' id={user.id} onClick={onClick}>Edit</button>
                        <button type='button' name='delete' id={user.id} onClick={onClick}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</>
)}

export default UserList
