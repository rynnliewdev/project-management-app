import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
} from "assets/jss/material-dashboard-react.js";
import { themeColor } from "assets/jss/material-dashboard-react";
import { blackColor } from "assets/jss/material-dashboard-react";

const headerStyle = () => ({
  appBar: {
    backgroundColor: whiteColor,
    boxShadow: "0 0 5px 0 rgba(0,0,0,.1)",
    borderBottom: "0",
    marginBottom: "0",
    position: "fixed",
    width: "100%",
    // paddingTop: "5px",
    zIndex: "1029",
    color: grayColor[7],
    border: "0",
    // borderRadius: "3px",
    // padding: "5px 0",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "block",
  },
  container: {
    ...container,
    minHeight: "50px",
  },
  flex: {
    flex: 1,
  },
  title: {
    ...defaultFont,
    padding: "15px 10px",
    fontWeight: 400,
    letterSpacing: "unset",
    lineHeight: "30px",
    fontSize: "20px",
    borderRadius: "3px",
    textTransform: "none",
    color: blackColor,
    margin: "0",
    "&:hover,&:focus": {
      background: "transparent",
    },
  },
  appResponsive: {
    top: "8px",
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  navBtn: {
    padding: "6px 15px",
    marginRight: 8,
    color: themeColor,
    backgroundColor: "transparent",
    width: 30,
  },
  navBtnRoot: {
    minWidth: 30,
  },
  menuList: {
    padding: 0,
  },
  addBtn: {
    marginRight: 30
  },

  logo: {
    position: "relative",
    paddingRight: "20px",
    marginRight: "15px",
    borderRight: "solid 0.5px #80808099",
    zIndex: "4",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "0",
      height: "1px",
      right: "30px",
      width: "calc(100% - 30px)",
      // backgroundColor: "rgba(" + hexToRgb(grayColor[6]) + ", 0.3)"
    },
  },
  logoLink: {
    ...defaultFont,
    textTransform: "uppercase",
    padding: "5px 0",
    display: "block",
    fontSize: "18px",
    textAlign: "left",
    fontWeight: "500",
    lineHeight: "30px",
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover": {
      color: themeColor,
    },
  },
  logoLinkRTL: {
    textAlign: "right",
  },
  logoImage: {
    width: "30px",
    display: "inline-block",
    maxHeight: "30px",
    marginLeft: "10px",
    marginRight: "10px",
  },
  img: {
    width: "35px",
    top: "7px",
    position: "absolute",
    verticalAlign: "middle",
    border: "0",
  },
});

export default headerStyle;
