export class CommonUtil {
  static readonly PARSE_BOOLEAN_STRING = (value: string) => value === 'true';

  static readonly PARSE_LIST = (value: unknown): string[] =>
    typeof value === 'string' && value.trim()
      ? (JSON.parse(value.trim()) as string[])
      : [];
}
