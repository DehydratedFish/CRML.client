import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import App from "./app";
import Overview from './components/pages/Overview';
import CustomerManagement from './components/pages/CustomerManagement';
import CustomerDetail from './components/pages/CustomerDetail';


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
        <RouterProvider router={router} />
        <ToastContainer />
    </React.StrictMode>,
)

