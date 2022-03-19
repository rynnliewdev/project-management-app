import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
//@material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
//core components
import { AITextField } from "components/AIComponents/AIComponents";
import Button from "components/CustomButtons/Button";
import { AILink } from "components/AIComponents/AIComponents";
//assets
import { themeColor } from "assets/jss/material-dashboard-react";
//services
import * as AUTH from "../../services/auth";

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//         Your Website
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  // avatar: {
  //   margin: theme.spacing(1),
  //   backgroundColor: theme.palette.secondary.main,
  // },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(10),
    padding: theme.spacing(0, 1),
  },
  submit: {
    margin: theme.spacing(15, 0, 2),
    // backgroundColor: themeColor,
    // color: "#fff"
  },
  root: {
    borderRadius: 50,
  },
}));

// const Toast = Swal.mixin({
//   toast: true,
//   position: "top-end",
//   showConfirmButton: false,
//   timer: 1000,
//   timerProgressBar: true,
//   onOpen: (toast) => {
//     toast.addEventListener("mouseenter", Swal.stopTimer);
//     toast.addEventListener("mouseleave", Swal.resumeTimer);
//   },
// });

export default function Login(props) {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  function redirectToApp() {
    props.history.replace("/project");
  }

  function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    let email = event.target.email.value;
    let pass = event.target.password.value;
    let loginData = {
      email: email,
      password: pass,
    };
    AUTH.login(loginData)
      .then((result) => {
        // Toast.fire({
        //   icon: "success",
        //   title: "Logged in successfully",
        // });
        redirectToApp();
      })
      .catch((e) => {
        setLoading(false);
        if (e.status === "unauthorized") {
          setErrorMsg(e.message);
        }
      });
  }

  useEffect(() => {
    let todayDate = new Date();
    if (localStorage.getItem("tokenData") !== null) {
      if (new Date(localStorage.getItem("expireAt")) > todayDate) {
        // setLoggedIn(true);
        redirectToApp();
      } else {
        props.history.replace("/login");
      }
    }
  }, []);

  return (
    <div>
      {loading ? <LinearProgress /> : null}
      <Container component="main" maxWidth="xs" style={{ marginTop: 90 }}>
        <CssBaseline />
        <div className={classes.paper}>
          <div
            style={{
              flexDirection: "row",
              color: themeColor,
            }}
          >
            <Typography
              component="h1"
              align="center"
              variant="h4"
              style={{ lineHeight: 1.5 }}
            >
              Project Management App
            </Typography>
          </div>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          {/* <div>
          <Typography component="h1" variant="h5">
           Login
          </Typography>
          </div> */}
          <form
            className={classes.form}
            onSubmit={(event) => handleLogin(event)}
          >
            <div style={{ color: "red" }}>{errorMsg}</div>
            <AITextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="email"
              // label="Email"
              placeholder="Email"
              name="email"
              autoFocus
              InputProps={{
                classes: {
                  root: classes.root,
                },
              }}
            />
            <AITextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="password"
              // label="Password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                classes: {
                  root: classes.root,
                },
              }}
            />
            <AILink style={{ float: "right", paddingTop: 10 }}>
              Forgot your password?
            </AILink>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              round
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
          </form>
          <AILink>Don't have an account? Register</AILink>
        </div>
        {/* <Box mt={8}>
        <Copyright />
      </Box> */}
      </Container>
    </div>
  );
}
