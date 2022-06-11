import React from "react";
import ReactDOM from "react-dom";
import Content from "./layout/content";

import { BrowserRouter } from "react-router-dom";
import Footer from "./layout/footer";
import Header from "./layout/header";

ReactDOM.render(
  <BrowserRouter>
    <Header />
      <Content />
    <Footer />
  </BrowserRouter>,
  document.getElementById("root")
);