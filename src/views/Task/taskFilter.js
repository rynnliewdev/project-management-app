import React, { useState, useEffect } from "react";
//@material-ui/core
import { makeStyles } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
//core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
//services
import * as TASK from "services/task";

const useStyles = makeStyles({
  paper: {
    paddingTop: 10,
    width: 280,
  },
  listItemBtn: {
    height: 30,
  },
});

export default function TaskFilter(props) {
  const classes = useStyles();
  const [statusList, setStatusList] = useState([]);
  const [checkedStatus, setCheckedStatus] = useState(["all"]);

  function fetchTaskStatusList() {
    TASK.getTaskStatusList().then((res) => {
      setStatusList(res.data);
    });
  }

  useEffect(() => {
    fetchTaskStatusList();
  }, []);

  const handleToggleDrawer = () => {
    props.setFilterDrawer(false);
  };

  const handleCheckStatus = (status) => () => {
    const currentIndex = checkedStatus.indexOf(status);
    const newCheckedStatus = [...checkedStatus];

    if (currentIndex === -1) {
      newCheckedStatus.push(status);
    } else {
      newCheckedStatus.splice(currentIndex, 1);
    }
    setCheckedStatus(newCheckedStatus);
    props.setSelectedStatus(newCheckedStatus);
  };

  const handleApplyFilter = () => {
    props.setOnFilter(checkedStatus);
  };

  const handleClearFilter = () => {
    setCheckedStatus("all");
    props.setSelectedStatus("all");
    props.setOnFilter("all");
  };

  useEffect(() => {
    props.fetchTaskList();
  }, [props.onFilter]);

  const TaskFilter = (
    <div>
      <GridContainer alignItems="center">
        <GridItem style={{ flex: 1 }}>
          <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
            Filters
          </Typography>
        </GridItem>
        <GridItem>
          <Button
            color="secondary"
            size="small"
            variant="outlined"
            onClick={handleClearFilter}
            style={{ marginRight: 10 }}
          >
            Clear
          </Button>
          <Button
            color="secondary"
            size="small"
            variant="contained"
            onClick={handleApplyFilter}
          >
            Apply
          </Button>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            Status
          </Typography>
          <List>
            <ListItem
              key={"all"}
              dense
              button
              onClick={handleCheckStatus("all")}
              classes={{
                button: classes.listItemBtn,
              }}
            >
              <Checkbox
                edge="start"
                checked={checkedStatus.indexOf("all") !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={"All Task"} />
            </ListItem>
            {Object.entries(statusList).map((status) => (
              <ListItem
                key={status[0]}
                dense
                button
                onClick={handleCheckStatus(status[0])}
                classes={{
                  button: classes.listItemBtn,
                }}
              >
                <Checkbox
                  edge="start"
                  checked={checkedStatus.indexOf(status[0]) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={status[1]} />
              </ListItem>
            ))}
          </List>
        </GridItem>
      </GridContainer>
    </div>
  );

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={props.open}
      onClose={handleToggleDrawer}
      classes={{ paper: classes.paper }}
    >
      {TaskFilter}
    </Drawer>
  );
}
