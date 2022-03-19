import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { format, isValid } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Swal from "sweetalert2";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
//core components
import CustomButton from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { AITextField } from "components/AIComponents/AIComponents";
//@material-ui/pickers
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
//@material-ui/icons
import CloseIcon from "@material-ui/icons/Close";
//assets
import styles from "assets/jss/ai-zoho/views/taskStyle";
//services
import * as TASKLIST from "../../services/tasklist";
import * as PROJECT from "../../services/project";
import * as TASK from "../../services/task";
import * as USER from "../../services/user";
//views
import { themeColor } from "assets/jss/material-dashboard-react";
//global hooks-store
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);

const TaskForm = forwardRef((props, ref) => {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [durationType, setDurationType] = useState("date_range");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    id: props.taskID,
    name: "",
    description: "",
    project: props.projectID ? props.projectID : "",
    tasklist: props.tasklistID ? props.tasklistID : "",
    parent_task: "",
    owner: [],
    start_date: "",
    due_date: "",
    duration: "",
    duration_unit: "day(s)",
    completion: 0,
    status: "",
  });

  const {
    name,
    description,
    project,
    tasklist,
    parent_task,
    owner,
    start_date,
    due_date,
    duration,
    duration_unit,
    status,
  } = formData;

  const taskID = props.taskID;

  function fetchProjectList() {
    PROJECT.getSimpleProjectList().then((res) => {
      if (res.status == "success") {
        setProjectList(res.data);
      }
    });
  }

  function fetchTaskList() {
    const params = {
      project: props.projectID,
    };
    TASKLIST.getSimpleTaskList(params).then((res) => {
      if (res.status == "success") {
        setTaskList(res.data);
      }
    });
  }

  // function fetchUserList() {
  //   USER.getSimpleUserList().then((res) => {
  //     if (res.status == "success") {
  //       setUserList(res.data);
  //       setCurrentUser(res.current_user);
  //     }
  //   });
  // }
  function fetchProjectUserList() {
    PROJECT.getProjectUserList(props.projectID).then((res) => {
      if (res.status == "success") {
        setUserList(res.data);
        setCurrentUser(res.current_user);
      }
    });
  }

  function fetchTask() {
    dispatch("SET_LOADING", true);
    TASK.getTask(taskID)
      .then((res) => {
        if (res.status == "success") {
          setFormData({
            ...formData,
            ["name"]: res.data.name,
            ["description"]: res.data.description ? res.data.description : "",
            ["project"]: res.data.project_id,
            ["tasklist"]: res.data.task_list_id,
            ["parent_task"]: res.data.parent_id,
            ["owner"]: res.data.owner_id,
            ["start_date"]: res.data.start_date,
            ["due_date"]: res.data.due_date,
            ["duration"]: res.data.duration,
            ["duration_unit"]: res.data.duration_type,
            ["completion"]: res.data.completion ? res.data.completion : 0,
            ["status"]: res.data.status,
          });
        }
        dispatch("SET_LOADING", false);
      })
      .catch((err) => {
        dispatch("SET_LOADING", false);
        if (err == "unauthorized") {
          props.history.replace("/login");
        } else {
          if (err.status == "not found") {
            Swal.fire({
              icon: "error",
              title: "Oops",
              text: "Page Not Found",
            }).then(() => {
              props.history.replace(`/project/${props.projectID}/tasklist`);
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
    fetchTaskList();
    fetchProjectUserList();
    if (props.formAction === "edit") {
      fetchTask();
    }
  }, []);

  const handleStartDateChange = (date) => {
    setFormData({ ...formData, ["start_date"]: date });
  };
  const handleEndDateChange = (date) => {
    setFormData({ ...formData, ["due_date"]: date });
  };
  const handleDurationType = (e) => {
    setDurationType(e.target.value);
  };
  const updateFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useImperativeHandle(ref, () => ({
    submitForm(e) {
      handleSubmit(e);
    },
  }));

  const addTask = (newFormData) => {
    TASK.addTask(newFormData)
      .then((res) => {
        if (res.status == "success") {
          dispatch("SET_LOADING", false);
          handleFormClose();
          props.fetchTaskList();
          props.setAlert(true);
          props.setAlertMsg(res.message);
          setTimeout(() => {
            props.setAlert(false);
          }, 3500);
        }
      })
      .catch((err) => {
        dispatch("SET_LOADING", false);
        setError(true);
        if (err.status == "forbidden") {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Something went wrong, please try again.");
        }
      });
  };

  const updateTask = (newFormData) => {
    TASK.updateTask(newFormData)
      .then((res) => {
        if (res.status == "success") {
          dispatch("SET_LOADING", false);
          handleFormClose();
          props.fetchTask();
          props.setAlert(true);
          props.setAlertMsg(res.message);
          setTimeout(() => {
            props.setAlert(false);
          }, 3500);
        }
      })
      .catch((err) => {
        dispatch("SET_LOADING", false);
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
      ["due_date"]: isValid(due_date)
        ? format(due_date, "yyyy-MM-dd")
        : due_date,
      parent_task: props.taskID ? props.taskID : null,
    };

    dispatch("SET_LOADING", true);
    setError(false);
    if (props.formAction === "add") {
      addTask(newFormData);
    } else if (props.formAction === "edit") {
      updateTask(newFormData);
    }
  };

  const handleFormClose = () => {
    dispatch("SET_FORM_OPEN", false);
  };

  const TaskForm = (
    <form onSubmit={(e) => handleSubmit(e)} className={classes.form}>
      {error && (
        <GridItem>
          <FormHelperText error>{errorMsg}</FormHelperText>
        </GridItem>
      )}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {/* <InputLabel>
                    <Typography>Tasklist Name</Typography>
                  </InputLabel> */}
          <AITextField
            autoFocus
            required
            fullWidth
            variant="outlined"
            margin="dense"
            label="Name"
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
          {/* <InputLabel>
                    <Typography>Overview</Typography>
                  </InputLabel> */}
          <AITextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            margin="dense"
            label="Description"
            id="description"
            name="description"
            value={description}
            onChange={(e) => updateFormData(e)}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <AITextField
            required
            select
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
        <GridItem xs={12} sm={12} md={12}>
          <AITextField
            select
            // required
            fullWidth
            variant="outlined"
            margin="dense"
            name="tasklist"
            label="Task List"
            value={tasklist}
            onChange={(e) => updateFormData(e)}
          >
            {Object.entries(taskList).map((tasklist) => (
              <MenuItem key={tasklist[0]} value={tasklist[0]}>
                {tasklist[1]}
              </MenuItem>
            ))}
          </AITextField>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <FormControl margin="dense" variant="outlined" fullWidth>
            <InputLabel className={classes.inputLabel}>Assigned to</InputLabel>
            <Select
              multiple
              required
              fullWidth
              id="owner"
              name="owner"
              value={owner}
              onChange={(e) => updateFormData(e)}
              input={
                <OutlinedInput
                  label="Assigned to"
                  classes={{
                    root: classes.outlinedInputRoot,
                    focused: classes.focused,
                    notchedOutline: classes.notchedOutline,
                  }}
                />
              }
            >
              {Object.entries(userList).map((user) => (
                <MenuItem key={user[0]} value={user[0]}>
                  {user[0] == currentUser ? user[1] + " (Me)" : user[1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem>
          <FormControl style={{ marginLeft: 5 }}>
            <FormLabel
              classes={{
                root: classes.formLabelRoot,
                focused: classes.formLabelFocused,
              }}
            >
              Task Duration Type
            </FormLabel>
            <RadioGroup
              aria-label="duration_type"
              name="duration_type"
              value={durationType}
              onChange={handleDurationType}
              classes={{
                root: classes.formGroupRoot,
              }}
            >
              <FormControlLabel
                value="date_range"
                control={
                  <Radio
                    size="small"
                    classes={{
                      root: classes.radioRoot,
                      checked: classes.checked,
                    }}
                  />
                }
                label="Date Range"
                classes={{
                  label: classes.radioLabel,
                }}
              />
              <FormControlLabel
                value="duration"
                control={
                  <Radio
                    size="small"
                    classes={{
                      root: classes.radioRoot,
                      checked: classes.checked,
                    }}
                  />
                }
                label="Duration"
                classes={{
                  label: classes.radioLabel,
                }}
              />
            </RadioGroup>
          </FormControl>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <GridItem xs={12} sm={5} md={5}>
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
          {durationType == "date_range" ? (
            <GridItem xs={12} sm={5} md={5}>
              <FormControl classes={{ root: classes.formControlRoot }}>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="dense"
                  id="due_date"
                  label="End Date"
                  value={due_date ? due_date : null}
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
          ) : (
            <React.Fragment>
              <GridItem xs={7} sm={4} md={4}>
                <AITextField
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  label="Duration"
                  id="duration"
                  name="duration"
                  value={duration}
                  onChange={(e) => updateFormData(e)}
                />
              </GridItem>
              <GridItem xs={5} sm={3} md={3} classes={{ item: classes.item }}>
                <AITextField
                  select
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  name="duration_unit"
                  value={duration_unit}
                  onChange={(e) => updateFormData(e)}
                >
                  <MenuItem key="day" value="day(s)">
                    day(s)
                  </MenuItem>
                  <MenuItem key="hour" value="hour(s)">
                    hour(s)
                  </MenuItem>
                </AITextField>
              </GridItem>
            </React.Fragment>
          )}
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
  );

  const SubTaskForm = (
    <Dialog
      open={state.formOpen}
      onClose={handleFormClose}
      fullScreen={window.innerWidth > 480 ? false : true}
      fullWidth
    >
      {state.loading && <LinearProgress />}
      {window.innerWidth > 480 ? (
        <DialogTitle className={classes.dialogTitle}>Add SubTask</DialogTitle>
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
              Add SubTask
            </Typography>
            <Button autoFocus color="inherit" onClick={(e) => handleSubmit(e)}>
              Add
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        {TaskForm}
      </DialogContent>
    </Dialog>
  );

  return state.formOption == "add subtask" ? SubTaskForm : TaskForm;
});

export default TaskForm;
