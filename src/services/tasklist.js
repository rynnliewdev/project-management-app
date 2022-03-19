import * as AUTH from "./auth";
const axios = require("axios");

export async function getFullTaskList(page, params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/tasklists?" +
    "page=" +
    page +
    "&per_page=10";
  if (params) {
    if (params.project) url += "&project_id=" + params.project;
    if(params.milestone) url += "&milestone_id=" + params.milestone;
    if(params.status) url += "&status=" + params.status; 
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

export async function getSimpleTaskList(params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/tasklist-list?";
  if (params) {
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

export async function getTaskList(id) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/tasklists/" +
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

export async function addTaskList(data) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/tasklists",
        {
          name: data.name,
          project_id: data.project,
          milestone_id: data.milestone,
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

export async function updateTaskList(updateData) {
  let accessToken = await AUTH.getAccessToken();
  let data = {};
  data.name = updateData.name;
  data.project_id = updateData.project;
  data.milestone_id = updateData.milestone;

  return new Promise((resolve, reject) => {
    axios
      .put(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/tasklists/" +
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
