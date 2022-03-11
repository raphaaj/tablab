/**
 * A tablature note.
 */
export class Note {
  /**
   * The fret that should be pressed in order to play the note.
   */
  fret: string;
  /**
   * The string number of the tablature element to write the note.
   */
  string: number;

  /**
   * Creates a note instance to be written to a tablature element.
   * @param string - The string number of the tablature element to write the note.
   * @param fret - The fret that should be pressed in order to play the note.
   *
   * @example
   * const note = new Note(1, "0")
   * // String number 1, open string
   *
   * @example
   * const note = new Note(2, "3")
   * // String number 2, third fret
   *
   * @example
   * const note = new Note(4, "3/5")
   * // String number 4, third fret with a slide up to the fifth fret
   */
  constructor(string: number, fret: string) {
    this.string = string;
    this.fret = fret;
  }
}
