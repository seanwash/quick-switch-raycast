export interface App {
  name: string;
  path: string;
  bundleId?: string;
  icon?: string;
}

export interface AppPickerValue {
  path: string;
  name: string;
  bundleId: string;
}

export interface Preferences {
  app1?: AppPickerValue;
  app2?: AppPickerValue;
  app3?: AppPickerValue;
  app4?: AppPickerValue;
  app5?: AppPickerValue;
  fileExtensions?: string;
}

export interface DefaultEditorResult {
  success: boolean;
  message: string;
  details?: string;
}
