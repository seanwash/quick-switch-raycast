export const DEFAULT_FILE_EXTENSIONS =
  ".js,.ts,.tsx,.jsx,.svelte,.vue,.py,.rb,.go,.php,.rs,.swift,.java,.cpp,.c,.h,.css,.scss,.json,.xml,.yaml,.yml,.md,.txt";

export const ERROR_MESSAGES = {
  DUTI_NOT_INSTALLED: "duti is not installed. Install it with: brew install duti",
  FAILED_TO_SET_DEFAULT: "Failed to set default editor",
  INVALID_BUNDLE_ID: "Invalid app bundle ID",
  PARSING_EXTENSIONS_FAILED: "Failed to parse file extensions",
} as const;

export const SUCCESS_MESSAGES = {
  DEFAULT_EDITOR_SET: "Default editor set successfully",
  DUTI_AVAILABLE: "duti is available",
} as const;
