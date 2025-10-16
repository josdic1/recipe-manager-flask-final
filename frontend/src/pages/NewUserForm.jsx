import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function NewUserForm() {
    const { users, handleNew } = useContext(UserContext)
    const [formData, setFormData] = useState({
        name: ""
    })
    
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function onSubmit(e) {
        e.preventDefault()
        const newUser = {
            name: formData.name.trim()
        }
        
        if (newUser.name && !users.find(user => user.name.toLowerCase() === newUser.name.toLowerCase())) {
            handleNew(newUser)
            navigate('/users')
            setFormData({ name: "" })
        } else {
            alert("User name cannot be empty or duplicate.")
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <h2>New User</h2>
                
                <label>
                    Name:
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        placeholder="Enter user name..."
                        required
                    />
                </label>
                
                <button type="submit">Create User</button>
                <button type="button" onClick={() => navigate('/users')}>Cancel</button>
            </form>
        </>
    )
}

export default NewUserForm