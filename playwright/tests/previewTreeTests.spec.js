const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login();
    await studiesPage.goto();
    await studiesPage.clickNewStudy();
});

test('Create a basic tree and go through the preview of the tree checking that the prompts are as expected and that elements can be selected', async ({studiesPage, previewPage}) => {
    await studiesPage.clickPreviewButtonForFirstTableRow();
    await expect(previewPage.header).toContainText('Default Tree Test Title');
    await expect(previewPage.taskNum).toContainText('Task 1 of 2');
    await expect(previewPage.taskQuestion).toContainText('Where is the Apples?');
    await previewPage.selectApple();
    await previewPage.nextConfirm();
    await expect(previewPage.taskNum).toContainText('Task 2 of 2');
    await expect(previewPage.taskQuestion).toContainText('Where is the Bacon?');
    await previewPage.selectBacon();
    await previewPage.finishConfirm();
    await expect(studiesPage.header).toContainText('Studies');
});

test('Preview page give up button functionality', async ({studiesPage, previewPage}) => {
    await studiesPage.clickPreviewButtonForFirstTableRow();
    await expect(previewPage.header).toContainText('Default Tree Test Title');
    await expect(previewPage.taskNum).toContainText('Task 1 of 2');
    await expect(previewPage.taskQuestion).toContainText('Where is the Apples?');
    await previewPage.selectApple();
    await previewPage.giveUpConfirm();
    await expect(previewPage.taskNum).toContainText('Task 2 of 2');
    await expect(previewPage.taskQuestion).toContainText('Where is the Bacon?');
    await previewPage.selectBacon();
    await previewPage.giveUpConfirm();
    await expect(studiesPage.header).toContainText('Studies');
});