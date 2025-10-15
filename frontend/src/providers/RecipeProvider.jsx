import { useState, useEffect } from "react"
import RecipeContext from "../contexts/RecipeContext"

function RecipeProvider({children}) {

return (
<>
<RecipeContext.Provider 
    value={{}}>
  {children}
</RecipeContext.Provider>
</>
)}

export default RecipeProvider
