var TEST_URL = 'http://dev.atlas-admin.mbst.tv/#/applications/hkxh';

casper.test.begin('Clicking "View Terms" shows a modal', 3, function (test) {
  casper.start(TEST_URL, function () {
    test.assertTextExists('Popular Repositories', 'We\'re on the Popular Repositories page');
    test.assertExists('.repo-list');

    test.assert(firstVal > secondVal, 'first list element is greater than second');
  })
  .run(function () {
    test.done();
  });
});