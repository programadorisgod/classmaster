import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home/Home.jsx";
import "./Home/Css/Styles.css";
import { Access } from "./Access/Access.jsx";
import { PageError } from "./PageError/Error.jsx";
import { Dashboard } from "./Dashboard/Dashboard.jsx";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PageError />,
  },
  {
    path: "/login",
    element: <Access />,
  },
  {
    path: "/register",
    element: <Access Form="Register" />,
  },
  {
    path: "/app",
    element: <Dashboard />,
  },
]);

root.render(<RouterProvider router={router} />);

