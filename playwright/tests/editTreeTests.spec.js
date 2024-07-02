const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login('admin','admin');
    await studiesPage.goto();
});

//This test may need a rework as title name is not dynamic and if ran several times it kicks off due to the same names
test('Edit tree test title and confirm changes are saved', async ({studiesPage, editTreeTestPage}) => {
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle('Changed Title');

    await expect(studiesPage.header).toContainText('Studies');
    await studiesPage.namedRow('Changed Title')
    await expect(editTreeTestPage.editTestTitle).toHaveValue('Changed Title');
});

test('Tree Test Options', async ({studiesPage, editTreeTestPage}) => {
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle('Tree Test Options Test');
    await studiesPage.clickEditButtonForFirstTableRow('Tree Test Options Test');
    await editTreeTestPage.selectableParentsCheckbox.click();
    await  editTreeTestPage.showSiblingsCheckbox.click();
    await editTreeTestPage.submitButton.click();
    await expect(studiesPage.header).toContainText('Studies');
    await studiesPage.clickEditButtonForFirstTableRow('Tree Test Options Test');
    await expect(editTreeTestPage.selectableParentsCheckbox).toBeChecked();
    await expect(editTreeTestPage.showSiblingsCheckbox).toBeChecked();
});

test('Tree Test Status', async ({studiesPage, editTreeTestPage}) => {
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.submitButton.click();
    await expect(studiesPage.fr).toContainText('Accepting Responses');
});

test('Find LastRow', async ({studiesPage, editTreeTestPage}) => {
    await studiesPage.clickNewStudy();
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle('Last Row Test');
    await studiesPage.clickEditButtonForFirstTableRow('Last Row Test');
    await editTreeTestPage.submitButton.click();
    await studiesPage.namedRow('Last Row Test');
    await editTreeTestPage.fillLastRow('I am a string');
    await editTreeTestPage.clickAddAnswerButton();
    await editTreeTestPage.submitButton.click();
    await studiesPage.namedRow('Last Row Test');
    await editTreeTestPage.answerText('I am a string');
    await expect(editTreeTestPage.newAnswer).toContainText('false');
});

test('Confirm tree table adds nodes', async ({studiesPage, editTreeTestPage}) => {
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.expandTableAndAddNodes();
    await expect(editTreeTestPage.nodeTree).toContainText('New Item');
    await expect(editTreeTestPage.nodeTree).toContainText('New Root Item');
});
