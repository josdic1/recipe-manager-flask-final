import { useState, useEffect } from "react"
import { API_URL } from "../utils"
import CategoryContext from "../contexts/CategoryContext"
import axios from 'axios'

function CategoryProvider({children}) {
  const [categories, setCategories] = useState([]);

useEffect(() => {
  fetchCategories()
}, []);

async function fetchCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    setCategories(response.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
} 

async function handleNew(newCategory) {
  try {
    const response = await axios.post(`${API_URL}/categories`, newCategory);
    setCategories([...categories, response.data]);
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

return (
<>
<CategoryContext.Provider 
    value={{ categories, handleNew  }}>
  {children}
</CategoryContext.Provider>
</>
)}

export default CategoryProvider
