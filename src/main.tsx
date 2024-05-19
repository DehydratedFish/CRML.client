import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from "react-router-dom";

import { RouterProvider } from "react-router-dom";

import { SWRConfig } from "swr";
import axios from 'axios';

import App from "./app";
import { Overview, CustomerManagement, CustomerDetail } from "./components";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const axiosFetcher = (url: string) => axios.get(url).then((response) => response.data);

const router = createBrowserRouter([{
    path: "/",
    element: <App />,

    children: [
        {path: "", element: <Overview />},
        {path: "/customer", element: <CustomerManagement />},
        {path: "/customer/:id", element: <CustomerDetail />}
    ]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SWRConfig value={{fetcher: axiosFetcher}}>
            <RouterProvider router={router} />
        </SWRConfig>
        <ToastContainer />
    </React.StrictMode>,
)

