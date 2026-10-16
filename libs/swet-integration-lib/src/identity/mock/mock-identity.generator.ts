export class MockIdentityRecord {
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  phone: string;
}

export class MockIdentityGenerator {
  static isNotFound(idNumber: string): boolean {
    return idNumber.endsWith(MockIdentityGenerator.NOT_FOUND_SUFFIX);
  }

  // djb2-based so the same id number always maps to the same seed
  static generate(idNumber: string): MockIdentityRecord {
    const seed = MockIdentityGenerator.hash(idNumber);

    const gender = seed % 2 === 0 ? 'FEMALE' : 'MALE';
    const firstNames =
      gender === 'FEMALE'
        ? MockIdentityGenerator.FEMALE_FIRST_NAMES
        : MockIdentityGenerator.MALE_FIRST_NAMES;

    const firstName = firstNames[Math.floor(seed / 2) % firstNames.length];
    const lastName =
      MockIdentityGenerator.LAST_NAMES[
        Math.floor(seed / 2 / firstNames.length) %
          MockIdentityGenerator.LAST_NAMES.length
      ];

    const age = 18 + (seed % 48);
    const birthYear = new Date().getFullYear() - age;
    const month = String(1 + (seed % 12)).padStart(2, '0');
    const day = String(1 + (seed % 28)).padStart(2, '0');
    const dateOfBirth = `${birthYear}-${month}-${day}`;

    const phoneSuffix = String(seed % 100_000_000).padStart(8, '0');
    const phone = `080${phoneSuffix}`;

    return { firstName, lastName, gender, dateOfBirth, phone };
  }

  private static hash(value: string): number {
    let hash = 5381;

    for (let i = 0; i < value.length; i++) {
      hash = (hash * 33) ^ value.charCodeAt(i);
    }

    return hash >>> 0;
  }

  public static readonly FEMALE_FIRST_NAMES = [
    'Ngozi',
    'Adaeze',
    'Folake',
    'Amaka',
    'Chioma',
    'Aisha',
    'Yemisi',
    'Bisola',
    'Halima',
    'Temitope',
    'Ifeoma',
    'Zainab',
    'Oluchi',
    'Funmilayo',
    'Nkechi',
    'Damilola',
    'Grace',
    'Joy',
    'Blessing',
    'Charlotte',
    'Eleanor',
    'Naomi',
    'Rachel',
    'Vivian',
  ];

  private static readonly MALE_FIRST_NAMES = [
    'Chinedu',
    'Emeka',
    'Tunde',
    'Segun',
    'Ifeanyi',
    'Musa',
    'Kunle',
    'Bayo',
    'Obinna',
    'Chukwuemeka',
    'Ibrahim',
    'Olumide',
    'Uche',
    'Gbenga',
    'Yusuf',
    'Chidi',
    'Daniel',
    'Samuel',
    'Peter',
    'Trevor',
    'Marcus',
    'Julian',
    'Nathan',
    'Victor',
  ];

  private static readonly LAST_NAMES = [
    'Makinde',
    'Okafor',
    'Adeyemi',
    'Balogun',
    'Nwosu',
    'Eze',
    'Okonkwo',
    'Lawal',
    'Ogundipe',
    'Bello',
    'Adebayo',
    'Chukwu',
    'Danjuma',
    'Ekpo',
    'Fashola',
    'Ibrahim',
    'Nwachukwu',
    'Obi',
    'Oyelaran',
    'Sanusi',
    'Uzoma',
    'Yakubu',
    'Bennett',
    'Carter',
    'Fletcher',
    'Harding',
    'Mercer',
    'Preston',
    'Sinclair',
    'Whitfield',
  ];

  private static readonly NOT_FOUND_SUFFIX = '0000';
}
