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
      setCategories(prevCategories => [...prevCategories, response.data]);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }

  async function handleEdit(editedCategory) {
    try {
      const response = await axios.put(`${API_URL}/categories/${editedCategory.id}`, editedCategory);
      setCategories(prevCategories => 
        prevCategories.map(cat => cat.id === editedCategory.id ? response.data : cat)
      );
    } catch (error) {
      console.error("Error editing category:", error);
    }
  }

  async function handleDelete(categoryId) {
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  return (
    <CategoryContext.Provider 
      value={{ categories, handleNew, handleEdit, handleDelete }}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider