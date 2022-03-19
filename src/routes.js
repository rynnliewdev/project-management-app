/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import FlagIcon from "@material-ui/icons/Flag";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// core components/views for Main layout
import Project from "views/Project/Project";
import Login from "views/Login/Login";
import TaskList from "views/TaskList/TaskList";
import Milestone from "views/Milestone/Milestone";

const dashboardRoutes = [
  {
    path: "/tasklist",
    name: "Tasks",
    icon: AssignmentTurnedInIcon,
    component: TaskList,
    layout: "",
  },
  {
    path: "/milestone",
    name: "Milestones",
    icon: FlagIcon,
    component: Milestone,
    layout: "",
  },
  // {
  //   path: "/project",
  //   name: "Projects",
  //   icon: AssignmentIcon,
  //   component: Project,
  //   layout: "",
  // },
  {
    path: "/login",
    name: "Logout",
    icon: ExitToAppIcon,
    component: Login,
    layout: "",
  },
];

export default dashboardRoutes;
