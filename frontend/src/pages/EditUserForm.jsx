import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function EditUserForm() {
    const { users, handleEdit } = useContext(UserContext)
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (users.length > 0) {
            const userToEdit = users.find(u => u.id === Number(id))
            
            if (userToEdit) {
                setFormData({
                    id: userToEdit.id,
                    name: userToEdit.name
                })
                setLoading(false)
            } else {
                console.error('User not found!')
                setLoading(false)
            }
        }
    }, [id, users])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function onSubmit(e) {
        e.preventDefault()
        const editedUser = {
            id: formData.id,
            name: formData.name.trim()
        }
        
        if (editedUser.name) {
            handleEdit(editedUser)
            navigate('/users')
        } else {
            alert("User name cannot be empty.")
        }
    }

    if (loading) {
        return <p>Loading user...</p>
    }

    if (!formData) {
        return (
            <>
                <h2>User Not Found</h2>
                <button onClick={() => navigate('/users')}>Go Back</button>
            </>
        )
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <h2>Edit User</h2>
                
                <label>
                    Name:
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        required
                    />
                </label>
                
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate('/users')}>Cancel</button>
            </form>
        </>
    )
}

export default EditUserForm