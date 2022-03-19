import {
  successColor,
  grayColor,
  themeColor,
  blackColor,
  whiteColor,
} from "assets/jss/material-dashboard-react";

const taskStyle = {
  //Task
  content: { paddingTop: 30 },
  root: {
    marginLeft: 5,
    "&$checked": {
      color: successColor[1],
    },
  },
  checked: {},
  formControlRoot: {
    minWidth: 140,
    marginTop: "0px !important",
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
    marginBottom: 3,
    "&:hover": {
      color: "#000",
    },
  },
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
  subTaskHeader: {
    display: "inline-flex",
    alignItems: "center",
    paddingLeft: 15,
  },
  subTaskList: {
    borderRadius: 15,
    padding: "0",
    marginTop: 10,
    backgroundColor: whiteColor,
  },
  taskCard: {
    padding: "10px 5px 5px 5px",
    marginTop: 10,
    backgroundColor: whiteColor,
    borderRadius: 15,
  },
  openColor: {
    color: successColor[0],
  },
  startedColor: {
    color: blackColor,
  },
  closedColor: {
    color: grayColor[3],
  },
  editTaskBtn: {
    position: "absolute",
    right: 15,
    color: themeColor,
  },
  addBtn: {
    marginRight: 0,
    float: "right",
  },
  container: {
    marginTop: "0 !important",
  },
  valueLabel: {
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000",
    },
  },
  sliderRoot: {
    color: successColor[3],
    padding: "25px 0",
  },
  updateBtn: {
    float: "right",
    color: whiteColor,
    backgroundColor: themeColor,
    padding: "5px 15px",
    // fontSize: 12,
    "&:hover": {
      backgroundColor: themeColor,
      boxShadow: "0 7px 10px -5px rgb(18, 20, 50, .2)",
    },
  },
  taskTitle: {
    color: blackColor,
    "&:hover": {
      color: themeColor,
    },
  },
  listItem: {
    borderRadius: 15,
    padding: "5px 25px",
    "&:hover": {
      backgroundColor: "#f6f7f9",
      cursor: "pointer",
    },
  },
  radioRoot: {
    "&$checked": {
      color: themeColor,
    },
  },
  checked: {},
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
  pagination: {
    paddingTop: 15,
    float: "right"
  },

  //taskForm
  formControlRoot: { width: "100%" },
  inputFocused: {},
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
  radioRoot: {
    "&$checked": {
      color: themeColor,
    },
  },
  checked: {},
  formLabelRoot: {
    marginTop: 10,
    fontSize: 15,
  },
  formLabelFocused: { color: themeColor + "!important" },
  formGroupRoot: {
    flexDirection: "row",
  },
  radioLabel: {
    fontSize: 16,
    color: grayColor[2],
  },
  item: {
    paddingLeft: "0 !important",
  },
  outlinedInputRoot: {
    "&:hover $notchedOutline": {
      borderColor: themeColor,
    },
    "&$focused $notchedOutline": {
      borderColor: themeColor,
    },
  },
  focused: {},
  notchedOutline: {},
};

export default taskStyle;
