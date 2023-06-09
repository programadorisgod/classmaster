import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client"; // Importar createRoot desde aquí
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./Home/Home.jsx";
import "./Home/Css/Styles.css";
import { Access } from "./Access/Access.jsx";
import { PageError } from "./PageError/Error.jsx";
import { Dashboard } from "./Dashboard/Dashboard.jsx";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);


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