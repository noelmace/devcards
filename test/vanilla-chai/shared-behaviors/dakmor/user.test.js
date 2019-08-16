import { User, Admin } from '../user.js';
import { shouldBehaveLikeAUser } from './helpers.js';

describe.only('by daKmoR', () => {
  describe('User', () => {
    let user;
    beforeEach(() => {
      user = new User('tobi', 'holowaychuk');
    })

    shouldBehaveLikeAUser(user);
  })

  describe('Admin', () => {
    let user;
    beforeEach(() => {
      user = new Admin('tobi', 'holowaychuk');
    })

    shouldBehaveLikeAUser(user);

    it('should be an .admin', () => {
      user.admin.should.be.true;
    });
  })
})


