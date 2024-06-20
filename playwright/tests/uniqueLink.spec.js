const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login();
    await studiesPage.goto();
});

test('Unique link test', async ({studiesPage, editTreeTestPage, page, previewPage}) => {
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.uniqueParticipantLink.click();
    await editTreeTestPage.addNameForUniqueParticipant.clear();
    await editTreeTestPage.addNameForUniqueParticipant.fill('Name');
    await editTreeTestPage.addUniqueParticipantButton.click();
    await editTreeTestPage.copyUniqueLink('Name');
    await page.goto('\"'+editTreeTestPage.uniqueLink+'\")');
    // await studiesPage.clickPreviewButtonForFirstTableRow();
    // await expect(previewPage.header).toContainText('Default Tree Test Title');
    // await expect(previewPage.taskNum).toContainText('Task 1 of 2');
    // await expect(previewPage.taskQuestion).toContainText('Where is the Apples?');
    // await previewPage.selectApple();
    // await previewPage.nextConfirm();
    // await expect(previewPage.taskNum).toContainText('Task 2 of 2');
    // await expect(previewPage.taskQuestion).toContainText('Where is the Bacon?');
    // await previewPage.selectBacon();
    // await previewPage.finishConfirm();
    // await expect(studiesPage.header).toContainText('Studies');
});