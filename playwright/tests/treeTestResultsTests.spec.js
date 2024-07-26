const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login('admin','admin');
    await studiesPage.goto();

});

test('Unique link results page test', async ({ studiesPage, resultsPage, editTreeTestPage, treeTestStudy}) => {
    const testTitle = 'ResultPage Link Test';
    await studiesPage.clickNewStudy();

    //Sets up unique link
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.uniqueParticipantLinkRadioButton.click();
    await editTreeTestPage.addParticipantName('Name'); 
    await editTreeTestPage.submitButton.click();
    
    //Navigate to page again after saving
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);

    //Taking the unique URL from the page, and passing it to the preview page
    await treeTestStudy.goto(await editTreeTestPage.copyUniqueLink('Name'));

    //Runs through tree tests
    await expect(treeTestStudy.header).toContainText(testTitle);
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectNode("Fruits","Apple");
    await treeTestStudy.nextConfirm();
    
    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectNode('Meats', 'Bacon');
    await treeTestStudy.finishConfirm();
    await expect(treeTestStudy.thankYouMessage).toContainText('Thank you.');

    await studiesPage.goto();

    //Results page assertions
    await studiesPage.clickResultsButtonForFirstTableRow(testTitle);
    await resultsPage.headerText(testTitle);
    await expect(resultsPage.header).toContainText('Results for ' + testTitle);
    await expect(resultsPage.responseCounter).toContainText('1');
    await resultsPage.responses('Name');
    await expect(resultsPage.nameCell).toContainText('Name');
    await resultsPage.dataByResponse('Name', 'Fruits/Apple', 'Meats/Bacon');
    await expect(resultsPage.dataNameCell).toContainText('Name');
    await expect(resultsPage.task1Cell).toContainText('Fruits/Apple');
    await expect(resultsPage.task2Cell).toContainText('Meats/Bacon');
    await resultsPage.responsesByTask('Where is the Apples?');
    await expect(resultsPage.taskCell).toContainText('Where is the Apples?');
    await resultsPage.responsesByTask('Where is the Bacon?');
    await expect(resultsPage.taskCell).toContainText('Where is the Bacon?');

    //Delete Studuies
    await studiesPage.goto();
    await studiesPage.deleteStudy(testTitle);
});