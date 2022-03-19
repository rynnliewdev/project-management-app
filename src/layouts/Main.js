import React from "react";
import { Switch, Route, Redirect, matchPath } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/appStyle.js";

import logo from "assets/img/ailogo.png";
import Task from "views/Task/Task";
import TaskList from "views/TaskList/TaskList";
import Project from "views/Project/Project";
import Milestone from "views/Milestone/Milestone";
let ps;

const switchRoutes = (
  <Switch>
    <Route exact path="/project" component={Project} />
    <Route exact path="/project/:id/tasklist" component={TaskList} />
    <Route exact path="/project/:id/tasklist/:id/:id" component={Task} />
    <Route exact path="/project/:id/milestone" component={Milestone} />
    <Route
      exact
      path="/project/:id/milestone/:id/tasklist"
      component={TaskList}
    />
    <Route
      exact
      path="/project/:id/milestone/:id/tasklist/:id/:id"
      component={Task}
    />
    {routes.map((prop, key) => {
      if (prop.layout === "") {
        return (
          <Route
            exact
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="" to="/project" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Main({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [color, setColor] = React.useState("blue");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const resizeFunction = () => {
  //   if (window.innerWidth >= 960) {
  //     setMobileOpen(false);
  //   }
  // };
  // initialize and destroy the PerfectScrollbar plugin
  // React.useEffect(() => {
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     ps = new PerfectScrollbar(mainPanel.current, {
  //       suppressScrollX: true,
  //       suppressScrollY: false,
  //     });
  //     document.body.style.overflow = "hidden";
  //   }
  //   window.addEventListener("resize", resizeFunction);

  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     if (navigator.platform.indexOf("Win") > -1) {
  //       ps.destroy();
  //       ps = null;
  //     }
  //     window.removeEventListener("resize", resizeFunction);
  //   };
  // }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      {rest.location.pathname !== "/project" && (
        <Sidebar
          className={classes.sidebar}
          routes={routes}
          logoText={"Zoho"}
          logo={logo}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          {...rest}
        />
      )}
      <div
        className={
          rest.location.pathname !== "/project"
            ? classes.mainPanel
            : classes.mainPanelHome
        }
        ref={mainPanel}
      >
        <Navbar
          logoText={"Zoho"}
          logo={logo}
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content} id="content">
          <div className={classes.container}>{switchRoutes}</div>
        </div>
      </div>
    </div>
  );
}
