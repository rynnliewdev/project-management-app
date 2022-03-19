import { themeColor } from "assets/jss/material-dashboard-react";
import { whiteColor } from "assets/jss/material-dashboard-react";

const milestoneStyle = {
  //Milestone
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
  breadcrumbLink: {
    color: "#808080",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: "#000",
    },
  },
  pagination: {
    paddingTop: 15,
    justifyContent: "center",
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
  container: {
    marginTop: "10px !important",
  },

  //milestoneForm
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
  item: {
    paddingLeft: "0 !important",
  },
};

export default milestoneStyle;
