import { Outlet } from "react-router-dom"
import NavBar from "./components/NavBar"
import RecipeProvider from "./providers/RecipeProvider"
import CategoryProvider from "./providers/CategoryProvider"
import UserProvider from "./providers/UserProvider"

function App() {


  return (
    <>
    <UserProvider>
      <RecipeProvider>
        <CategoryProvider>
              <header>
      <NavBar />
    </header>
     <main>
      <Outlet />
     </main>
        </CategoryProvider>
      </RecipeProvider>
    </UserProvider>
    </>
  )
}


export default App
