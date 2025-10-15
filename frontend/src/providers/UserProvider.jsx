import { useState, useEffect } from "react"
import { API_URL } from "../utils"
import UserContext from "../contexts/UserContext"
import axios from 'axios'

function UserProvider({children}) {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(() => {
      const saved = localStorage.getItem('loggedInUser')
      return saved ? JSON.parse(saved) : {}
  })

  // Function to login user AND save to localStorage
  const loginUser = (user) => {
      setLoggedInUser(user)
      localStorage.setItem('loggedInUser', JSON.stringify(user))
  }

  // Function to logout user
  const logoutUser = () => {
      setLoggedInUser({})
      localStorage.removeItem('loggedInUser')
  }

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
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <UserContext.Provider 
        value={{ 
          users, 
          loggedInUser, 
          loginUser,
          logoutUser,     
        }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider