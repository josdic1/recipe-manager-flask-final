import { useState, useEffect, useContext } from "react"
import UserContext from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"

function NewRecipeForm() {
    const { loggedInUser } = useContext(UserContext)
    const [ formData, setFormData ] = useState({
        
    })

    const navigate = useNavigate()

    useEffect(() => {
        {!loggedInUser.id ? navigate('/login') : console.log(`valid login for ${loggedInUser.name}`)}
    },[loggedInUser])

return (
<>

</>
)}

export default NewRecipeForm
