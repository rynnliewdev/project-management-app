/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Main from "layouts/Main.js";
//views
import Login from "views/Login/Login";
//assets
import "assets/css/material-dashboard-react.css?v=1.8.0";
//global hooks-store
import configureStore from "./hooks-store/app-store";

configureStore();

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Main} />
    </Switch>
    {localStorage.getItem("tokenData") == null ||
    new Date(localStorage.getItem("expireAt")) < new Date() ? (
      <Redirect from="" to="/login" />
    ) : null}
  </Router>,
  document.getElementById("root")
);
