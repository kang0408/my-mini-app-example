import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { init, setTargetOrigin } from "@vbotma/sdk";
import { setupTheme } from "./setupTheme";

import "./mockEnv";

setTargetOrigin("http://localhost:5174");

init();

setupTheme();

createApp(App).mount("#app");
