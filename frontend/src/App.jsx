import { Outlet } from "react-router-dom"
import NavBar from "./components/NavBar"
import RecipeProvider from "./providers/RecipeProvider"
import CategoryProvider from "./providers/CategoryProvider"
import UserProvider from "./providers/UserProvider"
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

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
      <ErrorBoundary>
      <Outlet />
      </ErrorBoundary>
     </main>
        </CategoryProvider>
      </RecipeProvider>
    </UserProvider>
    </>
  )
}


export default App
