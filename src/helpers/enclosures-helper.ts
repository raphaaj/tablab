import { StringHelper } from './string-helper';

const openingClosingEnclosureMap: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

export class EnclosuresHelper {
  static readonly closingEnclosures: string[] = Object.values(openingClosingEnclosureMap);

  static readonly openingEnclosures: string[] = Object.keys(openingClosingEnclosureMap);

  static getClosingEnclosureFromOpeningEnclosure(openingEnclosure: string): string {
    if (!EnclosuresHelper.isOpeningEnclosure(openingEnclosure))
      throw new Error(
        'The parameter openingEnclosure must be one of ' +
          `"${EnclosuresHelper.openingEnclosures.join(
            '", "'
          )}". Received value was "${openingEnclosure}".`
      );

    return openingClosingEnclosureMap[openingEnclosure];
  }

  static getValueInsideEnclosure(str: string, openingEnclosureIndex: number): string {
    const closingEnclosureIndex = StringHelper.getIndexOfMatchingClosingEnclosure(
      str,
      openingEnclosureIndex
    );

    let value: string;
    if (closingEnclosureIndex < 0) value = str.slice(openingEnclosureIndex + 1, str.length);
    else value = str.slice(openingEnclosureIndex + 1, closingEnclosureIndex);

    return value;
  }

  static hasClosingEnclosure(str: string): boolean {
    return EnclosuresHelper.hasEnclosures(str, EnclosuresHelper.closingEnclosures);
  }

  static hasOpeningEnclosure(str: string): boolean {
    return EnclosuresHelper.hasEnclosures(str, EnclosuresHelper.openingEnclosures);
  }

  static isClosingEnclosure(char: string): boolean {
    return EnclosuresHelper.closingEnclosures.indexOf(char) > -1;
  }

  static isOpeningEnclosure(char: string): boolean {
    return EnclosuresHelper.openingEnclosures.indexOf(char) > -1;
  }

  private static hasEnclosures(str: string, enclosures: string[]): boolean {
    return (
      enclosures
        .map((enclosure) => str.indexOf(enclosure))
        .filter((enclosureIdx) => enclosureIdx > -1).length > 0
    );
  }
}
