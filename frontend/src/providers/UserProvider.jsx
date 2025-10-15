import { useState, useEffect } from "react"
import { API_URL } from "../utils"
import UserContext from "../contexts/UserContext"
import axios from 'axios'

function UserProvider({children}) {
  const [users, setUsers] = useState([]);

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

return (
<>
<UserContext.Provider 
    value={{ users }}>
  {children}
</UserContext.Provider>
</>
)}

export default UserProvider
