import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Swal from "sweetalert2";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import DialogActions from "@material-ui/core/DialogActions";
import MenuItem from "@material-ui/core/MenuItem";
//core components
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { AITextField } from "components/AIComponents/AIComponents";
//assets
import styles from "assets/jss/ai-zoho/views/tasklistStyle";
import { themeColor } from "assets/jss/material-dashboard-react";
//services
import * as TASKLIST from "../../services/tasklist";
import * as PROJECT from "../../services/project";
import * as MILESTONE from "../../services/milestone";
//global hooks-store
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);

const TaskListForm = forwardRef((props, ref) => {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [milestoneList, setMilestoneList] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    id: props.tasklistID,
    name: "",
    project: props.projectID ? props.projectID : "",
    milestone: "",
  });

  const { name, project, milestone } = formData;
  const tasklistID = props.tasklistID;

  function fetchProjectList() {
    PROJECT.getSimpleProjectList().then((res) => {
      if (res.status == "success") {
        setProjectList(res.data);
      }
    });
  }

  function fetchMilestoneList() {
    MILESTONE.getSimpleMilestoneList().then((res) => {
      if (res.status == "success") {
        setMilestoneList(res.data);
      }
    });
  }

  function fetchTaskList() {
    dispatch("SET_LOADING", true);
    setLoading(true);
    TASKLIST.getTaskList(tasklistID)
      .then((res) => {
        if (res.status == "success") {
          setFormData({
            ...formData,
            ["name"]: res.data.name,
            ["project"]: res.data.project_id,
            ["milestone"]: res.data.milestone_id,
          });
        }
        dispatch("SET_LOADING", false);
        setLoading(false);
      })
      .catch((err) => {
        dispatch("SET_LOADING", false);
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
    fetchMilestoneList();
    if (props.formAction === "edit") {
      fetchTaskList();
    }
  }, []);

  const updateFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTaskList = (newFormData) => {
    TASKLIST.addTaskList(newFormData)
      .then((res) => {
        if (res.status == "success") {
          dispatch("SET_LOADING", false);
          handleFormClose();
          props.fetchTasklistList();
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

  const updateTaskList = (newFormData) => {
    TASKLIST.updateTaskList(newFormData)
      .then((res) => {
        if (res.status == "success") {
          dispatch("SET_LOADING", false);
          handleFormClose();
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

  useImperativeHandle(ref, () => ({
    submitForm(e) {
      handleSubmit(e);
    },
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    let newFormData = formData;
    newFormData = {
      ...newFormData,
    };

    dispatch("SET_LOADING", true);
    setError(false);
    if (props.formAction === "add") {
      addTaskList(newFormData);
    } else if (props.formAction === "edit") {
      updateTaskList(newFormData);
    }
  };

  const handleFormClose = () => {
    dispatch("SET_FORM_OPEN", false);
  };

  const TasklistForm = (
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
            required
            fullWidth
            variant="outlined"
            margin="dense"
            name="milestone"
            label="Milestone"
            value={milestone}
            onChange={(e) => updateFormData(e)}
          >
            {Object.entries(milestoneList).map((milestone) => (
              <MenuItem key={milestone[0]} value={milestone[0]}>
                {milestone[1]}
              </MenuItem>
            ))}
          </AITextField>
        </GridItem>
      </GridContainer>
      {window.innerWidth > 480 ? (
        <DialogActions className={classes.dialogActions}>
          <GridContainer justify="flex-end">
            <GridItem xs>
              <Button style={{ float: "right" }} onClick={handleFormClose}>
                Cancel
              </Button>
            </GridItem>
            <GridItem
              xs
              classes={{
                item: classes.item,
              }}
            >
              <Button type="submit" style={{ backgroundColor: themeColor }}>
                {props.formAction === "add" ? "Add" : "Update"}
              </Button>
            </GridItem>
          </GridContainer>
        </DialogActions>
      ) : null}
    </form>
  );

  return TasklistForm;
});

export default TaskListForm;
