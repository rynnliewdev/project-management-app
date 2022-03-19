const axios = require("axios");

function getExpireDate(expireInSeconds) {
  const now = new Date();
  let expireTime = new Date(now);
  expireTime.setSeconds(now.getSeconds() + expireInSeconds);
  return expireTime;
}

export function login(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/" +
          process.env.REACT_APP_API_PREFIX +
          "/user/login",
        {
          email: data.email,
          password: data.password,
        }
      )
      .then((response) => {
        const { data } = response;
        let expireTime = getExpireDate(data["data"]["expires_in"]);
        let tokenData = {
          accessToken: data["data"]["access_token"],
          refreshToken: data["data"]["refresh_token"],
          expireAt: expireTime,
        };
        localStorage.setItem("expireAt", expireTime);
        localStorage.setItem("tokenData", JSON.stringify(tokenData));
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

export async function getAccessToken() {
  let tokenObject = {};
  let todayDate = new Date();
  let tokenData = await localStorage.getItem("tokenData");
  if (tokenData) {
    tokenObject = JSON.parse(tokenData);
    if (tokenObject.accessToken && new Date(tokenObject.expireAt) > todayDate) {
      if (tokenObject.accessToken) return tokenObject.accessToken;
    } else {
      return null;
    }
  }
}
