import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function Login() {
      const { users, loggedInUser, setLoggedInUser } = useContext(UserContext)
    let formNameValue = ''
    let matchedUser = null

    const navigate = useNavigate()
  
    function onChange(e) {
           const { name, value } = e.target
              if (name === 'name') {
                formNameValue = value
                matchedUser = users.find(user => user.name === formNameValue)
                {!matchedUser ? '' : setLoggedInUser(matchedUser)}
                
            } }
       
            function onSubmit(e) {
                e.preventDefault()
                console.log(loggedInUser)
                {!matchedUser ? console.log('Invalid entry') :
                navigate('/')}
            }

return (
<>
<form onSubmit={onSubmit}>
    <h2>Login</h2>
    <label htmlFor="name">User Name:</label>
    <input type="text" id="name" name="name" onChange={onChange} required />
    <button type="submit">Login</button>

</form>
</>
)}

export default Login
