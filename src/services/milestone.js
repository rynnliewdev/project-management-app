import * as AUTH from "./auth";
const axios = require("axios");

export async function getFullMilestoneList(page, params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/milestones?" +
    "page=" +
    page +
    "&per_page=10";
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

export async function getSimpleMilestoneList() {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/milestone-list";
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

export async function getMilestone(id) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/milestones/" +
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

export async function addMilestone(data) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/milestones",
        {
          name: data.name,
          project_id: data.project,
          start_date: data.start_date,
          end_date: data.end_date,
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

export async function updateMilestone(updateData) {
  let accessToken = await AUTH.getAccessToken();
  let data = {};
  data.name = updateData.name;
  data.project_id = updateData.project;
  data.start_date = updateData.start_date;
  data.end_date = updateData.end_date;

  return new Promise((resolve, reject) => {
    axios
      .put(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/milestones/" +
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

