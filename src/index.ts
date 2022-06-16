import Scene from "./Scene";
import "./style.css";

window.addEventListener("load", init, false);

function init() {
  const threeScene = new Scene(document.body);
  threeScene.init();
  threeScene.toggleUI();
}
