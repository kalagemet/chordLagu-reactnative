import axios from "axios";
import { getSettings } from "./AdsApi";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    apa: "79fa2fcaecf5c83c299cd96e2ba44710",
  },
});

getSettings((setting) => (instance.defaults.baseURL = setting.host));

export default instance;
