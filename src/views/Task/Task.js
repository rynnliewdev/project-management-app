import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import { format, isValid } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Swal from "sweetalert2";
//@material-ui/core
import { makeStyles, Snackbar, TablePagination } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
//@material-ui/pickers
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
//@material-ui/lab
import Alert from "@material-ui/lab/Alert";
//@material-ui/icons
import AddIcon from "@material-ui/icons/Add";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
//core components
import { AIButton } from "components/AIComponents/AIComponents";
import { AIAlert } from "components/AIComponents/AIComponents";
import { AITextField } from "components/AIComponents/AIComponents";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
//assets
import { themeColor } from "assets/jss/material-dashboard-react";
import { successColor } from "assets/jss/material-dashboard-react";
import { blackColor } from "assets/jss/material-dashboard-react";
import { grayColor } from "assets/jss/material-dashboard-react";
//services
import * as TASK from "services/task";
//views
import TaskListForm from "../TaskList/tasklistForm";
import TaskForm from "./taskForm";
import ProjectForm from "../Project/projectForm";
import TaskOrTaskListForm from "../Task/taskOrTasklistForm";
import MilestoneForm from "views/Milestone/milestoneForm";
import styles from "assets/jss/ai-zoho/views/taskStyle";
//global hooks-store
import { useStore } from "../../hooks-store/store";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles(styles);

