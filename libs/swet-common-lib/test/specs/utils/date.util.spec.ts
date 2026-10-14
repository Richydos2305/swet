import { DateUtil } from '@swet/common/utils/date.util';

describe('DateUtil', () => {
  describe('toDDMMMYYYY', () => {
    it('formats an ISO date string as DD-MMM-YYYY', () => {
      expect(DateUtil.toDDMMMYYYY('1993-10-03')).toBe('03-Oct-1993');
    });

    it('pads through every month abbreviation correctly', () => {
      expect(DateUtil.toDDMMMYYYY('2024-01-01')).toBe('01-Jan-2024');
      expect(DateUtil.toDDMMMYYYY('2024-12-31')).toBe('31-Dec-2024');
    });
  });
});
