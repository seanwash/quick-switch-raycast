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
  Clipboard,
} from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useState, useEffect } from "react";
import { App, Preferences } from "./types";
import { AppManager } from "./services/app-manager";
import { DefaultEditorService } from "./services/default-editor";
import { IconMapper } from "./utils/icon-mapper";
import { DEFAULT_FILE_EXTENSIONS } from "./constants";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [apps, setApps] = useState<App[]>([]);
  const [lastSelectedApp, setLastSelectedApp] = useCachedState<string>("last-selected-app", "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const configuredApps = await AppManager.getConfiguredApps(preferences);
        setApps(configuredApps);
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

  const handleSetAsDefaultEditor = async (app: App) => {
    if (!app.bundleId) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Cannot Set Default Editor",
        message: "App bundle ID not available",
      });
      return;
    }

    const fileExtensions = preferences.fileExtensions || DEFAULT_FILE_EXTENSIONS;

    await showToast({
      style: Toast.Style.Animated,
      title: "Setting Default Editor...",
      message: `Configuring ${app.name} for file associations`,
    });

    const result = await DefaultEditorService.setAsDefaultEditor(app.bundleId, fileExtensions);

    await showToast({
      style: result.success ? Toast.Style.Success : Toast.Style.Failure,
      title: result.success ? "Success" : "Failed",
      message: result.message,
    });
  };

  const sortedApps = AppManager.sortApps(apps, lastSelectedApp);

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
            icon={IconMapper.getAppIcon(app)}
            title={app.name}
            subtitle={app.path}
            accessories={[...(app.name === lastSelectedApp ? [{ icon: Icon.Star, tooltip: "Last used" }] : [])]}
            actions={
              <ActionPanel>
                <Action title={`Open ${app.name}`} icon={Icon.ArrowRight} onAction={() => handleOpenApp(app)} />
                <Action
                  title="Set as Default Editor"
                  icon={Icon.Document}
                  onAction={() => handleSetAsDefaultEditor(app)}
                  shortcut={{ modifiers: ["cmd"], key: "d" }}
                />
                <Action
                  title="Copy App Path"
                  icon={Icon.CopyClipboard}
                  onAction={async () => {
                    await Clipboard.copy(app.path);
                    await showToast({
                      style: Toast.Style.Success,
                      title: "Copied",
                      message: "App path copied to clipboard",
                    });
                  }}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
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
