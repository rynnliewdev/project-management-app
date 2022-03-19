import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import CheckBox from "@material-ui/core/Checkbox";

import { themeColor, grayColor } from "assets/jss/material-dashboard-react";
import Link from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";

export const AITextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: themeColor,
    },
    "& .MuiInput-underline": {
      "&:hover:not(.Mui-$disabled):before": {
        borderBottomColor: themeColor,
      },
      "&:before": {
        borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
      },
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: themeColor,
    },

    "& .MuiOutlinedInput-root": {
      "&:hover:not(.Mui-disabled) fieldset": {
        borderColor: themeColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: themeColor,
      },
    },
    "& .MuiInputBase-root": {
      borderColor: themeColor,
    },
  },
})(TextField);

export const AIButton = withStyles((theme) => ({
  root: {
    // padding: "6px 15px",
    marginRight: 10,
    color: themeColor,
    backgroundColor: "#f6f7f8",
    borderColor: themeColor,
    // color: "#FFF",
    // backgroundColor: themeColor,
    "&:hover": {
      backgroundColor: "#fff",
      boxShadow: "0 7px 10px -5px rgb(18, 20, 50, .2)",
    },
  },
}))(Button);

export const AILink = withStyles((theme) => ({
  root: {
    color: themeColor,
    "&:hover": {
      color: themeColor,
      textDecoration: "none",
    },
  },
}))(Link);

export const AIAlert = withStyles({
  root: {
    backgroundColor: "#edf7ed",
    width: "100%",
  },
})(Alert);
