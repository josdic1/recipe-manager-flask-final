import { useState, useEffect } from "react"
import CategoryContext from "../contexts/CategoryContext"

function CategoryProvider({children}) {

return (
<>
<CategoryContext.Provider 
    value={{}}>
  {children}
</CategoryContext.Provider>
</>
)}

export default CategoryProvider
