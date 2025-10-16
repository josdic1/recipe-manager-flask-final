import { useState, useEffect } from "react"
import { API_URL } from "../utils"
import UserContext from "../contexts/UserContext"
import axios from 'axios'

function UserProvider({children}) {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem('loggedInUser')
    if (!saved || saved === 'undefined') return {}
    
    try {
      return JSON.parse(saved)
    } catch (error) {
      console.error('Failed to parse loggedInUser:', error)
      return {}
    }
  })

  const loginUser = (user) => {
    setLoggedInUser(user)
    localStorage.setItem('loggedInUser', JSON.stringify(user))
  }

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

  async function handleNew(newUser) {
    try {
      const response = await axios.post(`${API_URL}/users`, newUser);
      setUsers(prevUsers => [...prevUsers, response.data]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  async function handleEdit(editedUser) {
    try {
      const response = await axios.put(`${API_URL}/users/${editedUser.id}`, editedUser);
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === editedUser.id ? response.data : user)
      );
    } catch (error) {
      console.error("Error editing user:", error);
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
        handleNew,
        handleEdit,
        handleDelete
      }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider