import App from './App.jsx'
import Error from './pages/Error.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import UserList from './components/UserList.jsx'
import CategoryList from './components/CategoryList.jsx'
import RecipeList from './components/RecipeList.jsx'
import NewRecipeForm from './pages/NewRecipeForm.jsx'

const routes = [
  { path: '/', element: <App />, errorElement: <Error/>, 
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: 'users', element: <UserList /> },
            { path: 'categories', element: <CategoryList /> },
            { path: 'recipes', element: <RecipeList /> },
            { path: 'recipe/new', element: <NewRecipeForm /> },

  ] },
]

export default routes