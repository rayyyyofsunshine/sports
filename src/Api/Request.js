import axios from "axios";

const api_key = process.env.REACT_APP_API_KEY_2;

export const instance = axios.create({
  method: "GET",
  baseURL: "https://allsportsapi2.p.rapidapi.com/api",
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "allsportsapi2.p.rapidapi.com",
  },
});
