import { Icon } from "@raycast/api";
import { App } from "../types";

export class IconMapper {
  static getAppIcon(app: App): string | { fileIcon: string } {
    if (app.icon) {
      return app.icon;
    }

    if (app.path) {
      return { fileIcon: app.path };
    }

    const appName = app.name.toLowerCase();

    if (appName.includes("code") || appName.includes("vscode")) {
      return Icon.Code;
    }

    if (appName.includes("vim") || appName.includes("nvim")) {
      return Icon.Terminal;
    }

    if (appName.includes("xcode")) {
      return Icon.Hammer;
    }

    if (appName.includes("text") || appName.includes("edit")) {
      return Icon.Document;
    }

    return Icon.Code;
  }
}
