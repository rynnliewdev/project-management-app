import React, { useState, useEffect, useRef } from "react";
import { Redirect, Link, matchPath } from "react-router-dom";
import Swal from "sweetalert2";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Popover from "@material-ui/core/Popover";
import Snackbar from "@material-ui/core/Snackbar";
//material-ui/lab
import Pagination from "@material-ui/lab/Pagination";
//@material-ui/icons
import AddIcon from "@material-ui/icons/Add";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import FlagIcon from "@material-ui/icons/Flag";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
//core components
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card/Card";
import GridItem from "components/Grid/GridItem";
import { AIButton } from "components/AIComponents/AIComponents";
import { AIAlert } from "components/AIComponents/AIComponents";
//assets
import { grayColor } from "assets/jss/material-dashboard-react";
import { themeColor } from "assets/jss/material-dashboard-react";
import { whiteColor } from "assets/jss/material-dashboard-react";
import { FilterIcon } from "../../assets/icons/svgIcon";
import { successColor } from "assets/jss/material-dashboard-react";
import { blackColor } from "assets/jss/material-dashboard-react";
import styles from "../../assets/jss/ai-zoho/views/tasklistStyle";
//services
import * as TASKLIST from "services/tasklist";
import * as TASK from "services/task";
import * as MILESTONE from "services/milestone";
//views
import TaskForm from "../Task/taskForm";
import ProjectForm from "../Project/projectForm";
import TaskOrTaskListForm from "../Task/taskOrTasklistForm";
import MilestoneForm from "views/Milestone/milestoneForm";
import TaskFilter from "../Task/taskFilter";
import NotFound from "layouts/notFound";
//global hooks-store
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);

