const { test, expect } = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({ loginPage, studiesPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await studiesPage.goto();
    await studiesPage.clickNewStudy();
});

test('Create a basic tree and go through the preview of the tree checking that the prompts are as expected and that elements can be selected', async ({ studiesPage, treeTestStudy }) => {
    await studiesPage.clickPreviewButtonForFirstTableRow();
    await expect(treeTestStudy.header).toContainText('Default Tree Test Title');
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectApple();
    await treeTestStudy.nextConfirm();
    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectBacon();
    await treeTestStudy.finishConfirm();
    await expect(studiesPage.header).toContainText('Studies');
});

test('Preview page give up button functionality', async ({ studiesPage, treeTestStudy }) => {
    await studiesPage.clickPreviewButtonForFirstTableRow();
    await expect(treeTestStudy.header).toContainText('Default Tree Test Title');
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.selectApple();
    await treeTestStudy.giveUpConfirm();
    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.selectBacon();
    await treeTestStudy.giveUpConfirm();
    await expect(studiesPage.header).toContainText('Studies');
});