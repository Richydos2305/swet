export class DateUtil {
  static readonly MONTH_ABBREVIATIONS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /** Formats an ISO `YYYY-MM-DD` date string as `DD-MMM-YYYY`. */
  static toDDMMMYYYY(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}-${DateUtil.MONTH_ABBREVIATIONS[Number(month) - 1]}-${year}`;
  }
}
