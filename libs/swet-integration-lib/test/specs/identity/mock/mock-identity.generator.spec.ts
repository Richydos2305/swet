import { MockIdentityGenerator } from '@swet/integration/identity/mock/mock-identity.generator';

describe('MockIdentityGenerator', () => {
  it('generates the same identity for the same id number', () => {
    const first = MockIdentityGenerator.generate('12345678901');
    const second = MockIdentityGenerator.generate('12345678901');

    expect(second).toEqual(first);
  });

  it('generates different identities for different id numbers', () => {
    const a = MockIdentityGenerator.generate('12345678901');
    const b = MockIdentityGenerator.generate('10987654321');

    expect(a).not.toEqual(b);
  });

  it('treats an id number ending in 0000 as not found', () => {
    expect(MockIdentityGenerator.isNotFound('12340000')).toBe(true);
    expect(MockIdentityGenerator.isNotFound('12345678901')).toBe(false);
  });
});
