/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Redirect, withRouter, matchPath } from "react-router-dom";

import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";
import { useStore } from "../../hooks-store/store";

import Swal from "sweetalert2";
import GridContainer from "components/Grid/GridContainer";

const useStyles = makeStyles(styles);

// const Toast = Swal.mixin({
//   toast: true,
//   position: "top-end",
//   showConfirmButton: false,
//   timer: 2000,
//   timerProgressBar: true,
//   onOpen: (toast) => {
//     toast.addEventListener("mouseenter", Swal.stopTimer);
//     toast.addEventListener("mouseleave", Swal.resumeTimer);
//   },
// });

export default function Sidebar(props) {
  const classes = useStyles();
  const state = useStore()[0];
  const [isLoggedIn, setLoggedIn] = useState(true);
  const matchProject = matchPath(props.location.pathname, {
    path: "/project/:id",
  });
  const projectID = matchProject ? matchProject.params.id : null;

  const logout = () => {
    // Toast.fire({
    //   icon: "success",
    //   title: "Logout successfully",
    // });
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Redirect from="" to="/login" />;
  }

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    window.location.href.indexOf(routeName);
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, logoText, routes } = props;
  var links = (
    <List
      className={classes.list}
      onClick={props.open == true ? props.handleDrawerToggle : null}
    >
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        var routePath =
          prop.path !== "/login"
            ? prop.layout + "/project/" + projectID + prop.path
            : prop.layout + prop.path;

        listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(routePath),
        });

        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(routePath),
        });

        return (
          <NavLink
            to={routePath}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
            onClick={prop.path === "/login" ? logout : null}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              <GridContainer direction="column" alignItems="center">
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  />
                )}
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography={true}
                />
              </GridContainer>
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );

  var brand = (
    <div className={classes.logo}>
      <a href="" className={classNames(classes.logoLink)} target="_blank">
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapperSm}>
            {/* {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />} */}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="right"
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {/* {brand} */}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
