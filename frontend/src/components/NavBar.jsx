import { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../contexts/UserContext"

function NavBar() {
const { loggedInUser, logoutUser } = useContext(UserContext)


return (
<>
<nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to="recipes">Recipes</NavLink>
    <NavLink to="users">Users</NavLink>
    <NavLink to="categories">Categories</NavLink>
    <NavLink to="generator">Relationships</NavLink>
    {loggedInUser?.id && (
    <button onClick={logoutUser}>Logout</button>
)}
</nav>
</>
)}

export default NavBar
