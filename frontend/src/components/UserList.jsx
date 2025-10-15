import { useContext } from "react"
import UserContext from "../contexts/UserContext"

function UserList() {
    const { users } = useContext(UserContext)


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
                </tr>
            ))}
        </tbody>
    </table>
</>
)}

export default UserList
