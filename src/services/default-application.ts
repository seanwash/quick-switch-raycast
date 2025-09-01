import { exec } from "child_process";
import { promisify } from "util";
import { DefaultEditorResult } from "../types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants";
import { SystemUtils } from "./system-utils";
import { FileExtensionParser } from "../utils/file-extensions";

const execAsync = promisify(exec);

export class DefaultApplicationService {
  static async setAsDefaultApplication(bundleId: string, extensionsString: string): Promise<DefaultEditorResult> {
    if (!bundleId) {
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_BUNDLE_ID,
      };
    }

    const dutiInstalled = await SystemUtils.checkDutiInstalled();
    if (!dutiInstalled) {
      return {
        success: false,
        message: ERROR_MESSAGES.DUTI_NOT_INSTALLED,
        details: SystemUtils.getInstallInstructions(),
      };
    }

    const extensions = FileExtensionParser.parseExtensions(extensionsString);
    if (extensions.length === 0) {
      return {
        success: false,
        message: ERROR_MESSAGES.PARSING_EXTENSIONS_FAILED,
        details: "No valid file extensions found",
      };
    }

    const { valid, invalid } = FileExtensionParser.validateExtensions(extensions);

    if (valid.length === 0) {
      return {
        success: false,
        message: ERROR_MESSAGES.PARSING_EXTENSIONS_FAILED,
        details: `All extensions are invalid: ${invalid.join(", ")}`,
      };
    }

    try {
      const results = await Promise.allSettled(
        valid.map((extension) => this.setDefaultForExtension(bundleId, extension)),
      );

      const failed = results.filter((result) => result.status === "rejected");
      const succeeded = results.filter((result) => result.status === "fulfilled");

      const errors: string[] = [];
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const extension = valid[index];
          const error = result.reason instanceof Error ? result.reason.message : String(result.reason);
          errors.push(`${extension}: ${error.split("\n")[0]}`);
        }
      });

      if (failed.length > succeeded.length) {
        return {
          success: false,
          message: ERROR_MESSAGES.FAILED_TO_SET_DEFAULT,
          details: `Failed for ${failed.length} out of ${valid.length} extensions.\nErrors:\n${errors.join("\n")}`,
        };
      }

      let message = SUCCESS_MESSAGES.DEFAULT_EDITOR_SET;
      let details = `Successfully set for ${succeeded.length} out of ${valid.length} extensions`;

      if (failed.length > 0) {
        message += ` (${failed.length} failed)`;
        details += `\nFailed: ${errors.join(", ")}`;
      }

      if (invalid.length > 0) {
        details += `\nSkipped invalid: ${invalid.join(", ")}`;
      }

      return {
        success: true,
        message,
        details,
      };
    } catch (error) {
      return {
        success: false,
        message: ERROR_MESSAGES.FAILED_TO_SET_DEFAULT,
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private static async setDefaultForExtension(bundleId: string, extension: string): Promise<void> {
    const dutiPaths = ["duti", "/opt/homebrew/bin/duti", "/usr/local/bin/duti"];

    let lastError: Error | null = null;

    for (const dutiPath of dutiPaths) {
      try {
        const command = `"${dutiPath}" -s "${bundleId}" "${extension}" all`;
        await execAsync(command);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw lastError || new Error("Failed to execute duti command");
  }
}
