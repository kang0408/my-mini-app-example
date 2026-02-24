import { mockVBotEnv, emitEvent } from '@vbotma/sdk';

const themeParams = {
  accent_text_color: '#42b883',
  button_color: '#42b883',
  bg_color: '#fff',
  text_color: '#000',
};

if (import.meta.env.DEV) {
  console.log('Mock Enviroment');
  mockVBotEnv({
    launchParams: {
      vbWebAppThemeParams: themeParams,
      vbWebAppVersion: 9.2,
      vbWebAppPlatform: 'web',
    },
  });
}