export default function TaskList(props) {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [tasklistList, setTasklistList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [checkedTask, setCheckedTask] = useState([0]);
  const [checkedTaskData, setCheckedTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [onFilter, setOnFilter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState(["all"]);
  const [anchorBtn, setAnchorBtn] = useState(false);
  const [route, setRoute] = useState({});
  const [pagination, setPagination] = useState([]);
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
  const checkedTaskRef = useRef(null);
  const mountedRef = useRef(false);

  function fetchTasklistList() {
    let params = {};
    if (milestoneID) {
      params.milestone = milestoneID;
      params.project = projectID;
    } else {
      params.project = projectID;
    }
    TASKLIST.getFullTaskList(currentPage, params)
      .then((res) => {
        if (mountedRef.current) {
          setPagination(res.pagination);
          setTasklistList(res.data);
        }
      })
      .catch((err) => {
        if (err == "unauthorized") {
          props.history.replace("/login");
        }
      });
  }

  function fetchTaskList() {
    dispatch("SET_LOADING", true);
    let params = {};
    params.project = projectID;
    if (onFilter) {
      if (selectedStatus.indexOf("all") === -1) {
        params.status = selectedStatus.toString();
      }
    }
    TASK.getFullTask(null, params)
      .then((res) => {
        if (mountedRef.current) {
          setTaskList(res.data);
        }
        dispatch("SET_LOADING", false);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    mountedRef.current = true;
    fetchTasklistList();
    fetchTaskList();
    return function cleanup() {
      mountedRef.current = false;
    };
  }, [currentPage, route, milestoneID]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      document.getElementById("content").scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }, 500);
  };

  const handleCheckTask = (e, task) => {
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

  const updateCompletion = (task) => {
    let updateData = {
      id: task.id,
      name: task.name,
      project: task.project_id,
      tasklist: task.task_list_id,
      completion: checkedTask.indexOf(task) !== -1 ? 100 : 0,
      status: checkedTask.indexOf(task) !== -1 ? 3 : 1,
      description: task.description,
      parent_task: task.parent_id,
      owner: task.owner,
      start_date: task.start_date,
      duration: task.duration,
      duration_unit: task.duration_type,
    };
    TASK.updateTask(updateData)
      .then((res) => {
        if (res.status == "success") {
          fetchTaskList();
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (checkedTaskRef.current === 1) {
      updateCompletion(checkedTaskData);
    }
  }, [checkedTask]);

  const routeTo = (action, id, tasklist) => {
    setRoute({
      action: action,
      id: id,
      tasklist_id: tasklist.id,
      milestone_name: tasklist.milestone_name,
    });
  };

  const paramPass = {
    page: currentPage,
    tasklist_id: route.tasklist_id,
    milestone_name: route.milestone_name,
  };

  useEffect(() => {
    if (route.action == "view task") {
      props.history.replace({
        pathname: `${props.match.url}/${route.tasklist_id}/${route.id}`,
        state: paramPass,
      });
    } else if (route.action == "view milestone") {
      props.history.replace({
        pathname: `/project/${projectID}/milestone/${route.id}/tasklist`,
        state: paramPass,
      });
    }
  }, [route]);

  const handleToggleBtn = (e) => {
    setAnchorBtn(true);
  };

  const handleCloseBtn = () => {
    setAnchorBtn(false);
  };

  const handleFormOpen = (option) => {
    setAnchorBtn(false);
    dispatch("SET_FORM_OPEN", true);
    dispatch("SET_FORM_OPTION", option);
  };

  const actionForm =
    state.formOption == "add task or tasklist" ? (
      <TaskOrTaskListForm
        formAction="add"
        taskFormOption="tasklist"
        projectID={projectID}
        fetchTasklistList={fetchTasklistList}
        fetchTaskList={fetchTaskList}
        setAlert={setAlert}
        setAlertMsg={setAlertMsg}
        setOnFilter={setOnFilter}
        {...props}
      />
    ) : state.formOption == "add milestone" ? (
      <MilestoneForm
        formAction="add"
        projectID={projectID}
        setAlert={setAlert}
        setAlertMsg={setAlertMsg}
        {...props}
      />
    ) : state.formOption == "edit milestone" ? (
      <MilestoneForm
        formAction="edit"
        projectID={projectID}
        milestoneID={milestoneID}
        setAlert={setAlert}
        setAlertMsg={setAlertMsg}
        {...props}
      />
    ) : state.formOption == "edit project" ? (
      <ProjectForm
        formAction="edit"
        projectID={projectID}
        setAlert={setAlert}
        setAlertMsg={setAlertMsg}
        {...props}
      />
    ) : null;

  const milestoneLink = (
    <div className={classes.link}>
      <Link to={`/project/${projectID}/milestone`} className={classes.link}>
        <ArrowBackIcon />
        <Typography style={{ marginLeft: 10, fontSize: 20 }}>
          {milestoneName}
        </Typography>
      </Link>
      <IconButton
        size="small"
        className={classes.editBtn}
        classes={{
          root: classes.editBtnRoot,
        }}
        onClick={() => handleFormOpen("edit milestone")}
      >
        <EditIcon style={{ fontSize: 20 }} />
      </IconButton>
    </div>
  );

  const breadcrumbLink = (
    <Breadcrumbs
      style={{ paddingLeft: 5 }}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link
        to={milestoneID ? `/project/${projectID}/milestone` : "/project"}
        className={classes.breadcrumbLink}
      >
        <ArrowBackIcon style={{ paddingRight: 10, fontSize: 20 }} />
        {milestoneID ? "Milestone" : "Projects"}
      </Link>
      <Typography style={{ color: themeColor }}>Task List</Typography>
    </Breadcrumbs>
  );

  const actionButton = (
    <div>
      <Hidden xsDown implementation="css">
        <div className={classes.snackBtnGroup}>
          <AIButton
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleFormOpen("add task or tasklist")}
          >
            Task / Task List
          </AIButton>
          <AIButton
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleFormOpen("add milestone")}
          >
            Milestone
          </AIButton>
          <AIButton
            variant="outlined"
            size="small"
            className={classes.filterBtn}
            onClick={() => setFilterDrawer(true)}
          >
            <FilterIcon />
          </AIButton>
        </div>
      </Hidden>
      <Hidden smUp implementation="css">
        <div>
          <IconButton
            className={classes.addBtnCircle}
            onClick={handleToggleBtn}
          >
            <AddIcon style={{ color: whiteColor }} />
          </IconButton>
          <Popover
            open={anchorBtn}
            onClose={handleCloseBtn}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 500, left: 232 }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            classes={{
              paper: classes.paper,
            }}
          >
            <GridContainer direction="column" alignItems="flex-end">
              <GridContainer
                direction="row"
                alignItems="center"
                classes={{
                  root: classes.btnContainerRoot,
                }}
              >
                <Typography variant="subtitle2" className={classes.btnSmText}>
                  Add Task / Task List
                </Typography>
                <GridItem classes={{ item: classes.btnItemRoot }}>
                  <IconButton
                    className={classes.addBtnSm}
                    onClick={() => handleFormOpen("add task or tasklist")}
                  >
                    <AssignmentTurnedInIcon style={{ color: whiteColor }} />
                  </IconButton>
                </GridItem>
              </GridContainer>

              <GridContainer
                direction="row"
                alignItems="center"
                classes={{
                  root: classes.btnContainerRoot,
                }}
              >
                <Typography variant="subtitle2" className={classes.btnSmText}>
                  Add Milestone
                </Typography>
                <GridItem classes={{ item: classes.btnItemRoot }}>
                  <IconButton
                    className={classes.addBtnSm}
                    onClick={() => handleFormOpen("add milestone")}
                  >
                    <FlagIcon style={{ color: whiteColor }} />
                  </IconButton>
                </GridItem>
              </GridContainer>
            </GridContainer>
            <Dialog open style={{ zIndex: 2 }} />
          </Popover>
        </div>
        <div className={classes.snackBtnGroupSm}>
          <AIButton
            variant="outlined"
            size="small"
            className={classes.filterBtnSm}
            onClick={() => setFilterDrawer(true)}
          >
            <FilterIcon style={{ fontSize: 18 }} />
          </AIButton>
        </div>
      </Hidden>
    </div>
  );

  const TaskList = (
    <GridContainer
      direction="column"
      id="list"
      classes={{
        container: classes.container,
      }}
    >
      {tasklistList.map((tasklist) => (
        <Card key={tasklist.id} className={classes.taskCard}>
          <ExpansionPanel
            defaultExpanded={true}
            style={{ boxShadow: "none", borderRadius: 15 }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.expansionPanel}
              classes={{
                root: classes.panelRoot,
                content: classes.panelContent,
              }}
            >
              <Typography
                variant="subtitle2"
                style={{ paddingRight: 5, cursor: "auto" }}
              >
                {tasklist.name}
              </Typography>
              {milestoneID ? null : (
                <React.Fragment>
                  <Typography
                    variant="body2"
                    style={{
                      paddingRight: 5,
                      color: grayColor[3],
                      cursor: "auto",
                    }}
                  >
                    in
                  </Typography>
                  <Typography
                    onClick={(e) =>
                      routeTo(
                        "view milestone",
                        tasklist.milestone_id,
                        tasklist,
                        e.stopPropagation()
                      )
                    }
                    variant="body2"
                    className={classes.milestoneLink}
                  >
                    {tasklist.milestone_name}
                  </Typography>
                </React.Fragment>
              )}
            </ExpansionPanelSummary>

            {Object.entries(taskList).find((task) => task[0] == tasklist.id) !==
            undefined
              ? Object.entries(taskList)
                  .find((task) => task[0] == tasklist.id)[1]
                  .map((task) => (
                    <div key={task.id}>
                      <Divider variant="middle" light />
                      <ExpansionPanelDetails
                        onClick={() => routeTo("view task", task.id, tasklist)}
                        className={classes.panelDetails}
                      >
                        <FormControlLabel
                          label={
                            <div style={{ lineHeight: 0 }}>
                              <Typography
                                variant="body2"
                                style={{ color: "#208aed" }}
                              >
                                {task.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                style={{
                                  color:
                                    task.status == 1
                                      ? successColor[0]
                                      : task.status == 2
                                      ? blackColor
                                      : grayColor[3],
                                }}
                              >
                                {task.status_name}
                              </Typography>
                            </div>
                          }
                          control={
                            <Checkbox
                              edge="start"
                              onClick={(e) =>
                                handleCheckTask(e.stopPropagation(), task)
                              }
                              checked={
                                checkedTask.indexOf(task) !== -1 ||
                                task.completion == 100
                              }
                              disableRipple
                              classes={{
                                root: classes.root,
                                checked: classes.checked,
                              }}
                            />
                          }
                          style={{ flex: 1 }}
                        ></FormControlLabel>
                        <Typography
                          variant="caption"
                          style={{ float: "right" }}
                        >
                          {task.completion}%
                        </Typography>
                      </ExpansionPanelDetails>
                    </div>
                  ))
              : null}
          </ExpansionPanel>
        </Card>
      ))}
    </GridContainer>
  );

  const paginationItem =
    tasklistList.length > 0 ? (
      <Pagination
        count={pagination.last_page}
        page={currentPage}
        onChange={handleChangePage}
        classes={{
          ul: classes.pagination,
        }}
      />
    ) : (
      state.loading || <NotFound message="No Task List Found" />
    );

  const snackbarAlert = (
    <Snackbar
      open={alert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <AIAlert severity="success" variant="outlined">
        {alertMsg}
      </AIAlert>
    </Snackbar>
  );

  return (
    <div id="content" className={classes.content}>
      {milestoneID ? milestoneLink : breadcrumbLink}
      {actionButton}
      {TaskList}
      {paginationItem}
      {actionForm}
      <TaskFilter
        open={filterDrawer}
        setFilterDrawer={setFilterDrawer}
        onFilter={onFilter}
        setOnFilter={setOnFilter}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        fetchTaskList={fetchTaskList}
      />
      {snackbarAlert}
    </div>
  );
}
