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

  static getIndexOfMatchingClosingEnclosure(str: string, openingEnclosureIndex: number): number {
    if (openingEnclosureIndex > str.length - 1) return -1;

    const openingEnclosure = str[openingEnclosureIndex];
    if (!EnclosuresHelper.isOpeningEnclosure(openingEnclosure))
      throw new Error(
        'The parameter openingEnclosureIndex must reference a string character ' +
          `whose value must be one of "${EnclosuresHelper.openingEnclosures.join(`", "`)}".` +
          `Found "${openingEnclosure}" at index ${openingEnclosureIndex}.`
      );

    return EnclosuresHelper._getIndexOfMatchingClosingEnclosure(str, openingEnclosureIndex);
  }

  static getValueInsideEnclosure(str: string, openingEnclosureIndex: number): string {
    const closingEnclosureIndex = EnclosuresHelper.getIndexOfMatchingClosingEnclosure(
      str,
      openingEnclosureIndex
    );

    let value: string;
    if (closingEnclosureIndex < 0) value = str.slice(openingEnclosureIndex + 1, str.length);
    else value = str.slice(openingEnclosureIndex + 1, closingEnclosureIndex);

    return value;
  }

  static hasClosingEnclosure(str: string): boolean {
    return EnclosuresHelper._hasEnclosures(str, EnclosuresHelper.closingEnclosures);
  }

  static hasOpeningEnclosure(str: string): boolean {
    return EnclosuresHelper._hasEnclosures(str, EnclosuresHelper.openingEnclosures);
  }

  static isClosingEnclosure(char: string): boolean {
    return EnclosuresHelper.closingEnclosures.indexOf(char) > -1;
  }

  static isOpeningEnclosure(char: string): boolean {
    return EnclosuresHelper.openingEnclosures.indexOf(char) > -1;
  }

  private static _getIndexOfMatchingClosingEnclosure(
    str: string,
    openingEnclosureIndex: number
  ): number {
    const openingEnclosure = str[openingEnclosureIndex];
    const closingEnclosure = EnclosuresHelper.getClosingEnclosureFromOpeningEnclosure(
      openingEnclosure
    );

    let closingEnclosureIndex = -1;
    let pendingOpeningEnclosures = 0;
    for (let i = openingEnclosureIndex; i < str.length; i++) {
      const currentCharacter = str[i];

      if (currentCharacter === openingEnclosure) {
        pendingOpeningEnclosures++;
      } else if (currentCharacter === closingEnclosure) {
        pendingOpeningEnclosures--;
      }

      if (pendingOpeningEnclosures === 0) {
        closingEnclosureIndex = i;
        break;
      }
    }

    return closingEnclosureIndex;
  }

  private static _hasEnclosures(str: string, enclosures: string[]): boolean {
    return (
      enclosures
        .map((enclosure) => str.indexOf(enclosure))
        .filter((enclosureIdx) => enclosureIdx > -1).length > 0
    );
  }
}
