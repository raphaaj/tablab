import { StringHelper } from '../../src/helpers/string-helper';

describe(`[${StringHelper.name} extensions]`, () => {
  describe(`[indexOfDifferent]`, () => {
    it('should throw if iteration is 0', () => {
      const str = 'test';

      expect(() => StringHelper.getIndexOfDifferent(str, ' ', 0, 0)).toThrow();
    });

    it('should return -1 if start index is greater than last character index', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, ' ', str.length);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if start index is smaller than the string length negative', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, ' ', -(str.length + 1));

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found', () => {
      const str = 'tttt';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't');

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return -1 if no character diferent than specified is found, while reading from last string index', () => {
      const str = 'tttt';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't', -1, -1);

      expect(indexOfDifferent).toBe(-1);
    });

    it('should return the index of the first character diferent from the one specified', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't');

      expect(indexOfDifferent).toBe(1);
    });

    it('should return the index of the first character diferent from the one specified, while reading from last string index', () => {
      const str = 'test';
      const indexOfDifferent = StringHelper.getIndexOfDifferent(str, 't', -1, -1);

      expect(indexOfDifferent).toBe(2);
    });
  });

  describe('[indexOfMatchingClosingEnclosure]', () => {
    it('should return -1 if opening enclosure index is greater than the string length', () => {
      const str = 'test';

      const idx = StringHelper.getIndexOfMatchingClosingEnclosure(str, str.length);

      expect(idx).toBe(-1);
    });

    it('should throw if opening enclosure index does not contain a valid opening enclosure', () => {
      const str = 'test';

      expect(() => StringHelper.getIndexOfMatchingClosingEnclosure(str, 0)).toThrow();
    });

    it('should return -1 if no matching closing enclosure is found', () => {
      const str = '(test()';

      const idx = StringHelper.getIndexOfMatchingClosingEnclosure(str, 0);

      expect(idx).toBe(-1);
    });

    it('should return the index of the matching closing enclosure if found', () => {
      const str = '(test())()';

      const idx = StringHelper.getIndexOfMatchingClosingEnclosure(str, 0);

      expect(idx).toBe(7);
    });
  });
});
