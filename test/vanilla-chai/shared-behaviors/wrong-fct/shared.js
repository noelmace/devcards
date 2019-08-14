import { expect } from '@bundled-es-modules/chai';

export const shouldBehaveLikeAUser = user => {
  it('should have .name.first', () => {
    expect(user.name.first).to.equal('tobi');
  });

  it('should have .name.last', function() {
    expect(user.name.last).to.equal('holowaychuk');
  });

  describe('.fullname()', () => {
    it('should return the full name', () => {
      expect(user.fullname()).to.equal('tobi holowaychuk');
    });
  });
};
