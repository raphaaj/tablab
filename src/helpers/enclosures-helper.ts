import { StringHelper } from './string-helper';

export class EnclosuresHelper {
  private static openingClosingEnclosureMap: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  public static readonly openingEnclosures: string[] = Object.keys(
    EnclosuresHelper.openingClosingEnclosureMap
  );

  public static readonly closingEnclosures: string[] = Object.values(
    EnclosuresHelper.openingClosingEnclosureMap
  );

  public static isOpeningEnclosure(char: string): boolean {
    return EnclosuresHelper.openingEnclosures.indexOf(char) > -1;
  }

  public static isClosingEnclosure(char: string): boolean {
    return EnclosuresHelper.closingEnclosures.indexOf(char) > -1;
  }

  public static hasOpeningEnclosure(str: string): boolean {
    return EnclosuresHelper.hasEnclosures(str, EnclosuresHelper.openingEnclosures);
  }

  public static hasClosingEnclosure(str: string): boolean {
    return EnclosuresHelper.hasEnclosures(str, EnclosuresHelper.closingEnclosures);
  }

  public static getClosingEnclosureFromOpeningEnclosure(openingEnclosure: string): string {
    if (!EnclosuresHelper.isOpeningEnclosure(openingEnclosure))
      throw new Error(
        'The parameter openingEnclosure must be one of ' +
          `"${EnclosuresHelper.openingEnclosures.join(
            '", "'
          )}". Received value was "${openingEnclosure}".`
      );

    return EnclosuresHelper.openingClosingEnclosureMap[openingEnclosure];
  }

  public static getValueInsideEnclosure(
    str: string,
    openingEnclosure: string,
    start?: number
  ): string {
    if (!EnclosuresHelper.isOpeningEnclosure(openingEnclosure))
      throw new Error(
        'The parameter openingEnclosure must be one of ' +
          `"${EnclosuresHelper.openingEnclosures.join(
            '", "'
          )}". Received value was "${openingEnclosure}".`
      );

    const openingEnclosureIndex = str.indexOf(openingEnclosure, start);
    if (openingEnclosureIndex > -1) {
      const matchingClosingEnclosureIndex = StringHelper.getIndexOfMatchingClosingEnclosure(
        str,
        openingEnclosureIndex
      );

      return matchingClosingEnclosureIndex < 0
        ? str.slice(openingEnclosureIndex + 1, str.length)
        : str.slice(openingEnclosureIndex + 1, matchingClosingEnclosureIndex);
    }

    return '';
  }

  private static hasEnclosures(str: string, enclosures: string[]): boolean {
    return (
      enclosures
        .map((enclosure) => str.indexOf(enclosure))
        .filter((enclosureIdx) => enclosureIdx > -1).length > 0
    );
  }
}
