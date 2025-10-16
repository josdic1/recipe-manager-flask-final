import { useRouteError } from "react-router-dom"
import NavBar from "../components/NavBar"

function Error() {
    const error = useRouteError()

    return (
        <>
            <header>
                <NavBar />
            </header>
            <main>
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p><i>{error.statusText || error.message}</i></p>
            </main>
        </>
    )
}

export default Error