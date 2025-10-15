import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utils"
import UserContext from "../contexts/UserContext"
import axios from 'axios'

function UserProvider({children}) {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});

  const navigate = useNavigate()


useEffect(() => {
  fetchUsers()
}, []);

async function fetchUsers() {
  try {
    const response = await axios.get(`${API_URL}/users`);
    setUsers(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
} 




async function handleDelete(userId) {
  try {
    await axios.delete(`${API_URL}/users/${userId}`);
    setUsers(users.filter(user => user.id !== userId));
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

return (
<>
<UserContext.Provider 
    value={{ users, loggedInUser, setLoggedInUser, handleDelete }}>
  {children}
</UserContext.Provider>
</>
)}

export default UserProvider
