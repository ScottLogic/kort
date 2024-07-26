const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login('admin','admin');
    await studiesPage.goto();
});

test('Edit tree test title and confirm changes are saved', async ({studiesPage, editTreeTestPage}) => {
    const testTitle = 'Changed Title';

    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);

    await expect(studiesPage.header).toContainText('Studies');
    await studiesPage.namedRow(testTitle);
    await expect(editTreeTestPage.editTestTitle).toHaveValue(testTitle);
    
    await studiesPage.goto();
    await studiesPage.deleteStudy(testTitle);
});

test('Tree Test Options', async ({studiesPage, editTreeTestPage}) => {
    const testTitle = 'Tree Test Options Test';

    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);
    await editTreeTestPage.selectableParentsCheckbox.click();
    await editTreeTestPage.showSiblingsCheckbox.click();
    await editTreeTestPage.submitButton.click();
    await expect(studiesPage.header).toContainText('Studies');
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);
    await expect(editTreeTestPage.selectableParentsCheckbox).toBeChecked();
    await expect(editTreeTestPage.showSiblingsCheckbox).toBeChecked();

    await studiesPage.goto();
    await studiesPage.deleteStudy(testTitle);
});

test('Tree Test Status', async ({studiesPage, editTreeTestPage}) => {
    const testTitle = 'Tree Test Status';
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.submitButton.click();
    await expect(studiesPage.fr).toContainText('Accepting Responses');
    
    await studiesPage.deleteStudy(testTitle);
});

test('Find LastRow', async ({studiesPage, editTreeTestPage}) => {
    const testTitle = 'Last Row Test';
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);
    await editTreeTestPage.submitButton.click();
    await studiesPage.namedRow(testTitle);
    await editTreeTestPage.fillLastRow('I am a string');
    await editTreeTestPage.clickAddAnswerButton();
    await editTreeTestPage.submitButton.click();
    await studiesPage.namedRow(testTitle);
    await editTreeTestPage.answerText('I am a string');
    await expect(editTreeTestPage.newAnswer).toContainText('false');

    await studiesPage.goto();
    await studiesPage.deleteStudy(testTitle);
});

test('Confirm tree table adds nodes', async ({studiesPage, editTreeTestPage}) => {
    const testTitle = 'Add Node Test'; 
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testTitle);
    await studiesPage.clickEditButtonForFirstTableRow(testTitle);
    await editTreeTestPage.expandTableAndAddNodes();
    await expect(editTreeTestPage.nodeTree).toContainText('New Item');
    await expect(editTreeTestPage.nodeTree).toContainText('New Root Item');
    await editTreeTestPage.submitButton.click();
    await expect(studiesPage.header).toContainText('Studies');

    await studiesPage.deleteStudy(testTitle);
});
