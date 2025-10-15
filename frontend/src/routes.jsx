import App from './App.jsx'
import Error from './pages/Error.jsx'
import Home from './pages/Home.jsx'

const routes = [
  { path: '/', element: <App />, errorElement: <Error/>, 
        children: [
            { index: true, element: <Home /> },

  ] },
]

export default routes