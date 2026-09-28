import {
  feetAndInchesToInches,
  inchesToFeetAndInches,
  inchesToMeters,
  poundsToKilograms,
} from '../src/types/truck';

describe('truck unit conversions', () => {
  it('formats the standard 13 ft 6 in clearance', () => {
    expect(inchesToFeetAndInches(162)).toBe(`13' 6"`);
  });

  it('converts imperial provider values', () => {
    expect(feetAndInchesToInches(13, 6)).toBe(162);
    expect(inchesToMeters(162)).toBe(4.115);
    expect(poundsToKilograms(80000)).toBe(36287);
  });
});
