import React, { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Swal from "sweetalert2";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
//@material-ui/icon
import CloseIcon from "@material-ui/icons/Close";
//@material-ui/pickers
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
//core components
import CustomButton from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { AITextField } from "components/AIComponents/AIComponents"; //@material-ui/pickers
//assets
import styles from "assets/jss/ai-zoho/views/milestoneStyle";
import { themeColor } from "assets/jss/material-dashboard-react";
//services
import * as MILESTONE from "../../services/milestone";
import * as PROJECT from "../../services/project";
//global hooks-store
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);

const MilestoneForm = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [projectList, setProjectList] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: props.milestoneID,
    name: "",
    project: props.projectID ? props.projectID : "",
    start_date: "",
    end_date: "",
  });

  const { name, project, start_date, end_date } = formData;
  const milestoneID = props.milestoneID;

  function fetchProjectList() {
    PROJECT.getSimpleProjectList().then((res) => {
      if (res.status == "success") {
        setProjectList(res.data);
      }
    });
  }

  function fetchMilestone() {
    setLoading(true);
    MILESTONE.getMilestone(milestoneID)
      .then((res) => {
        if (res.status == "success") {
          setFormData({
            ...formData,
            ["name"]: res.data.name,
            ["project"]: res.data.project_id,
            ["start_date"]: res.data.start_date,
            ["end_date"]: res.data.end_date,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err == "unauthorized") {
          props.history.replace("/login");
        } else {
          if (err.status == "not found") {
            Swal.fire({
              icon: "error",
              title: "Oops",
              text: "Page Not Found",
            }).then(() => {
              props.history.goBack();
            });
          } else if (err.status == "forbidden") {
            setError(true);
            setErrorMsg(err.message);
          }
        }
      });
  }

  useEffect(() => {
    fetchProjectList();
    if (props.formAction === "edit") {
      fetchMilestone();
    }
  }, []);

  const handleStartDateChange = (date) => {
    setFormData({ ...formData, ["start_date"]: date });
  };
  const handleEndDateChange = (date) => {
    setFormData({ ...formData, ["end_date"]: date });
  };
  const updateFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addMilestone = (newFormData) => {
    MILESTONE.addMilestone(newFormData)
      .then((res) => {
        if (res.status == "success") {
          if (props.fetchMilestoneList) {
            props.fetchMilestoneList();
          }
          setLoading(false);
          handleFormClose();
          props.setAlert(true);
          props.setAlertMsg(res.message);
          setTimeout(() => {
            props.setAlert(false);
          }, 3500);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        if (err.status == "forbidden") {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Something went wrong, please try again.");
        }
      });
  };

  const updateMilestone = (newFormData) => {
    MILESTONE.updateMilestone(newFormData)
      .then((res) => {
        if (res.status == "success") {
          handleFormClose();
          props.setAlert(true);
          props.setAlertMsg(res.message);
          setTimeout(() => {
            props.setAlert(false);
          }, 3500);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        if (err.status == "forbidden") {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Something went wrong, please try again.");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newFormData = formData;
    newFormData = {
      ...newFormData,
      ["start_date"]: isValid(start_date)
        ? format(start_date, "yyyy-MM-dd")
        : start_date,
      ["end_date"]: isValid(end_date)
        ? format(end_date, "yyyy-MM-dd")
        : end_date,
    };

    setLoading(true);
    setError(false);
    if (props.formAction === "add") {
      addMilestone(newFormData);
    } else if (props.formAction === "edit") {
      updateMilestone(newFormData);
    }
  };

  const handleFormClose = () => {
    dispatch("SET_FORM_OPEN", false);
  };

  return (
    <Dialog
      open={state.formOpen}
      onClose={handleFormClose}
      fullScreen={window.innerWidth > 480 ? false : true}
      fullWidth
    >
      {loading && <LinearProgress />}
      {window.innerWidth > 480 ? (
        <DialogTitle className={classes.dialogTitle}>
          {" "}
          {props.formAction == "add" ? "Add Milestone" : "Edit Milestone"}
        </DialogTitle>
      ) : (
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleFormClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="subtitle1" className={classes.title}>
              {props.formAction == "add" ? "Add Milestone" : "Edit Milestone"}
            </Typography>
            <Button autoFocus color="inherit" onClick={(e) => handleSubmit(e)}>
              {props.formAction == "add" ? "Add" : "Update"}
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <form onSubmit={(e) => handleSubmit(e)} className={classes.form}>
          {error && (
            <GridItem>
              <FormHelperText error>{errorMsg}</FormHelperText>
            </GridItem>
          )}
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <AITextField
                autoFocus
                required
                fullWidth
                variant="outlined"
                margin="dense"
                label="Milestone Name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => updateFormData(e)}
                inputProps={{
                  maxLength: 100,
                  minLength: 1,
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <AITextField
                select
                required
                fullWidth
                variant="outlined"
                margin="dense"
                name="project"
                label="Project"
                value={project}
                onChange={(e) => updateFormData(e)}
                disabled={props.projectID ? true : false}
              >
                {Object.entries(projectList).map((project) => (
                  <MenuItem key={project[0]} value={project[0]}>
                    {project[1]}
                  </MenuItem>
                ))}
              </AITextField>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <GridItem xs={6} sm={6} md={6}>
                <FormControl classes={{ root: classes.formControlRoot }}>
                  <KeyboardDatePicker
                    disableToolbar
                    inputVariant="outlined"
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="start_date"
                    label="Start Date"
                    value={start_date ? start_date : null}
                    onChange={handleStartDateChange}
                    TextFieldComponent={AITextField}
                    KeyboardButtonProps={{
                      "aria-label": "change start date",
                    }}
                    InputProps={{
                      classes: {
                        input: classes.inputDate,
                        root: classes.rootDate,
                      },
                    }}
                  />
                </FormControl>
              </GridItem>

              <GridItem xs={6} sm={6} md={6}>
                <FormControl classes={{ root: classes.formControlRoot }}>
                  <KeyboardDatePicker
                    disableToolbar
                    inputVariant="outlined"
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    id="end_date"
                    label="End Date"
                    value={end_date ? end_date : null}
                    onChange={handleEndDateChange}
                    TextFieldComponent={AITextField}
                    KeyboardButtonProps={{
                      "aria-label": "change end date",
                    }}
                    minDate={start_date}
                    InputProps={{
                      classes: {
                        input: classes.inputDate,
                        root: classes.rootDate,
                      },
                    }}
                  />
                </FormControl>
              </GridItem>
            </MuiPickersUtilsProvider>
          </GridContainer>
          {window.innerWidth > 480 ? (
            <DialogActions className={classes.dialogActions}>
              <GridContainer justify="flex-end">
                <GridItem xs>
                  <CustomButton
                    style={{ float: "right" }}
                    onClick={handleFormClose}
                  >
                    Cancel
                  </CustomButton>
                </GridItem>
                <GridItem
                  xs
                  classes={{
                    item: classes.item,
                  }}
                >
                  <CustomButton
                    type="submit"
                    style={{ backgroundColor: themeColor }}
                  >
                    {props.formAction === "add" ? "Add" : "Update"}
                  </CustomButton>
                </GridItem>
              </GridContainer>
            </DialogActions>
          ) : null}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneForm;
