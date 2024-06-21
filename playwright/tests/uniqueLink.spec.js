const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login();
    await studiesPage.goto();
});

test('Unique link test', async ({studiesPage, editTreeTestPage, previewPage}) => {
    //Sets up unique link
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.submitButton.click();
    await studiesPage.clickEditButtonForFirstTableRow();
    await editTreeTestPage.uniqueParticipantLink.click();
    await editTreeTestPage.addNameForUniqueParticipant.clear();
    await editTreeTestPage.addNameForUniqueParticipant.fill('Name');
    await editTreeTestPage.addUniqueParticipantButton.click();
    await editTreeTestPage.copyUniqueLink('Name');

    //Taking the unique URL from the page, and passing it to the preview page
    var uniqueUrl = await editTreeTestPage.uniqueLink;
    await previewPage.goto(uniqueUrl);
    
    //Runs through tree test for unique link
    await expect(previewPage.header).toContainText('Default Tree Test Title');
    await expect(previewPage.taskNum).toContainText('Task 1 of 2');
    await expect(previewPage.taskQuestion).toContainText('Where is the Apples?');
    await previewPage.selectApple();
    await previewPage.nextConfirm();
    await expect(previewPage.taskNum).toContainText('Task 2 of 2');
    await expect(previewPage.taskQuestion).toContainText('Where is the Bacon?');
    await previewPage.selectBacon();
    await previewPage.finishConfirm();
    await expect(previewPage.thankYouMessage).toContainText('Thank you.');
});