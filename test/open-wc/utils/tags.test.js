import { expect } from '@open-wc/testing';

import { css } from '../../../src/utils/tags.js';

describe('css literal template tag', () => {
  let template;
  let cssRslt;

  const testIdentity = () => {
    it('the result is equal to the given template', () => {
      expect(cssRslt).to.equal(template);
    });
  };

  describe('When: there is more strings than expressions', () => {
    beforeEach(() => {
      template = `.foo { color: ${'bar'}; color: red; }`;
      // prettier-ignore
      cssRslt = css`.foo { color: ${'bar'}; color: red; }`;
    });

    testIdentity();
  });

  describe('When: there is as many strings as expressions', () => {
    beforeEach(() => {
      template = `.foo { color: ${'bar'}; }${'baz'}`;
      // prettier-ignore
      cssRslt = css`.foo { color: ${'bar'}; }${'baz'}`;
    });

    testIdentity();
  });

  describe('When: there is less strings than expressions', () => {
    beforeEach(() => {
      template = `${'bar'}; ${'baz'}`;
      // prettier-ignore
      cssRslt = css`${'bar'}; ${'baz'}`;
    });

    testIdentity();
  });
});
