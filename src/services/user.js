import * as AUTH from "./auth";
const axios = require("axios");

export async function getFullUserList(page, params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/user?" +
    "page=" +
    page +
    "&per_page=15";
  if (params) {
    if (params.search) url += "&search=" + params.search;
    if (params.org) url += "&organization_id=" + params.org;
    if (params.role) url += "&user_role=" + params.role;
    if (params.status) url += "&status=" + params.status;
    if (params.from) url += "&join_from=" + params.from;
    if (params.to) url += "&join_to=" + params.to;
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

export async function getSimpleUserList(params) {
  let accessToken = await AUTH.getAccessToken();
  let url =
    process.env.REACT_APP_API_URL +
    "/" +
    process.env.REACT_APP_API_PREFIX +
    "/user-list";
  if (params) {
    if (params.org_id) url += "organization_id=" + params.org_id;
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

export async function getUser(id) {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/user/" +
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

export async function updateUser(updateData) {
  let accessToken = await AUTH.getAccessToken();
  let data = {};
  // if (updateData.password.length > 0) {
  //   data.password = updateData.password;
  // }
  data.name = updateData.name;
  data.email = updateData.email;
  data.mobile_prefix = updateData.mobile_prefix;
  data.mobile_number = updateData.mobile_number;
  data.organization = updateData.organization;
  data.status = updateData.status;
  return new Promise((resolve, reject) => {
    axios
      .put(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/user/" +
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

export async function updateUserRole(updateData) {
  let accessToken = await AUTH.getAccessToken();
  let data = {};
  data.role = updateData.role;
  return new Promise((resolve, reject) => {
    axios
      .put(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/user/" +
          updateData.id +
          "/role",
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

export async function getUserStatusList() {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/user-status-list",
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

export async function getRoleList() {
  let accessToken = await AUTH.getAccessToken();
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/role-list",
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

// export async function addUser(data) {
//   let accessToken = await AUTH.getAccessToken();
//   return new Promise((resolve, reject) => {
//     axios
//       .post(
//         process.env.REACT_APP_API_URL +
//           "/" +
//           process.env.REACT_APP_API_PREFIX +
//           "/user",
//         {
//           username: data.username,
//           first_name: data.first_name,
//           last_name: data.last_name,
//           email: data.email,
//           password: data.password,
//           mobile_number_prefix: data.mobile_number_prefix,
//           mobile_number: data.mobile_number,
//           user_type: data.user_type,
//           status: data.status,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json;charset=UTF-8",
//             "Access-Control-Allow-Origin": "*",
//             Authorization: "Bearer " + accessToken,
//           },
//         }
//       )
//       .then((response) => {
//         const { data } = response;
//         resolve(data);
//       })
//       .catch((error) => {
//         if (!accessToken) {
//           reject("token");
//         } else {
//           if (error.response) {
//             if (error.response.data) {
//               reject(error.response.data);
//             }
//           }
//         }
//       })
//       .finally();
//   });
// }
