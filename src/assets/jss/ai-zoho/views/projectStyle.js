import { themeColor, whiteColor } from "assets/jss/material-dashboard-react";

const projectStyle = {
  //Project
  listItem: {
    borderRadius: 15,
    backgroundColor: whiteColor,
    padding: "3px 30px 3px 35px",
    margin: "5px 0",
    "&:hover": {
      backgroundColor: "#f6f7f9",
      cursor: "pointer",
      boxShadow: "0 7px 10px -5px rgb(18, 20, 50, .2)",
    },
  },
  pagination: {
    paddingTop: 15,
    justifyContent: "center",
  },
  addBtn: {
    color: whiteColor,
    backgroundColor: themeColor,
    padding: "5px 15px",
    "&:hover": {
      backgroundColor: themeColor,
      boxShadow: "0 7px 10px -5px rgb(18, 20, 50, .2)",
    },
  },
  snackBtnGroup: {
    position: "absolute",
    top: 60,
    right: 10,
    alignItems: "center",
    display: "flex",
  },
  filterBtn: {
    minWidth: 50,
  },
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

  //projectForm
  formControlRoot: { width: "100%" },
  inputLabel: {
    color: "gray",
    fontWeight: "400",
    "&.Mui-focused": {
      color: themeColor,
    },
  },
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

export default projectStyle;
