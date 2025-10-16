import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import RecipeList from "./RecipeList" // Re-use the existing component!

function CategoryDetail() {
    const { id } = useParams()
    const [category, setCategory] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/categories/${id}`)
            .then(res => res.json())
            .then(data => {
                setCategory(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error fetching category:", err)
                setLoading(false)
            })
    }, [id])

    if (loading) return <p>Loading...</p>
    if (!category) return <p>Category not found.</p>

    return (
        <div>
            <h1>Recipes in: {category.name}</h1>
            <RecipeList recipes={category.recipes} />
            <Link to="/categories">Back to all categories</Link>
        </div>
    )
}

export default CategoryDetail