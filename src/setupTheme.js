import { themeParams } from "@vbotma/sdk";

export async function setupTheme() {
  try {
    if (!themeParams.isMounted()) {
      themeParams.mount();
      if (!themeParams.isCssVarsBound()) {
        console.log(themeParams.state());
        themeParams.bindCssVars();
      }
      console.log(themeParams.isCssVarsBound());
      console.log("[VBotSDK] Theme mounted and CSS variables bound");
    }
  } catch (error) {
    console.warn("[VBotSDK] Failed to setup theme", error);
  }
}
