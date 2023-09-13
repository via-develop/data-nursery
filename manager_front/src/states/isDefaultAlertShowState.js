import { atom } from "recoil";

export const isDefaultAlertShowState = atom({
  key: "isDefaultAlertShowState",
  default: {
    isShow: false,
    type: "",
    text: "",
    okClick: null,
  },
});
