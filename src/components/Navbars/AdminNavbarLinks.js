import React, { useState, useEffect } from "react";
import { Redirect, withRouter } from "react-router-dom";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Person from "@material-ui/icons/Person";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import Swal from "sweetalert2";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles(styles);

const customStyles = makeStyles((styles) => ({
  profileItem: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: 2,
  },
  dropdownList: {
    width: 120,
    paddingTop: 0,
    paddingBottom: 0,
  },
  dropdownItem: {
    fontSize: "15px",
    paddingTop: 10,
    paddingBottom: 10,
  },
  icons: {
    marginRight: "10px !important",
    marginLeft: "10px !important",
    // fontSize: 16
  },
  buttonLink: {
    paddingRight: 15,
    paddingLeft: 20,
    fontSize: 16,
    paddingBottom: 10,
    // boxShadow: "none",
    // background: "transparent",
    // "&,&:focus,&:hover": {
    //   backgroundColor: "transparent",
    //   color: "#55555",
    //   boxShadow: "none"
    // }
  },
}));
function AdminNavbarLinks(props) {
  const classes = useStyles();
  const customClasses = customStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const handleClickNotification = event => {
  //   if (openNotification && openNotification.contains(event.target)) {
  //     setOpenNotification(null);
  //   } else {
  //     setOpenNotification(event.currentTarget);
  //   }
  // };
  // const handleCloseNotification = () => {
  //   setOpenNotification(null);
  // };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const updateWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  // useEffect(() => {
  //   if (window.innerWidth > 959) {
  //     setWindowWidth(true);
  //   } else {
  //     setWindowWidth(false);
  //   }
  // }, [window.innerWidth]);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const logout = () => {
    Toast.fire({
      icon: "success",
      title: "Logout successfully",
    });
    localStorage.removeItem("tokenData");
    props.history.replace("/login");
  };

  if (localStorage.getItem("tokenData") == null) {
    return <Redirect from="" to="/login" />;
  }

  return (
    <div style={{ display: "grid" }}>
      <IconButton>
        <AddCircleOutlineIcon size="large" className={customClasses.icons} />
      </IconButton>
      {/* <div className={classes.manager}>
        <div className={customClasses.profileItem}>
          <Button
            color={windowWidth > 959 ? "transparent" : "white"}
            // justIcon={window.innerWidth > 959}
            // simple={window.innerWidth > 959}
            aria-owns={openProfile ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={handleClickProfile}
            className={customClasses.buttonLink}
          >
            <AddCircleOutlineIcon className={customClasses.icons}/>
            <Person className={customClasses.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
            <ExpandMore className={customClasses.icons} />
          </Button>
        </div>

        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
          style={{ paddingLeft: 5 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu" className={customClasses.dropdownList}>
                    <MenuItem
                        onClick={handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Profile
                      </MenuItem>
                    <MenuItem
                        onClick={handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Settings
                      </MenuItem> */}
      {/* <Divider light />
                    <MenuItem
                      onClick={logout}
                      className={customClasses.dropdownItem}
                    >
                      Logout
                      <ExitToApp
                        className={classes.icon}
                        style={{ paddingLeft: 10, opacity: 0.55 }}
                      />
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div> */}
    </div>
  );
}

export default withRouter(AdminNavbarLinks);
