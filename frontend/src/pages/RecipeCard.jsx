import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import RecipeContext from "../contexts/RecipeContext"

function RecipeCard() {
    const { id } = useParams()
    const { recipes, handleDelete } = useContext(RecipeContext)
    const [ thisRecipe, setThisRecipe ] = useState({
        id: "",
        name: '',
        user_id: "",
        categories: []
    })
 const navigate = useNavigate()

useEffect(() => {
    const found = recipes.find(r => r.id === Number(id)) 
    
    if (found) {
        setThisRecipe(found)
    } else {
        console.error('Recipe not found!')
    }
}, [id, recipes])


const onClick = (id, action) => {
    switch(action) {
        case 'edit':
            navigate(`/recipe/${id}/edit`)
            break
        case 'delete':
            handleDelete(id) 
            navigate('/')
            break
        default:
            console.log('Unknown action')
    }}

    return (
    <>
    <h2>Recipe Card for Recipe ID: {id}</h2>
    <p>ID: {thisRecipe.id}</p>
    <p>Name: {thisRecipe.name}</p>
    <p>User ID: {thisRecipe.user_id}</p>
    <p>Categories: {thisRecipe.categories.join(', ')}</p>
    <button type="button" onClick={() => onClick(thisRecipe.id, 'edit')}>Edit</button>
    <button type="button" onClick={() => onClick(thisRecipe.id, 'delete')}>Delete</button>
    </>
    )}

    export default RecipeCard

