import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function Login() {
    const { users, loggedInUser, loginUser } = useContext(UserContext)  // 👈 Changed
    let formNameValue = ''
    let matchedUser = null

    const navigate = useNavigate()
  
    useEffect(() => {
        if (loggedInUser?.id) {
            navigate('/')
        }
    }, [loggedInUser, navigate])

    const onClick = () => {
        const randomIndex = Math.floor(Math.random() * users.length)
        const randomUser = users[randomIndex]
        loginUser(randomUser)  // 👈 Use loginUser instead of setLoggedInUser
        navigate('/')
    }

    function onChange(e) {
        const { name, value } = e.target
        if (name === 'name') {
            formNameValue = value
            matchedUser = users.find(user => user.name === formNameValue)
            if (matchedUser) {
                loginUser(matchedUser)  // 👈 Use loginUser
            }
        }
    }
       
    function onSubmit(e) {
        e.preventDefault()
        if (matchedUser) {
            navigate('/')
        } else {
            console.log('Invalid entry')
        }
    }

    return (
        <>
            <button onClick={onClick}>Autolog</button>
            <form onSubmit={onSubmit}>
                <h2>Login</h2>
                <label htmlFor="name">User Name:</label>
                <input type="text" id="name" name="name" onChange={onChange} required />
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login