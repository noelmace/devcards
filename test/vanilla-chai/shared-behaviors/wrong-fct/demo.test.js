import { User, Admin } from '../user.js';
import * as shared from './shared.js';

import { expect } from '@bundled-es-modules/chai';

let user;

describe('wrong function - should fail', () => {
  describe('User', () => {
    beforeEach(() => {
      user = new User('tobi', 'holowaychuk');
    });

    shared.shouldBehaveLikeAUser(user);
  });

  describe('Admin', () => {
    beforeEach(() => {
      user = new Admin('tobi', 'holowaychuk');
    });

    shared.shouldBehaveLikeAUser(user);

    it('should be an .admin', () => {
      expect(user.admin).to.be.true;
    });
  });
});
