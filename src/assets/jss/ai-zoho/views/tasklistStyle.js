import {
  successColor,
  grayColor,
  themeColor,
  warningColor,
  dangerColor,
  whiteColor,
} from "assets/jss/material-dashboard-react";

const tasklistStyle = {
  //TaskList
  content: {
    paddingTop: 30,
  },
  root: {
    "&$checked": {
      color: successColor[1],
    },
  },
  radioRoot: {
    "&$checked": {
      color: themeColor,
    },
  },
  checked: {},
  listItem: {},
  expansionPanel: {
    margin: "3px 0",
    padding: "0 20px",
  },
  panelDetails: {
    padding: "3px 30px",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingLeft: 40,
    paddingRight: 30,
    borderRadius: 15,
    // margin: "3px 0",
    "&:hover": {
      backgroundColor: "#f6f7f9",
      cursor: "pointer",
    },
  },
  panelRoot: {
    minHeight: "50px !important",
  },
  panelContent: {
    margin: "15px 0 !important",
  },
  pagination: {
    paddingTop: 15,
    justifyContent: "center",
  },
  breadcrumbLink: {
    color: "#808080",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: "#000",
    },
  },
  link: {
    color: grayColor[2],
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: "#000",
    },
  },
  container: {
    marginTop: "10px !important",
  },
  //   addBtnSm: {
  //     marginRight: 10,
  //     color: themeColor,
  //     borderColor: themeColor,
  //     minWidth: 35,
  //     fontSize: 12,
  //     paddingRight: 6,
  //   },
  editBtn: {
    padding: "6px 15px",
    marginLeft: 8,
    color: themeColor,
    backgroundColor: "transparent",
    width: 30,
  },
  editBtnRoot: {
    minWidth: 30,
  },
  addBtnSm: {
    margin: "5px 0",
    backgroundColor: themeColor,
    boxShadow: "0 7px 10px -5px rgb(18, 20, 50, .5)",
    "&:hover": {
      backgroundColor: themeColor,
      cursor: "pointer",
    },
  },
  addBtnCircle: {
    backgroundColor: themeColor,
    position: "fixed",
    right: 25,
    bottom: 25,
    zIndex: 1,
    boxShadow: "0 7px 10px -5px rgb(18, 20, 50, .5)",
    "&:hover": {
      backgroundColor: themeColor,
      cursor: "pointer",
    },
  },
  filterBtn: {
    minWidth: 50,
  },
  filterBtnSm: {
    marginRight: 10,
    color: themeColor,
    borderColor: themeColor,
    padding: "5px 0",
    minWidth: 40,
  },
  snackBtnGroup: {
    position: "absolute",
    top: 85,
    right: 10,
    alignItems: "center",
    display: "flex",
  },
  snackBtnGroupSm: {
    position: "absolute",
    top: 90,
    right: 10,
    alignItems: "center",
    display: "flex",
  },
  taskCard: {
    borderRadius: 15,
    margin: "5px 0",
  },
  formGroupRoot: {
    flexDirection: "row",
  },
  radioLabel: {
    fontSize: 16,
    color: grayColor[2],
  },
  dialogContentRoot: {
    padding: "0 15px 8px",
  },
  formContainer: {
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
  milestoneLink: {
    color: warningColor[4],
    "&:hover": { color: dangerColor[0] },
  },
  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  btnContainerRoot: {
    margin: "0 !important",
  },
  btnItemRoot: {
    paddingRight: "0 !important",
  },
  btnSmText: {
    color: whiteColor,
    textShadow: "2px 2px 10px #000",
  },

  //tasklistForm
  formControlRoot: { width: "100%" },
  select: {
    "&:hover:not($disabled):before": {
      borderColor: themeColor,
    },
    "&:after": {
      borderColor: themeColor,
    },
  },
  inputDate: {
    minWidth: 60,
  },
  rootDate: {
    paddingRight: "0 !important",
  },
  item: {
    paddingLeft: "0 !important",
  },
};

export default tasklistStyle;
