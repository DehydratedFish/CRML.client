import { Outlet } from "react-router";

import { Navigation } from "./components";


function App(): JSX.Element {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    )
}

export default App;

