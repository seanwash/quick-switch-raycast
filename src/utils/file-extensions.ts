export class FileExtensionParser {
  static parseExtensions(input: string): string[] {
    if (!input || typeof input !== "string") {
      return [];
    }

    return input
      .split(",")
      .map((ext) => ext.trim())
      .filter((ext) => ext.length > 0)
      .map((ext) => this.normalizeExtension(ext));
  }

  static validateExtensions(extensions: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    extensions.forEach((ext) => {
      if (this.isValidExtension(ext)) {
        valid.push(ext);
      } else {
        invalid.push(ext);
      }
    });

    return { valid, invalid };
  }

  private static normalizeExtension(extension: string): string {
    const trimmed = extension.trim();
    return trimmed.startsWith(".") ? trimmed : `.${trimmed}`;
  }

  private static isValidExtension(extension: string): boolean {
    if (!extension || typeof extension !== "string") {
      return false;
    }

    return /^\.[a-zA-Z0-9]+$/.test(extension);
  }
}
