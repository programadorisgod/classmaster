import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Home/Css/Styles.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const Dashboard = lazy(() => import("./Dashboard/Dashboard.jsx"));
const Home = lazy(() => import("./Home/Home.jsx"));
const Access = lazy(() => import("./Access/Access.jsx"));
const PageError = lazy(() => import("./PageError/Error.jsx"));


const App = () => {
  return (
    <Router>
      <Suspense fallback='Loanding...'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Access />} />
          <Route path="/register" element={<Access Form="Register" />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="*" element={<PageError />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

root.render(<App />);