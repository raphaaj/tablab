import { EnclosuresHelper } from '../../src/helpers/enclosures-helper';

describe(`[${EnclosuresHelper.name}]`, () => {
  describe(`[isOpeningEnclosure]`, () => {
    it('should identify opening enclosures', () => {
      const isOpeningEnclosureMap: Record<string, boolean | null> = {
        '(': null,
        '[': null,
        '{': null,
        '<': null,
      };

      Object.keys(isOpeningEnclosureMap).forEach((key) => {
        isOpeningEnclosureMap[key] = EnclosuresHelper.isOpeningEnclosure(key);
      });

      expect(isOpeningEnclosureMap['(']).toBe(true);
      expect(isOpeningEnclosureMap['[']).toBe(true);
      expect(isOpeningEnclosureMap['{']).toBe(true);
      expect(isOpeningEnclosureMap['<']).toBe(true);
    });
  });

  describe(`[isClosingEnclosure]`, () => {
    it('should closing enclosures', () => {
      const isClosingEnclosureMap: Record<string, boolean | null> = {
        ')': null,
        ']': null,
        '}': null,
        '>': null,
      };

      Object.keys(isClosingEnclosureMap).forEach((key) => {
        isClosingEnclosureMap[key] = EnclosuresHelper.isClosingEnclosure(key);
      });

      expect(isClosingEnclosureMap[')']).toBe(true);
      expect(isClosingEnclosureMap[']']).toBe(true);
      expect(isClosingEnclosureMap['}']).toBe(true);
      expect(isClosingEnclosureMap['>']).toBe(true);
    });
  });

  describe(`[hasOpeningEnclosure]`, () => {
    it('should return false when the string has no opening enclosures', () => {
      const str = 'some string without opening enclosures';
      const hasOpeningEnclosures = EnclosuresHelper.hasOpeningEnclosure(str);

      expect(hasOpeningEnclosures).toBe(false);
    });

    it('should return true if the string has one opening enclosure', () => {
      const str = 'some string with a opening bracket (';
      const hasOpeningEnclosures = EnclosuresHelper.hasOpeningEnclosure(str);

      expect(hasOpeningEnclosures).toBe(true);
    });

    it('should return true if the string has multiple opening enclosures', () => {
      const str = 'some string with a bunch of opening enclosures (< ( { [[ {(';
      const hasOpeningEnclosures = EnclosuresHelper.hasOpeningEnclosure(str);

      expect(hasOpeningEnclosures).toBe(true);
    });
  });

  describe(`[hasClosingEnclosure]`, () => {
    it('should return false when the string has no closing enclosures', () => {
      const str = 'some string without closing brackets';
      const hasClosingEnclosures = EnclosuresHelper.hasClosingEnclosure(str);

      expect(hasClosingEnclosures).toBe(false);
    });

    it('should return true if the string has one opening enclosure', () => {
      const str = 'some string with a closing bracket }';
      const hasClosingEnclosures = EnclosuresHelper.hasClosingEnclosure(str);

      expect(hasClosingEnclosures).toBe(true);
    });

    it('should return true if the string has multiple opening enclosures', () => {
      const str = 'some string with a bunch of closing brackets ]}) )} >] ';
      const hasClosingEnclosures = EnclosuresHelper.hasClosingEnclosure(str);

      expect(hasClosingEnclosures).toBe(true);
    });
  });

  describe(`[getClosingEnclosureFromOpeningEnclosure]`, () => {
    it('should throw if the given opening enclosure is not a valid open enclosure', () => {
      const openingEnclosure = 't';

      expect(() =>
        EnclosuresHelper.getClosingEnclosureFromOpeningEnclosure(openingEnclosure)
      ).toThrow();
    });

    it('should return ) as the closing enclosure for (', () => {
      const openingEnclosure = '(';

      const closingEnclosure = EnclosuresHelper.getClosingEnclosureFromOpeningEnclosure(
        openingEnclosure
      );

      expect(closingEnclosure).toBe(')');
    });

    it('should return ] as the closing enclosure for [', () => {
      const openingEnclosure = '[';

      const closingEnclosure = EnclosuresHelper.getClosingEnclosureFromOpeningEnclosure(
        openingEnclosure
      );

      expect(closingEnclosure).toBe(']');
    });

    it('should return } as the closing enclosure for {', () => {
      const openingEnclosure = '{';

      const closingEnclosure = EnclosuresHelper.getClosingEnclosureFromOpeningEnclosure(
        openingEnclosure
      );

      expect(closingEnclosure).toBe('}');
    });

    it('should return > as the closing enclosure for <', () => {
      const openingEnclosure = '<';

      const closingEnclosure = EnclosuresHelper.getClosingEnclosureFromOpeningEnclosure(
        openingEnclosure
      );

      expect(closingEnclosure).toBe('>');
    });
  });

  describe('[getValueInsideEnclosure]', () => {
    it('should throw if there is not a opening enclosure at the given index', () => {
      const str = 'test';

      expect(() => EnclosuresHelper.getValueInsideEnclosure(str, 0)).toThrow();
    });

    it('should return the string from the opening enclosure to the end if no matching closing enclosure is found', () => {
      const expectedValue = ' some text after opening enclosure ';
      const openingEnclosure = '(';
      const str = `test with ${openingEnclosure}${expectedValue}`;

      const value = EnclosuresHelper.getValueInsideEnclosure(str, str.indexOf(openingEnclosure));

      expect(value).toBe(expectedValue);
    });

    it('should return the string inside the enclosures when found', () => {
      const expectedValue = ' some text after opening enclosure ';
      const openingEnclosure = '(';
      const str = `test with ${openingEnclosure}${expectedValue}) some extra text`;

      const value = EnclosuresHelper.getValueInsideEnclosure(str, str.indexOf(openingEnclosure));

      expect(value).toBe(expectedValue);
    });
  });
});
