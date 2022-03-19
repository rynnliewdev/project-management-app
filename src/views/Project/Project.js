import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
//@material-ui/lab
import Pagination from "@material-ui/lab/Pagination";
//core components
import GridContainer from "components/Grid/GridContainer";
import { AIButton } from "components/AIComponents/AIComponents";
import { AIAlert } from "components/AIComponents/AIComponents";
//icons
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
//assets
import { grayColor } from "../../assets/jss/material-dashboard-react.js";
import { successColor } from "../../assets/jss/material-dashboard-react.js";
import styles from "assets/jss/ai-zoho/views/projectStyle";
//views
import ProjectForm from "./projectForm";
//services
import * as PROJECT from "../../services/project";
//global hooks-store
import { useStore } from "../../hooks-store/store";
import NotFound from "layouts/notFound.js";

const useStyles = makeStyles(styles);

export default function Project(props) {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [route, setRoute] = useState({});
  const [pagination, setPagination] = useState([]);
  const [pageArr, setPageArr] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    props.location.state && props.location.state.currentPage
      ? props.location.state.currentPage
      : 1
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const formActionRef = useRef();

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const updateWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  function fetchProjectList() {
    dispatch("SET_LOADING", true);
    PROJECT.getFullProjectList(currentPage).then((res) => {
      if (res.status == "success") {
        let page = [];
        for (let i = 0; i < res.pagination.last_page; i++) {
          page.push(i + 1);
        }
        setPageArr(page);
        setPagination(res.pagination);
        setProjectList(res.data);
        setLoading(false);
        dispatch("SET_LOADING", false);
      }
    });
  }

  useEffect(() => {
    fetchProjectList();
    localStorage.removeItem("projectTitle");
  }, [currentPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      document.getElementById("content").scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }, 500);
  };

  const routeTo = (action, project) => {
    setRoute({
      action: action,
      id: project.id,
      project_title: project.title,
    });
  };

  const paramPass = {
    page: currentPage,
  };

  if (route.action == "view") {
    localStorage.setItem("projectTitle", route.project_title);
    return (
      <Redirect
        to={{
          pathname: `project/${route.id}/tasklist`,
          state: paramPass,
        }}
      />
    );
  }

  const addProjectForm = (
    <ProjectForm
      formAction="add"
      fetchProjectList={fetchProjectList}
      setAlert={setAlert}
      setAlertMsg={setAlertMsg}
      {...props}
    />
  );

  const ProjectList = (
    <GridContainer direction="column">
      {projectList.map((project) => (
        <div key={project.id}>
          <ListItem
            className={classes.listItem}
            onClick={() => routeTo("view", project)}
          >
            <ListItemText
              primary={project.title}
              secondary={
                <Typography
                  variant="body2"
                  style={{
                    color: project.status == 1 ? successColor[0] : grayColor[3],
                  }}
                >
                  {project.status_name}
                </Typography>
              }
            ></ListItemText>
            <ArrowForwardIosIcon
              fontSize="small"
              style={{ float: "right", color: grayColor[3] }}
            />
          </ListItem>
        </div>
      ))}
   
    </GridContainer>
  );

  const paginationItem =
    projectList.length > 0 ? (
      <Pagination
        count={pagination.last_page}
        page={currentPage}
        onChange={handleChangePage}
        classes={{
          ul: classes.pagination,
        }}
      />
    )  : (
      loading || <NotFound message="No Project Found" />
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

  return (
    <div
      id="content"
      style={{ margin: windowWidth > 480 ? "100px 30px" : "90px 0px" }}
    >
      {ProjectList}
      {paginationItem}
      {addProjectForm}
      {snackBarAlert}
    </div>
  );
}
