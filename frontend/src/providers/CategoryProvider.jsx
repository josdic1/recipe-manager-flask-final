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

return (
<>
<CategoryContext.Provider 
    value={{ categories  }}>
  {children}
</CategoryContext.Provider>
</>
)}

export default CategoryProvider
