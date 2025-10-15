import App from './App.jsx'
import Error from './pages/Error.jsx'
import Home from './pages/Home.jsx'
import UserList from './components/UserList.jsx'
import CategoryList from './components/CategoryList.jsx'
import RecipeList from './components/RecipeList.jsx'

const routes = [
  { path: '/', element: <App />, errorElement: <Error/>, 
        children: [
            { index: true, element: <Home /> },
            { path: 'users', element: <UserList /> },
            { path: 'categories', element: <CategoryList /> },
            { path: 'recipes', element: <RecipeList /> },

  ] },
]

export default routes