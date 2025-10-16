import { useState, useEffect, useContext } from "react" // Import useContext
import { API_URL } from "../utils"
import RecipeContext from "../contexts/RecipeContext"
import CategoryContext from "../contexts/CategoryContext" // Import CategoryContext
import axios from 'axios'

function RecipeProvider({children}) {
  const [recipes, setRecipes] = useState([]);
  // Get the function to refresh categories from the context
  const { fetchCategories } = useContext(CategoryContext);

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

  async function handleNew(newRecipe) {
    try {
      const response = await axios.post(`${API_URL}/recipes`, newRecipe);
      setRecipes(prevRecipes => [...prevRecipes, response.data]);
      // After successfully creating a recipe, refresh the category list
      if (fetchCategories) fetchCategories();
    } catch (error) {
    console.error("Error adding new recipe:", error);
    }
  }

  async function handleEdit(editedRecipe) {
    try {
      const response = await axios.put(`${API_URL}/recipes/${editedRecipe.id}`, editedRecipe);
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => recipe.id === editedRecipe.id ? response.data : recipe)
      );
      // Also refresh categories after an edit
      if (fetchCategories) fetchCategories();
    } catch (error) {
      console.error("Error editing recipe:", error);
    }
  }

  async function handleDelete(recipeId) {
    try {
      await axios.delete(`${API_URL}/recipes/${recipeId}`);
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      // You might want to refresh categories here too if your backend deletes orphan categories
      if (fetchCategories) fetchCategories();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  }

  return (
    <RecipeContext.Provider value={{ recipes, handleNew, handleEdit, handleDelete }}>
      {children}
    </RecipeContext.Provider>
  )
}

export default RecipeProvider