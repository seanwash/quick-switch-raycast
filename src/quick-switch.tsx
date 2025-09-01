import {
  ActionPanel,
  Action,
  Icon,
  List,
  Toast,
  showToast,
  getPreferenceValues,
  open,
  openExtensionPreferences,
} from "@raycast/api";
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
  }, []);

  const handleOpenApp = async (app: App) => {
    try {
      await open(app.path);
      setLastSelectedApp(app.name);
    } catch {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Open App",
        message: `Could not open ${app.name}.`,
      });
    }
  };

  const getAppIcon = (app: App) => {
    if (app.icon) {
      return app.icon;
    }

    if (app.path) {
      return { fileIcon: app.path };
    }

    return Icon.Code;
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
          actions={
            <ActionPanel>
              <Action
                title="Open Preferences"
                icon={Icon.Gear}
                onAction={openExtensionPreferences}
                shortcut={{ modifiers: ["cmd", "shift"], key: "," }}
              />
            </ActionPanel>
          }
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
                <Action
                  title="Open Preferences"
                  icon={Icon.Gear}
                  onAction={openExtensionPreferences}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "," }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
