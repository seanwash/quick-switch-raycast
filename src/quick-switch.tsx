import { ActionPanel, Action, Icon, List, Toast, showToast, getPreferenceValues, open } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useState, useEffect } from "react";

interface App {
  name: string;
  path: string;
  icon?: string;
}

interface AppPickerValue {
  path: string;
  name: string;
  bundleId: string;
}

interface Preferences {
  app1?: AppPickerValue;
  app2?: AppPickerValue;
  app3?: AppPickerValue;
  app4?: AppPickerValue;
  app5?: AppPickerValue;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [apps, setApps] = useState<App[]>([]);
  const [lastSelectedApp, setLastSelectedApp] = useCachedState<string>("last-selected-app", "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const appsArray: App[] = [];

        // Collect all configured apps
        const appsList = [preferences.app1, preferences.app2, preferences.app3, preferences.app4, preferences.app5];

        appsList.forEach((app, index) => {
          if (app && app.path) {
            appsArray.push({
              name: app.name || `App ${index + 1}`,
              path: app.path,
            });
          }
        });

        setApps(appsArray);
      } catch {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error Loading Apps",
          message: "Failed to load app preferences",
        });
        setApps([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, [preferences]);

  const handleOpenApp = async (app: App) => {
    try {
      await open(app.path);
      setLastSelectedApp(app.name);
    } catch {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Open App",
        message: `Could not open ${app.name}. Check if the path is correct.`,
      });
    }
  };

  const getAppIcon = (app: App) => {
    if (app.icon) {
      return app.icon;
    }

    // Use actual app icon from the application path
    if (app.path) {
      return { fileIcon: app.path };
    }

    // Fallback to default icons based on app name
    const name = app.name.toLowerCase();
    if (name.includes("vscode") || name.includes("visual studio code")) {
      return Icon.Code;
    } else if (name.includes("sublime")) {
      return Icon.Text;
    } else if (name.includes("vim") || name.includes("nvim")) {
      return Icon.Terminal;
    } else if (name.includes("atom")) {
      return Icon.Circle;
    } else if (name.includes("webstorm") || name.includes("intellij")) {
      return Icon.Gear;
    }
    return Icon.Document;
  };

  const sortedApps = [...apps].sort((a, b) => {
    // Show last selected app first
    if (a.name === lastSelectedApp) return -1;
    if (b.name === lastSelectedApp) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search apps...">
      {apps.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="No Apps Configured"
          description="Add apps in the extension preferences to get started"
        />
      ) : (
        sortedApps.map((app) => (
          <List.Item
            key={app.name}
            icon={getAppIcon(app)}
            title={app.name}
            subtitle={app.path}
            accessories={[...(app.name === lastSelectedApp ? [{ icon: Icon.Star, tooltip: "Last used" }] : [])]}
            actions={
              <ActionPanel>
                <Action title={`Open ${app.name}`} icon={Icon.ArrowRight} onAction={() => handleOpenApp(app)} />
                <Action.CopyToClipboard
                  title="Copy Path"
                  content={app.path}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
