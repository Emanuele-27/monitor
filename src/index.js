import React from "react";
import ReactDOM from "react-dom";
import Content from "./layout/content";

import { BrowserRouter } from "react-router-dom";
import Footer from "./layout/footer";
import Header from "./layout/header";
import Sidebar from "./layout/sidebar";

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Sidebar />
      <Content />
    </div>
    <Footer />
  </BrowserRouter >,
  document.getElementById("root")
);