export default function Task(props) {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [task, setTask] = useState("");
  const [subTaskList, setSubTaskList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertCard, setAlertCard] = useState(false);
  const [checkedTask, setCheckedTask] = useState([0]);
  const [checkedTaskData, setCheckedTaskData] = useState([]);
  const [route, setRoute] = useState({});
  const [pagination, setPagination] = useState([]);
  const [pageArr, setPageArr] = useState([]);
  const [taskLinkArr, setTaskLinkArr] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    props.location.state && props.location.state.currentPage
      ? props.location.state.currentPage
      : 1
  );
  const matchProject = matchPath(props.location.pathname, {
    path: "/project/:id",
  });
  const matchMilestone = matchPath(props.location.pathname, {
    path: "/project/:id/milestone/:id",
  });
  const projectID = matchProject ? matchProject.params.id : null;
  const milestoneID = matchMilestone ? matchMilestone.params.id : null;
  const milestoneName =
    props.location.state && props.location.state.milestone_name
      ? props.location.state.milestone_name
      : null;
  const [formData, setFormData] = useState({
    id: props.match.params.id,
    name: "",
    description: "",
    project: "",
    tasklist: "",
    parent_task: "",
    owner: [],
    start_date: null,
    due_date: null,
    duration: "",
    duration_unit: "",
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
    completion,
    status,
  } = formData;

  const taskID = props.match.params.id;
  const formDataRef = useRef(null);
  const checkedTaskRef = useRef(null);

  function fetchTask() {
    TASK.getTask(taskID)
      .then((res) => {
        if (res.status == "success") {
          setTask(res.data);
          setTaskLinkArr([...taskLinkArr, [res.data.id, res.data.name]]);
          setFormData({
            ...formData,
            ["name"]: res.data.name,
            ["description"]: res.data.description,
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
          setLoading(false);
        }
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
              props.history.replace(`/project/${projectID}/tasklist/${taskID}`);
            });
          }
        }
      });
  }

  function fetchSubTaskList() {
    let params = {};
    params.parent_task = taskID;
    TASK.getUngroupedTask(params)
      .then((res) => {
        console.log(res);
        if (res.status == "success") {
          setSubTaskList(res.data);
        }
      })
      .catch((err) => {});
  }

  function fetchTaskStatusList() {
    TASK.getTaskStatusList().then((res) => {
      setStatusList(res.data);
    });
  }

  useEffect(() => {
    fetchTask();
    fetchSubTaskList();
    fetchTaskStatusList();
  }, [currentPage, taskID]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
    setTimeout(() => {
      document.getElementById("subtask").scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }, 500);
  };

  const handleTaskLink = (taskLink) => {
    setTaskLinkArr(
      taskLinkArr.filter((taskData) =>
        taskLink !== taskLinkArr[taskLinkArr.length - 1]
          ? taskLinkArr.indexOf(taskData) < taskLinkArr.indexOf(taskLink)
          : taskLinkArr.indexOf(taskData) <= taskLinkArr.indexOf(taskLink)
      )
    );
  };

  const handleCheckTask = (e, task) => {
    e.stopPropagation();
    const currentIndex = checkedTask.indexOf(task);
    const newCheckedTask = [...checkedTask];

    if (currentIndex === -1 && task.completion !== 100) {
      newCheckedTask.push(task);
    } else {
      newCheckedTask.splice(currentIndex, 1);
    }

    setCheckedTask(newCheckedTask);
    setCheckedTaskData(task);
    checkedTaskRef.current = 1;
  };

  const updateCompletion = (checkedTaskData) => {
    let updateData = {
      id: checkedTaskData.id,
      name: checkedTaskData.name,
      project: checkedTaskData.project_id,
      tasklist: checkedTaskData.task_list_id,
      completion: checkedTask.indexOf(checkedTaskData) !== -1 ? 100 : 0,
      status: checkedTask.indexOf(checkedTaskData) !== -1 ? 3 : 1,
      description: checkedTaskData.description,
      parent_task: checkedTaskData.parent_id,
      owner: checkedTaskData.owner_id,
      start_date: checkedTaskData.start_date,
      due_date: checkedTaskData.due_date,
      duration: checkedTaskData.duration,
      duration_unit: checkedTaskData.duration_type,
    };

    TASK.updateTask(updateData).then((res) => {
      if (res.status == "success") {
        fetchSubTaskList();
        if (res.data.id === task.id) {
          setFormData({
            ...formData,
            ["completion"]: res.data.completion,
            ["status"]: res.data.status,
          });
          setAlertCard(true);
          setTimeout(() => {
            setAlertCard(false);
          }, 2000);
        }
      }
    });
  };

  useEffect(() => {
    if (checkedTaskRef.current === 1) {
      updateCompletion(checkedTaskData);
    }
  }, [checkedTask]);

  const handleStartDateChange = (date) => {
    setFormData({ ...formData, ["start_date"]: date });
    formDataRef.current = 1;
  };
  const handleEndDateChange = (date) => {
    setFormData({ ...formData, ["due_date"]: date });
    formDataRef.current = 1;
  };

  const updateFormData = (e, completion) => {
    if (completion) {
      setFormData({
        ...formData,
        ["completion"]: completion,
        ["status"]: completion == 100 ? 3 : 1,
      });
      formDataRef.current = 1;
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
      formDataRef.current = 1;
    }
  };

  useEffect(() => {
    if (formDataRef.current === 1) {
      handleSubmit();
    }
  }, [start_date, due_date, completion, status]);

  const handleSubmit = () => {
    let updateData = formData;
    updateData = {
      ...updateData,
      ["start_date"]: isValid(start_date)
        ? format(start_date, "yyyy-MM-dd")
        : start_date,
      ["due_date"]: isValid(due_date)
        ? format(due_date, "yyyy-MM-dd")
        : due_date,
      name: task.name,
      project: task.project_id,
      tasklist: task.task_list_id,
    };
    // setLoading(true);
    TASK.updateTask(updateData)
      .then((res) => {
        if (res.status == "success") {
          if (res.data.completion == 100) {
            fetchSubTaskList();
          }
          setAlertCard(true);
          setTimeout(() => {
            setAlertCard(false);
          }, 2000);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.status === "forbidden") {
        }
      });
  };

  const routeTo = (action, id) => {
    setRoute({
      action: action,
      id: id,
    });
  };

  const paramPass = {
    page: currentPage,
    milestone_id: milestoneID,
    milestone_name: milestoneName,
  };

  useEffect(() => {
    if (route.action == "view") {
      props.history.replace({
        pathname: milestoneID
          ? `/project/${task.project_id}/milestone/${milestoneID}/tasklist/${task.task_list_id}/${route.id}`
          : `/project/${task.project_id}/tasklist/${task.task_list_id}/${route.id}`,
        state: paramPass,
      });
    }
  }, [route]);

  const handleFormOpen = (option) => {
    dispatch("SET_FORM_OPEN", true);
    dispatch("SET_FORM_OPTION", option);
  };

  const actionForm =
    state.formOption == "edit task or tasklist" ? (
      <TaskOrTaskListForm
        formAction="edit"
        taskFormOption="task"
        projectID={task.project_id}
        tasklistID={task.task_list_id}
        taskID={task.id}
        setAlert={setAlert}
        setAlertMsg={setAlertMsg}
        fetchTask={fetchTask}
        {...props}
      />
    ) : state.formOption == "add subtask" ? (
      <TaskForm
        formAction="add"
        projectID={task.project_id}
        tasklistID={task.task_list_id}
        taskID={task.id}
        setAlert={setAlert}
        setAlertMsg={setAlertMsg}
        fetchTaskList={fetchSubTaskList}
        {...props}
      />) : state.formOption == "edit project" ? (
        <ProjectForm
          formAction="edit"
          projectID={projectID}
          setAlert={setAlert}
          setAlertMsg={setAlertMsg}
          {...props}
        />
      ) : null;

  const tasklistLink = (
    <div className={classes.link}>
      <Link
        to={{
          pathname: milestoneID
            ? `/project/${task.project_id}/milestone/${milestoneID}/tasklist`
            : `/project/${task.project_id}/tasklist`,
          state: paramPass,
        }}
        className={classes.link}
      >
        <ArrowBackIcon />
        <Typography style={{ marginLeft: 10, fontSize: 20 }}>
          {task.task_list_name}
        </Typography>
      </Link>
      {/* <IconButton
        size="small"
        className={classes.editBtn}
        classes={{
          root: classes.editBtnRoot,
        }}
        onClick={() => handleFormOpen("edit tasklist")}
      >
        <EditIcon style={{ fontSize: 20 }} />
      </IconButton> */}
    </div>
  );

  const breadcrumbLink = (
    <Breadcrumbs
      style={{ paddingLeft: 5 }}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {taskLinkArr.map((taskLink) => (
        <Link
          key={taskLink[0]}
          onClick={() => handleTaskLink(taskLink)}
          to={
            milestoneID
              ? `/project/${
                  task.project_id
                }/milestone/${milestoneID}/tasklist/${task.task_list_id}/${
                  taskLink[0]
                }`
              : `/project/${task.project_id}/tasklist/${task.task_list_id}/${
                  taskLink[0]
                }`
          }
          className={classes.breadcrumbLink}
          style={{
            color:
              taskLink === taskLinkArr[taskLinkArr.length - 1]
                ? themeColor
                : null,
          }}
        >
          {taskLink[1]}
        </Link>
      ))}
    </Breadcrumbs>
  );

  const TaskDetails = (
    <GridContainer
      direction="column"
      classes={{
        container: classes.container,
      }}
    >
      <Card className={classes.taskCard}>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <FormControlLabel
            onClick={(e) =>
              handleFormOpen("edit task or tasklist", e.preventDefault())
            }
            label={
              <Typography variant="body1" className={classes.taskTitle}>
                {task.name}
              </Typography>
            }
            control={
              <Checkbox
                name="parentTask"
                edge="start"
                onClick={(e) => handleCheckTask(e, task)}
                checked={checkedTask.indexOf(task) !== -1 || completion == 100}
                disableRipple
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
              />
            }
            style={{ marginLeft: 0 }}
          ></FormControlLabel>
          <Button
            startIcon={<EditIcon style={{ fontSize: 16 }} />}
            className={classes.editTaskBtn}
            onClick={() => handleFormOpen("edit task or tasklist")}
          >
            Edit
          </Button>
        </div>
        <GridContainer>
          <GridItem xs={12} sm={10} md={8}>
            <AITextField
              select
              required
              fullWidth
              name="status"
              label="Status"
              value={status}
              onChange={(e) => updateFormData(e)}
              InputProps={{
                classes: {
                  input:
                    status == 1
                      ? classes.openColor
                      : status == 2
                      ? classes.startedColor
                      : classes.closedColor,
                },
              }}
            >
              {Object.entries(statusList).map((status) => (
                <MenuItem
                  key={status[0]}
                  value={status[0]}
                  style={{
                    color:
                      status[0] == 1
                        ? successColor[0]
                        : status[0] == 2
                        ? blackColor
                        : grayColor[3],
                  }}
                >
                  {status[1]}
                </MenuItem>
              ))}
            </AITextField>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <GridItem xs={6} sm={5} md={4}>
              <FormControl classes={{ root: classes.formControlRoot }}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  id="start_date"
                  label="Start Date"
                  value={start_date}
                  onChange={handleStartDateChange}
                  TextFieldComponent={AITextField}
                  KeyboardButtonProps={{
                    "aria-label": "change start date",
                  }}
                />
              </FormControl>
            </GridItem>
            {task.duration && task.due_date == null ? (
              <React.Fragment>
                <GridItem xs={4} sm={3} md={2}>
                  <AITextField
                    required
                    fullWidth
                    label="Duration"
                    id="duration"
                    name="duration"
                    value={duration}
                    onChange={(e) => updateFormData(e)}
                  />
                </GridItem>
                <GridItem xs={2} sm={2} md={2}>
                  <AITextField
                    select
                    required
                    fullWidth
                    margin="normal"
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
            ) : (
              <GridItem xs={6} sm={5} md={4}>
                <FormControl classes={{ root: classes.formControlRoot }}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="due_date"
                    label="Due Date"
                    value={due_date}
                    onChange={handleEndDateChange}
                    TextFieldComponent={AITextField}
                    minDate={start_date}
                  />
                </FormControl>
              </GridItem>
            )}
          </MuiPickersUtilsProvider>
        </GridContainer>
        <GridContainer alignItems="flex-end">
          <GridItem xs={12} sm={10} md={8}>
            <Typography
              variant="caption"
              style={{ color: grayColor[2] }}
              gutterBottom
            >
              % Completed
            </Typography>
            <Slider
              value={completion}
              valueLabelDisplay="on"
              step={10}
              marks
              min={0}
              max={100}
              onChange={(e, completionVal) => updateFormData(e, completionVal)}
              classes={{
                root: classes.sliderRoot,
                valueLabel: classes.valueLabel,
              }}
            />
          </GridItem>
          {alertCard && (
            <GridItem xs={12} sm={12} md={12}>
              <Alert severity="success">Task updated successfully.</Alert>
            </GridItem>
          )}
        </GridContainer>
      </Card>
    </GridContainer>
  );

  const SubTaskList = (
    <GridContainer
      direction="column"
      classes={{
        container: classes.container,
      }}
    >
      <div className={classes.subTaskHeader}>
        <GridItem xs={6}>
          <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
            SubTask
          </Typography>
        </GridItem>
        <GridItem xs={6}>
          <AIButton
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            className={classes.addBtn}
            onClick={() => handleFormOpen("add subtask")}
          >
            Add
          </AIButton>
        </GridItem>
      </div>
      <Card className={classes.subTaskList}>
        {subTaskList.map((subTask) =>
           (
            <div key={subTask.id}>
              <ListItem
                className={classes.listItem}
                dense
                onClick={(e) => routeTo("view", subTask.id, e.preventDefault())}
              >
                <FormControlLabel
                  label={
                    <div style={{ lineHeight: 0 }}>
                      <Typography variant="body2" style={{ color: "#208aed" }}>
                        {subTask.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        style={{
                          color:
                            subTask.status == 1
                              ? successColor[0]
                              : task.status == 2
                              ? blackColor
                              : grayColor[3],
                        }}
                      >
                        {subTask.status_name}
                      </Typography>
                    </div>
                  }
                  control={
                    <Checkbox
                      name="childrenTask"
                      edge="start"
                      onClick={(e) => handleCheckTask(e, subTask)}
                      checked={
                        checkedTask.indexOf(subTask) !== -1 ||
                        subTask.completion == 100
                      }
                      disableRipple
                      classes={{
                        root: classes.root,
                        checked: classes.checked,
                      }}
                      style={{ marginLeft: 0 }}
                    />
                  }
                  style={{ flex: 1 }}
                ></FormControlLabel>
                <Typography variant="caption" style={{ float: "right" }}>
                  {subTask.completion} %
                </Typography>
              </ListItem>
              <Divider variant="middle" light />
            </div>
          ))
        }
        {/* {subTaskList ? (
          <TablePagination
            component="div"
            count={pagination.total}
            page={currentPage - 1}
            onChangePage={handleChangePage}
            rowsPerPage={10}
            rowsPerPageOptions={[]}
          />
        ) : null} */}
      </Card>
    </GridContainer>
  );

  const snackBarAlert = (
    <Snackbar
      open={alert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <AIAlert severity="success" variant="outlined">
        {alertMsg}
      </AIAlert>
    </Snackbar>
  );

  return loading ? null : (
    <div className={classes.content}>
      {tasklistLink}
      {TaskDetails}
      {SubTaskList}
      {actionForm}
      {snackBarAlert}
    </div>
  );
}
