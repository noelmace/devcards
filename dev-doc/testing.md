# Testing

## Tools

### Trends (August '19)

[Google Trends](https://trends.google.fr/trends/explore?date=2013-07-08%202019-08-08&q=chaijs,jasminejs,mochajs,jestjs)

| Tool    | :octocat: :star: | npm weekly downloads | last release     | contribs (May-July '19)        |
|---------|---------------------|----------------------|------------------|--------------------------------|
| Jasmine | ~ 15 000            | ~1,2 million         | 3.4.0, April '19 | 53 commits by 7 contributors   |
| Chai    | ~  6 500            | ~2,5 million         | 4.2.0, Sept. '18 | 3 commits by 2 contributors    |
| Mocha   | ~ 18 000            | ~2,8 millions        | 6.2.0, July  '19 | 24 commits by 10 contributors  |
| Jest    | ~ 26 893            | ~4,3 millions        | 24.8.0, May  '19 | 44 commits by 10 contributors  |
| @open-wc/testing | (monorepo) 433 | ~1 500           | 2.2.8, Aug.  '19 | 9 commits by 5 contributors    |
| Showroom | 82                 | 15                   | 0.9.3, Dec.  '18 | 3 commits by 1 contributor     |
| web-component-tester | (monorepo) 310 | ~15 000      | 6.9.2, Dec.  '18 | 8 commits by 2 contributors    |

### @open-wc/testing

Karma + Mocha + Chai + Sinon + helpers

See [open-wc.org/testing](https://open-wc.org/testing).

### vanilla-chai

Karma + Mocha + Chai without any helpers. Inspired by open-wc, off course.
Only @open-wc/testing for Karma configuration, as there isn't anything special to say about this part.

### Karma/Jasmine

Well, I love jasmine, even if it's not the trendiest solution right now.
Just for comparison with the other ones.

### Showroom

As you're looking for information about unit testing with Web Components,
[Showroom](https://github.com/eavichay/showroom) will appear at one time or another.

However, as I write this lines, its last version is 0.9.2, which was released in December 2018 (8 months ago).
And no major contribution to it was made since.

It was created by [Avichay Eyal](https://twitter.com/eavichay), the author of [Slim.js](https://slimjs.com).
As he is the only major contributor to these two very good projects, their maintenance depends heavily on him.
Yet, it seems he doesn't have time for that right now, unfortunately.

Therefor, I can't recommend, for now, to use it for your WC project.
This is why I didn't include a demo in these one.

But I can recommend you to check out [Testing Web Components with showroom](https://medium.com/@eavichay/testing-web-components-fe48a49117f7)
for more information :wink::thumbsup:

### web-component-tester by Polymer

Relise too heavily on HTML Imports & Polymer Web Components principles to make it useful when you want to test vanilla
or lit-element web components.

It also has "quite a lot dependencies", and "there doesn't seem to be any progress towards (potentially more
lightweight) 7.0.0 version" - [quoted from
web-padawan](https://github.com/Polymer/lit-element/issues/652#issuecomment-483141404).

After some quick tests here, I therefore just drop the idea to use it here.

## Tips & Caveats

### custom elements registration & mocks

When developing Web Components, calling `customElements.define` directly in the component source file is the more common way to go. This way,
we can see a WC js file as an autonomous definition, instead of just defining its behavior. In other words, importing these files add the whole element to our window context without any other step needed.

> FYI, lit-element `@CustomElement` decorator calls directly `customElements.define`: https://github.com/Polymer/lit-element/blob/v2.2.1/src/lib/decorators.ts#L66-L75

Here is one of the main reasons for that: as you can't define more than one custom element for a given selector, this selector is the **unique** identifier of your Web Component! So, registering it right away can't be an issue, right?

Well, it's an issue when you think about on testing and mocking! As you may want to mock a Web Component for some of your tests, or test test various scenarios of the registration process, you'll see that you can't directly. Because of this practice, and especially because you can't scope custom elements registrations. This [may change](https://github.com/w3c/webcomponents/issues/716) in the future, but for now, we're stuck with that.

> Note that all discussions related to custom elements [unregistration](https://github.com/w3c/webcomponents/issues/152) have been closed.

So, what to do? If you ask me, I think there isn't any satisfying solution right now. You could:

- use iframes
  - via [karma-iframe](https://github.com/sabberworm/karma-iframes) (which has a lot of [drawbacks](https://github.com/sabberworm/karma-iframes#are-there-any-drawbacks) and doesn't seem to be [actively maintained](https://github.com/sabberworm/karma-iframes/graphs/contributors)), as the [discussion about this feature in Karma](https://github.com/karma-runner/karma/issues/412) doesn't seem to go anywhere
  - or web-component-tester, which has its own drawbacks (see the related chapter)
- and stop registering Custom Elements in their source file
  - you could register Custom Elements globally, and then "inject" selectors in the components which depends on them ... but doing so, you'll make your code and workflow way more complexe and difficult to read, use and understand

So, for now, my recommandation is the following: forget about mocking your custom elements 😆 Benefits are way below the costs!
Of course, this means you must pay more attention to your components responsibilities, independence, and always keep the focus on testing the component itself, and not its children components. You can find examples in `test/open-wc/repetition.test.ts`.
