import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class SystemUtils {
  static async checkDutiInstalled(): Promise<boolean> {
    const methods = [
      async () => {
        await execAsync("which duti");
        return true;
      },
      async () => {
        await execAsync("test -f /opt/homebrew/bin/duti");
        return true;
      },
      async () => {
        await execAsync("test -f /usr/local/bin/duti");
        return true;
      },
      async () => {
        await execAsync("command -v duti");
        return true;
      },
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result) return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  static async getDutiVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync("duti -V");
      return stdout.trim();
    } catch {
      return null;
    }
  }

  static getInstallInstructions(): string {
    return "Install duti with Homebrew: brew install duti";
  }
}
