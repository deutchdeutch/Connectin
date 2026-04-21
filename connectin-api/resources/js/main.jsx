import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./index.css";  // si vous avez CSS Tailwind etc.

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);