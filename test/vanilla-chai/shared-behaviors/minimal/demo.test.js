import { User, Admin } from '../user.js';
import * as shared from './shared.js';
import { expect } from '@bundled-es-modules/chai';

let user;

describe('inside callbackfs - minimal', () => {
  describe('User', () => {
    beforeEach(() => {
      user = new User('tobi', 'holowaychuk');
    });

    it('should have .name.first', () => {
      shared.shouldHaveNameFirst(user);
    });

    it('should have .name.last', () => {
      shared.shouldHaveNameLast(user);
    });

    describe('.fullname()', () => {
      it('should return the full name', () => {
        shared.fullNameShouldReturnFullName(user);
      });
    });
  });

  describe('Admin', () => {
    beforeEach(() => {
      user = new Admin('tobi', 'holowaychuk');
    });

    it('should have .name.first', () => {
      shared.shouldHaveNameFirst(user);
    });

    it('should have .name.last', () => {
      shared.shouldHaveNameLast(user);
    });

    describe('.fullname()', () => {
      it('should return the full name', () => {
        shared.fullNameShouldReturnFullName(user);
      });
    });

    it('should be an .admin', () => {
      expect(user.admin).to.be.true;
    });
  });
});
