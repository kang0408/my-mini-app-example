import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { init, retrieveLaunchParams, setTargetOrigin } from '@vbotma/sdk';
import { setupTheme } from './setupTheme';

// import './mockEnv';

const { vbWebAppPlatform } = retrieveLaunchParams();

if (vbWebAppPlatform == 'web') setTargetOrigin('http://localhost:5174');

init();

setupTheme();

createApp(App).mount('#app');
