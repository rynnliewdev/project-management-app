import React, { useState, useRef } from "react";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
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
import FormControl from "@material-ui/core/FormControl";
//@material-ui/icons
import CloseIcon from "@material-ui/icons/Close";
//core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { AITextField } from "components/AIComponents/AIComponents";
//views
import TaskForm from "./taskForm";
import TaskListForm from "views/TaskList/tasklistForm";
//assets
import { themeColor } from "assets/jss/material-dashboard-react";
import styles from "assets/jss/ai-zoho/views/taskStyle";
//global hooks-store
import { useStore } from "../../hooks-store/store";

const useStyles = makeStyles(styles);

export default function(props) {
  const classes = useStyles();
  const [state, dispatch] = useStore();
  const [loading, setLoading] = useState(false);
  const [taskFormOption, setTaskFormOption] = useState(props.taskFormOption);
  const formActionRef = useRef();

  const handleTaskFormOption = (e) => {
    setTaskFormOption(e.target.value);
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
      {state.loading && <LinearProgress />}
      {window.innerWidth > 480 ? (
        <DialogTitle className={classes.dialogTitle}>
          {props.formAction == "add"
            ? taskFormOption == "tasklist"
              ? "Add Task List"
              : "Add Task"
            : props.formAction == "edit"
            ? taskFormOption == "tasklist"
              ? "Edit Task List"
              : "Edit Task"
            : null}
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
              {props.formAction == "add"
                ? taskFormOption == "tasklist"
                  ? "Add Task List"
                  : "Add Task"
                : props.formAction == "edit"
                ? taskFormOption == "tasklist"
                  ? "Edit Task List"
                  : "Edit Task"
                : null}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={(e) => formActionRef.current.submitForm(e)}
            >
              {props.formAction == "add" ? "Add" : "Update"}
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <GridContainer classes={{ container: classes.formContainer }}>
          <GridItem>
            <FormControl style={{ marginLeft: 5 }}>
              <FormLabel
                classes={{
                  root: classes.formLabelRoot,
                  focused: classes.formLabelFocused,
                }}
              >
                View Type
              </FormLabel>
              <RadioGroup
                name="task_or_tasklist_form"
                value={taskFormOption}
                onChange={handleTaskFormOption}
                classes={{
                  root: classes.formGroupRoot,
                }}
              >
                <FormControlLabel
                  value="tasklist"
                  control={
                    <Radio
                      size="small"
                      classes={{
                        root: classes.radioRoot,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label="Task List"
                  classes={{
                    label: classes.radioLabel,
                  }}
                />
                <FormControlLabel
                  value="task"
                  control={
                    <Radio
                      size="small"
                      classes={{
                        root: classes.radioRoot,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label="Task"
                  classes={{
                    label: classes.radioLabel,
                  }}
                />
              </RadioGroup>
            </FormControl>
          </GridItem>
        </GridContainer>
        {taskFormOption == "tasklist" ? (
          <TaskListForm
            ref={formActionRef}
            formAction={props.formAction}
            projectID={props.projectID}
            tasklistID={props.tasklistID ? props.tasklistID : null}
            fetchTasklistList={props.fetchTasklistList}
            setAlert={props.setAlert}
            setAlertMsg={props.setAlertMsg}
            setOnFilter={props.setOnFilter}
            setLoading={setLoading}
            {...props}
          />
        ) : (
          <TaskForm
            ref={formActionRef}
            formAction={props.formAction}
            projectID={props.projectID}
            tasklistID={props.tasklistID ? props.tasklistID : null}
            taskID={props.taskID ? props.taskID : null}
            fetchTaskList={props.fetchTaskList}
            setAlert={props.setAlert}
            setOnFilter={props.setOnFilter}
            setLoading={setLoading}
            {...props}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
