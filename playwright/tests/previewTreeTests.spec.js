const { test, expect } = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({ loginPage, studiesPage }) => {
    await loginPage.goto();
    await loginPage.login('admin','admin');
    await studiesPage.goto();
});

test('Create a basic tree and go through the preview of the tree checking that the prompts are as expected and that elements can be selected', async ({ studiesPage, treeTestStudy, editTreeTestPage }) => {
    const testTitle = 'Preview Test';
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickPreviewButtonForFirstTableRow(testTitle);
    await expect(treeTestStudy.header).toContainText(testTitle);
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectNode("Fruits","Apple");
    await treeTestStudy.nextConfirm();

    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectNode("Meats","Bacon");
    await treeTestStudy.finishConfirm();
    await expect(studiesPage.header).toContainText('Studies');
    
    await studiesPage.deleteStudy(testTitle);
});

test('Preview page give up button functionality', async ({ studiesPage, treeTestStudy, editTreeTestPage }) => {
    const testTitle = 'Preview give up Test'
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickPreviewButtonForFirstTableRow(testTitle);
    await expect(treeTestStudy.header).toContainText(testTitle);
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectNode("Fruits","Apple");
    await treeTestStudy.giveUpConfirm();

    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectNode("Meats","Bacon");
    await treeTestStudy.giveUpConfirm();
    await expect(studiesPage.header).toContainText('Studies');

    await studiesPage.deleteStudy(testTitle);
});