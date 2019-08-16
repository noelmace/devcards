export function shouldBehaveLikeAUser(user) {
  it('should have .name.first', () => {
    user.name.first.should.equal('tobi');
  })

  it('should have .name.last', () => {
    user.name.last.should.equal('holowaychuk');
  })

  describe('.fullname()', () => {
    it('should return the full name', () => {
      user.fullname().should.equal('tobi holowaychuk');
    })
  })
};
