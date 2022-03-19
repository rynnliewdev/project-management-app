import * as AUTH from "./auth";
const axios = require("axios");

export async function getFullProjectList(page) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/projects?" +
    "page=" +
    page +
    "&per_page=10";

  //   if (params) {
  //     if (params.from) url += "&created_since=" + params.from;
  //     if (params.to) url += "&created_before=" + params.to;
  //   }
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

export async function getSimpleProjectList() {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/project-list";
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

export async function getProject(id) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/projects/" +
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

export async function addProject(data) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/projects",
        {
          title: data.title,
          overview: data.overview,
          owner_id: data.owner,
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

export async function updateProject(updateData) {
  let accessToken = await AUTH.getAccessToken();
  let data = {};
  data.title = updateData.title;
  data.overview = updateData.overview;
  data.owner_id = updateData.owner;
  data.start_date = updateData.start_date;
  data.end_date = updateData.end_date;

  return new Promise((resolve, reject) => {
    axios
      .put(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/projects/" +
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

export async function getProjectUserList(id) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/projects/" + id + "/users" ;

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