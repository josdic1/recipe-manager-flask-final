import App from './App.jsx'
import Error from './pages/Error.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import UserList from './components/UserList.jsx'
import CategoryList from './components/CategoryList.jsx'
import RecipeList from './components/RecipeList.jsx'
import RecipeCard from './pages/RecipeCard.jsx'
import NewRecipeForm from './pages/NewRecipeForm.jsx'
import EditRecipeForm from './pages/EditRecipeForm.jsx'
import NewCategoryForm from './pages/NewCategoryForm.jsx'
import EditCategoryForm from './pages/EditCategoryForm.jsx'
import NewUserForm from './pages/NewUserForm.jsx'
import EditUserForm from './pages/EditUserForm.jsx'
import FullSchemaGenerator from './components/RelationshipGenerator.jsx'
import CategoryDetail from './components/CategoryDetail.jsx'

const routes = [
  { path: '/', element: <App />, 
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            
            // Updated Routes
            { path: 'users', element: <UserList /> },
            { path: 'recipes', element: <RecipeList /> },
            { path: 'categories', element: <CategoryList /> }, // Main category list
            { path: 'category/:id', element: <CategoryDetail /> }, // Drill-down detail page
            {path: 'generate-schema', element: <FullSchemaGenerator />},
            { path: 'recipe/new', element: <NewRecipeForm /> },
            { path: 'category/new', element: <NewCategoryForm /> },
            { path: 'user/new', element: <NewUserForm /> },
            { path: 'recipe/:id/edit', element: <EditRecipeForm /> },
            { path: 'category/:id/edit', element: <EditCategoryForm /> },
            { path: 'user/:id/edit', element: <EditUserForm /> },
            { path: 'recipe/:id', element: <RecipeCard /> },
            { path: '*', element: <Error /> } 
  ] },
]

export default routes