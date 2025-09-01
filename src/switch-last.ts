import { LocalStorage, getPreferenceValues, open, showToast, Toast } from "@raycast/api";
import { AppManager } from "./services/app-manager";
import { Preferences } from "./types";
import { LAST_SELECTED_APP_KEY } from "./constants";

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const lastAppName = await LocalStorage.getItem<string>(LAST_SELECTED_APP_KEY);

  if (!lastAppName) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No last app selected",
      message: "Use Quick Switch first",
    });
    return;
  }

  const apps = await AppManager.getConfiguredApps(preferences);
  const app = apps.find((a) => a.name === lastAppName);

  if (!app) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Last app not configured",
      message: lastAppName,
    });
    return;
  }

  try {
    await open(app.path);
  } catch {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to Open App",
      message: `Could not open ${app.name}.`,
    });
  }
}
