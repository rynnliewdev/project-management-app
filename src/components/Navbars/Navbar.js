import React, { useState, useRef } from "react";
import { withRouter, matchPath } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
// @material-ui/icons
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
//views
import ProjectForm from "views/Project/projectForm.js";
//assets
import { themeColor } from "assets/jss/material-dashboard-react.js";
import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";
import { Divider, MenuItem, Menu } from "@material-ui/core";
import { AIButton } from "components/AIComponents/AIComponents";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);
const formStyles = makeStyles({
  dialogContentRoot: {
    padding: "0 15px 8px",
  },
  editFormContainer: {
    marginTop: "0 !important",
  },
  appBar: {
    position: "relative",
    marginBottom: 15,
    backgroundColor: themeColor,
  },
  title: {
    marginLeft: "20px",
    flex: 1,
  },
});

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

function Header(props) {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const matchProject = matchPath(props.location.pathname, {
    path: "/project/:id",
  });
  const projectTitle = localStorage.getItem("projectTitle");

  function makeBrand() {
    var name;

    if (props.location.pathname == "/project") {
      name = "Projects";
    }
    if (matchProject) {
      if (
        window.location.href.indexOf("/project/" + matchProject.params.id) !==
        -1
      ) {
        name = projectTitle;
      }
    } else {
      props.routes.map((prop) => {
        if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
          name = prop.name;
        }
        return null;
      });
    }
    return name;
  }

  var brand = (
    <div className={classes.logo}>
      <a href="/project" className={classNames(classes.logoLink)}>
        <div className={classes.logoImage}>
          <img src={props.logo} alt="logo" className={classes.img} />
        </div>
        {props.logoText}
      </a>
    </div>
  );

  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color,
  });

  const handleFormOpen = (option) => {
    dispatch("SET_FORM_OPEN", true);
    dispatch("SET_FORM_OPTION", option);
  };

  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        {makeBrand() !== "Projects" && (
          <Hidden mdUp implementation="css">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={props.handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
        )}
        <Hidden smDown implementation="css">
          {brand}
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button
            className={classes.title}
            onClick={
              makeBrand() === projectTitle
                ? () => handleFormOpen("edit project")
                : null
            }
          >
            {makeBrand()}
          </Button>
          {makeBrand() == localStorage.getItem("projectTitle") && (
            <IconButton
              size="small"
              className={classes.navBtn}
              classes={{
                root: classes.navBtnRoot,
              }}
              onClick={() => handleFormOpen("edit project")}
            >
              <EditIcon style={{ fontSize: 20 }} />
            </IconButton>
          )}
        </div>

        <Hidden smUp implementation="css">
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  {...bindTrigger(popupState)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  {...bindMenu(popupState)}
                  classes={{ list: classes.menuList }}
                >
                  {makeBrand() == "Projects" ? (
                    <MenuItem
                      onClick={() => handleFormOpen("add project")}
                      style={{ color: themeColor }}
                    >
                      Add Project
                    </MenuItem>
                  ) : makeBrand() == localStorage.getItem("projectTitle") ? (
                    <MenuItem
                      onClick={() => handleFormOpen("edit project")}
                      style={{ color: themeColor }}
                    >
                      Edit Project
                    </MenuItem>
                  ) : null}
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </Hidden>

        <Hidden xsDown implementation="css">
          {makeBrand() == "Projects" && (
            <AIButton
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleFormOpen("add project")}
              className={classes.addBtn}
            >
              Add Project
            </AIButton>
          )}
        </Hidden>
      </Toolbar>
      {state.loading == true ? <LinearProgress /> : null}
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default withRouter(Header);
