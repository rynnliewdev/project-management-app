import * as AUTH from "./auth";
const axios = require("axios");

export async function getFullTask(page, params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/tasks?";
  if (page) {
    url += "page=" + page + "&per_page=15";
  }
  if (params) {
    if (page) url += "page=" + page + "&per_page=15";
    if (params.status) url += "&status=" + params.status;
    if (params.parent_task) url += "&parent_id=" + params.parent_task;
    if (params.project) url += "&project_id=" + params.project;
  }
  
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            reject(error.response.data);
          }
        }
      })
      .finally();
  });
}

export async function getUngroupedTask(params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/task-list?";
  if (params) {
    if (params.status) url += "&status=" + params.status;
    if (params.parent_task) url += "&parent_id=" + params.parent_task;
    if (params.project) url += "&project_id=" + params.project;
  }
  
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            reject(error.response.data);
          }
        }
      })
      .finally();
  });
}

export async function getTask(id) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/tasks/" +
          id,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (!accessToken) {
          reject("token");
        } else {
          if (error.response) {
            if (error.response.data) {
              reject(error.response.data);
            }
          }
        }
      })
      .finally();
  });
}

export async function addTask(data) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/tasks",
        {
          name: data.name,
          description: data.description,
          project_id: data.project,
          task_list_id: data.tasklist,
          parent_id: data.parent_task,
          owner_id: data.owner,
          start_date: data.start_date,
          due_date: data.due_date,
          duration: data.duration,
          duration_type: data.duration_unit,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (!accessToken) {
          reject("token");
        } else {
          if (error.response) {
            if (error.response.data) {
              reject(error.response.data);
            }
          }
        }
      })
      .finally();
  });
}

export async function updateTask(updateData) {
  let accessToken = await AUTH.getAccessToken();
  let data = {};
  data.name = updateData.name;
  data.description = updateData.description;
  data.project_id = updateData.project;
  data.task_list_id = updateData.tasklist;
  data.parent_id = updateData.parent_task;
  data.owner_id = updateData.owner;
  data.start_date = updateData.start_date;
  data.due_date = updateData.due_date;
  data.duration = updateData.duration;
  data.duration_type = updateData.duration_unit;
  data.completion = updateData.completion;
  data.status = updateData.status;

  return new Promise((resolve, reject) => {
    axios
      .put(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/tasks/" +
          updateData.id,
        data,
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (!accessToken) {
          reject("token");
        } else {
          if (error.response) {
            if (error.response.data) {
              reject(error.response.data);
            }
          }
        }
      })
      .finally();
  });
}

export async function getProjectUserList(project_id) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/projects/" +
    project_id +
    "/user";
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            reject(error.response.data);
          }
        }
      })
      .finally();
  });
}

export async function getTaskStatusList() {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/task-status-list";
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data) {
            reject(error.response.data);
          }
        }
      })
      .finally();
  });
}
