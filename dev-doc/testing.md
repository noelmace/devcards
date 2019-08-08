# Testing

## Trends (August '19)

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

## @open-wc/testing

Karma + Mocha + Chai + Sinon + helpers

See [open-wc.org/testing](https://open-wc.org/testing).

## vanilla-chai

Karma + Mocha + Chai without any helpers. Inspired by open-wc, off course.
Only @open-wc/testing for Karma configuration, as there isn't anything special to say about this part.

## Karma/Jasmine

Well, I love jasmine, even if it's not the trendiest solution right now.
Just for comparison with the other ones.

## Showroom

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

## web-component-tester by Polymer

Relise too heavily on HTML Imports & Polymer Web Components principles to make it useful when you want to test vanilla
or lit-element web components.

It also has "quite a lot dependencies", and "there doesn't seem to be any progress towards (potentially more
lightweight) 7.0.0 version" - [quoted from
web-padawan](https://github.com/Polymer/lit-element/issues/652#issuecomment-483141404).

After some quick tests here, I therefore just drop the idea to use it here.
