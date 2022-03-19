import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  matchPath,
  Link,
} from "react-router-dom";
//@material-ui/core
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  ExpansionPanelSummary,
  FormControlLabel,
  Divider,
  Breadcrumbs,
} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "components/CustomButtons/Button";
//material-ui/lab
//services
import * as TASKLIST from "services/tasklist";
import * as TASK from "services/task";
import { successColor } from "assets/jss/material-dashboard-react";
//assets
import Task from "views/Task/Task";
//icons
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { blackColor } from "assets/jss/material-dashboard-react";
import Pagination from "@material-ui/lab/Pagination";
import { themeColor } from "assets/jss/material-dashboard-react";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  root: {
    "&$checked": {
      color: successColor[1],
    },
  },
  checked: {},
  listItem: {},
  expansionPanel: {
    margin: "3px 0",
    padding: "0 20px",
    // "&.MuiPaper": {
    //     boxShadow: "none",
    // }
  },
  panelDetails: {
    padding: "3px 30px",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingLeft: 40,
    paddingRight: 30,
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
  link: {
    color: "#808080",
    "&:hover": {
      color: "#000",
    },
  },
  checkBoxIcon: {
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',

  }
});

function TaskListItem(props) {
  const classes = useStyles();
  const [taskLists, setTaskLists] = useState([]);
  const [checkedTask, setCheckedTask] = useState([0]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setExpanded] = useState(true);
  const [route, setRoute] = useState({});
  const [pagination, setPagination] = useState([]);
  const [pageArr, setPageArr] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    props.location.state && props.location.state.currentPage
      ? props.location.state.currentPage
      : 1
  );
  const projectTitle =
    props.location.state && props.location.state.project_title
      ? props.location.state.project_title
      : null;
  const projectID = props.match.params.id;

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      document.getElementById("list").scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }, 500);
  };

  function fetchTaskList() {
    setLoading(true);
    let params = {};
    params.project = projectID;
    // if (props.location.state) {
    //   params.project = props.location.state.project;
    //   props.location.state.project = null;
    // }

    TASKLIST.getAllTaskList(currentPage, params)
      .then((res) => {
        if (res.status == "success") {
          let page = [];
          for (let i = 0; i < res.pagination.last_page; i++) {
            page.push(i + 1);
          }
          setPageArr(page);
          setPagination(res.pagination);
          setTaskLists(res.data);
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
              title: "Opps",
              text: "Page Not Found",
            }).then(() => {
              props.history.replace("/user");
            });
          }
        }
      });
  }

  useEffect(() => {
    fetchTaskList();
  }, [currentPage]);

  const handleExpandTask = () => {
    setExpanded(!isExpanded);
  };
  
  const handleCheckTask = (e, task) => {
    const currentIndex = checkedTask.indexOf(task);
    const newCheckedTask = [...checkedTask];

    if (currentIndex === -1) {
      newCheckedTask.push(task);
    } else {
      newCheckedTask.splice(currentIndex, 1);
    }

    setCheckedTask(newCheckedTask);
  };

  const routeTo = (action, id, project_id) => {
    setRoute({ action: action, id: id, project_id: project_id });
  };

  const paramPass = {
    page: currentPage,
    project_id: route.project_id,
    project_title: projectTitle,
    // path: props.location.pathname,
  };

  if (route.action == "add") {
    return (
      <Redirect
        to={{
          pathname: "/task/add",
          //   state: paramPass,
        }}
      />
    );
  } else if (route.action == "view") {
    return (
      <Redirect
        to={{
          pathname:
            props.match.url !== "/my-task"
              ? props.match.url + "/task/" + route.id
              : "/my-task/" + route.id,
          state: paramPass,
        }}
      />
    );
  }

  return (
    <div>
      <List id="list">
        {taskLists.map((tasklist) => (
          <div key={tasklist.id}>
            <ExpansionPanel expanded={isExpanded} style={{ boxShadow: "none" }}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                onClick={handleExpandTask}
                className={classes.expansionPanel}
                classes={{
                  root: classes.panelRoot,
                  content: classes.panelContent,
                }}
              >
                {/* <ListItem className={classes.listItem}>
                  <ListItemText primary={tasklist.name} />
                </ListItem> */}
                <Typography variant="subtitle2">{tasklist.name}</Typography>
              </ExpansionPanelSummary>

              {tasklist.task.map((task) => (
                <div key={task.id}>
                  <ExpansionPanelDetails
                    onClick={() =>
                      routeTo("view", task.id, tasklist.project_id)
                    }
                    className={classes.panelDetails}
                  >
                    {/* <ListItem
                    className={classes.listItem}
                    key={task.id}
                    role={undefined}
                    dense
                    button
                    onClick={() =>
                      routeTo("view", task.id, tasklist.project_id)
                    }
                  > */}
                    {/* <ListItemIcon> */}
                    <FormControlLabel
                      label={
                        <Typography
                          variant="body2"
                          style={{ color: "#208aed" }}
                        >
                          {task.name}
                        </Typography>
                      }
                      control={
                        <Checkbox
                          edge="start"
                          onClick={(e) =>
                            handleCheckTask(e.stopPropagation(), task.id)
                          }
                          checked={checkedTask.indexOf(task.id) !== -1}
                          disableRipple
                          inputProps={{ "aria-labelledby": task.id }}
                          classes={{
                            root: classes.root,
                            checked: classes.checked,
                          }}
                        //   icon={<span className={classes.checkBoxIcon} />}
                        />
                      }
                      style={{ flex: 1 }}
                    ></FormControlLabel>

                    {/* </ListItemIcon> */}
                    {/* <ListItemText primary={task.name} /> */}
                    {/* <ListItemSecondaryAction> */}
                    <Typography style={{ float: "right" }}>
                      {task.completion} %
                    </Typography>
                    {/* </ListItemSecondaryAction> */}
                    {/* </ListItem> */}
                  </ExpansionPanelDetails>
                  <Divider />
                </div>
              ))}
            </ExpansionPanel>
          </div>
        ))}
      </List>
      {taskLists.length > 0 ? (
        <Pagination
          count={pagination.last_page}
          page={currentPage}
          onChange={handleChangePage}
          classes={{
            ul: classes.pagination,
          }}
        />
      ) : null}
    </div>
  );
}

export default withRouter(TaskListItem);
