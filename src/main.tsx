// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./WebsiteApp";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Root from "./Roots";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);