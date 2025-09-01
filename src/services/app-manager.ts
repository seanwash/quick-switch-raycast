import { Toast, showToast } from "@raycast/api";
import { App, Preferences } from "../types";

export class AppManager {
  static async getConfiguredApps(preferences: Preferences): Promise<App[]> {
    try {
      const appsArray: App[] = [];
      const appsList = [preferences.app1, preferences.app2, preferences.app3, preferences.app4, preferences.app5];

      appsList.forEach((app, index) => {
        if (app && app.path) {
          appsArray.push({
            name: app.name || `App ${index + 1}`,
            path: app.path,
            bundleId: app.bundleId,
          });
        }
      });

      return appsArray;
    } catch {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error Loading Apps",
        message: "Failed to load app preferences",
      });
      return [];
    }
  }

  static sortApps(apps: App[], lastSelectedApp: string): App[] {
    return [...apps].sort((a, b) => {
      if (a.name === lastSelectedApp) return -1;
      if (b.name === lastSelectedApp) return 1;
      return a.name.localeCompare(b.name);
    });
  }
}
