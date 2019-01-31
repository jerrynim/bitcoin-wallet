import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
const { remote } = window.require("electron");

const sharedPort = remote.getGlobal("sharedPort");

alert(sharedPort);

window.sharedPort = sharedPort;

ReactDOM.render(<App />, document.getElementById("root"));
