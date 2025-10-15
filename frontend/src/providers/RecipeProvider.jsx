import { useState, useEffect } from "react"
import { API_URL } from "../utils"
import RecipeContext from "../contexts/RecipeContext"
import axios from 'axios'

function RecipeProvider({children}) {
  const [recipes, setRecipes] = useState([]);

useEffect(() => {
  fetchRecipes()
}, []);

async function fetchRecipes() {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    setRecipes(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
} 

return (
<>
<RecipeContext.Provider 
    value={{ recipes  }}>
  {children}
</RecipeContext.Provider>
</>
)}

export default RecipeProvider
