import { expect } from '@bundled-es-modules/chai';

export const shouldHaveNameFirst = (user) => {
  expect(user.name.first).to.equal('tobi');
};

export const shouldHaveNameLast = (user) => {
  expect(user.name.last).to.equal('holowaychuk');
};

export const fullNameShouldReturnFullName = (user) => {
  expect(user.fullname()).to.equal('tobi holowaychuk');
};

