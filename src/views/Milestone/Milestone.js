import React, { useState, useEffect, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
//@material-ui/core
import { makeStyles, Breadcrumbs } from "@material-ui/core";
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
import AddIcon from "@material-ui/icons/Add";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CloseIcon from "@material-ui/icons/Close";
//assets
import { themeColor } from "../../assets/jss/material-dashboard-react.js";
import { grayColor } from "../../assets/jss/material-dashboard-react.js";
import { successColor } from "../../assets/jss/material-dashboard-react.js";
import { whiteColor } from "../../assets/jss/material-dashboard-react.js";
import styles from "assets/jss/ai-zoho/views/milestoneStyle";
//services
import * as MILESTONE from "../../services/milestone";
//views
import MilestoneForm from "./milestoneForm";
import NotFound from "layouts/notFound";
//global hooks-store
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);

export default function Milestone(props) {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [milestoneList, setMilestoneList] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const projectID = props.match.params.id;

  function fetchMilestoneList() {
    let params = {};
    params.project = projectID;
    MILESTONE.getFullMilestoneList(currentPage, params).then((res) => {
      if (res.status == "success") {
        let page = [];
        for (let i = 0; i < res.pagination.last_page; i++) {
          page.push(i + 1);
        }
        setPageArr(page);
        setPagination(res.pagination);
        setMilestoneList(res.data);
        // setLoading(false);
      }
    });
  }

  useEffect(() => {
    fetchMilestoneList();
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

  const routeTo = (action, milestone) => {
    setRoute({
      action: action,
      id: milestone.id,
      milestone_name: milestone.name,
    });
  };

  const paramPass = {
    page: currentPage,
    milestone_name: route.milestone_name,
  };

  if (route.action == "view") {
    return (
      <Redirect
        to={{
          pathname: `${props.match.url}/${route.id}/tasklist`,
          state: paramPass,
        }}
      />
    );
  }

  const handleFormOpen = (option) => {
    dispatch("SET_FORM_OPEN", true);
    dispatch("SET_FORM_OPTION", option);
  };

  const actionButton = (
    <div>
      <div className={classes.snackBtnGroup}>
        <AIButton
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleFormOpen("add milestone")}
        >
          Milestone
        </AIButton>
        {/* <AIButton
            variant="outlined"
            size="small"
            className={classes.filterBtn}
            onClick={() => setFilterDrawer(true)}
          >
            <FilterIcon />
          </AIButton> */}
      </div>
    </div>
  );

  const breadcrumbLink = (
    <Breadcrumbs
      style={{ paddingLeft: 5 }}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link to="/project" className={classes.breadcrumbLink}>
        <ArrowBackIcon style={{ paddingRight: 10, fontSize: 20 }} />
        Projects
      </Link>
      <Typography style={{ color: themeColor }}>Milestone</Typography>
    </Breadcrumbs>
  );

  const addMilestoneForm = state.formOption == "add milestone" && (
    <MilestoneForm
      formAction="add"
      projectID={projectID}
      fetchMilestoneList={fetchMilestoneList}
      setAlert={setAlert}
      setAlertMsg={setAlertMsg}
      {...props}
    />
  );

  const MilestoneList = (
    <GridContainer
      direction="column"
      classes={{
        container: classes.container,
      }}
    >
      {milestoneList.map((milestone) => (
        <div key={milestone.id}>
          <ListItem
            className={classes.listItem}
            onClick={() => routeTo("view", milestone)}
          >
            <ListItemText
              primary={milestone.name}
              secondary={
                <Typography
                  variant="body2"
                  style={{
                    color:
                      milestone.status == 1 ? successColor[0] : grayColor[3],
                  }}
                >
                  {milestone.status_name}
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
    milestoneList.length > 0 ? (
      <Pagination
        count={pagination.last_page}
        page={currentPage}
        onChange={handleChangePage}
        classes={{
          ul: classes.pagination,
        }}
      />
    ) : (
      state.loading || <NotFound message="No Milestone Found" />
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
    <div id="content" style={{ paddingTop: 30 }}>
      {actionButton}
      {breadcrumbLink}
      {MilestoneList}
      {paginationItem}
      {addMilestoneForm}
      {snackBarAlert}
    </div>
  );
}
