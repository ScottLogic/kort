const { test, expect } = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({ loginPage, studiesPage }) => {
    await loginPage.goto();
    await loginPage.login('admin','admin');
    await studiesPage.goto();
});

test('Unique link test', async ({ studiesPage, editTreeTestPage, treeTestStudy }) => {
    await studiesPage.clickNewStudy();

    //Sets up unique link
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle('Unique Link Test');
    await studiesPage.clickEditButtonForFirstTableRow('Unique Link Test');
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.uniqueParticipantLinkRadioButton.click();
    await editTreeTestPage.addParticipantName('Name'); 
    await editTreeTestPage.submitButton.click();
    
    //Navigate to page again after saving
    await studiesPage.namedRow('Unique Link Test');

    //Taking the unique URL from the page, and passing it to the preview page
    await treeTestStudy.goto(await editTreeTestPage.copyUniqueLink('Name'));

    //Runs through tree tests
    await expect(treeTestStudy.header).toContainText('Unique Link Test');
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectNode("Fruits","Apple");
    await treeTestStudy.nextConfirm();

    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectNode('Meats', 'Bacon');
    await treeTestStudy.finishConfirm();
    await expect(treeTestStudy.thankYouMessage).toContainText('Thank you.');

    //Delete Study
    await studiesPage.goto();
    await studiesPage.deleteStudy('Unique Link Test');
});