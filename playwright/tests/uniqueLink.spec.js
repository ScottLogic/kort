const { test, expect } = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({ loginPage, studiesPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await studiesPage.goto();
});

test('Unique link test', async ({ studiesPage, editTreeTestPage, treeTestStudy }) => {
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
    await treeTestStudy.goto(uniqueUrl);

    //Runs through tree test for unique link
    await expect(treeTestStudy.header).toContainText('Default Tree Test Title');
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectApple();
    await treeTestStudy.nextConfirm();
    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectBacon();
    await treeTestStudy.finishConfirm();
    await expect(treeTestStudy.thankYouMessage).toContainText('Thank you.');
});