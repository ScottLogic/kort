const { test, expect} = require('../fixtures/pageFixtures');

test.beforeEach('Navigation to studies', async ({loginPage, studiesPage}) => {
    await loginPage.goto();
    await loginPage.login();
    await studiesPage.goto();
    // await studiesPage.clickNewStudy();
});

// test('Edit tree test title and confirm changes are saved', async ({studiesPage, editTreeTestPage}) => {
//     await studiesPage.clickEditButtonForFirstTableRow();
//     await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
//     await editTreeTestPage.editTestTitle.clear();
//     await editTreeTestPage.editTestTitle.fill('Changed Title 3');
//     await editTreeTestPage.submitButton.click();
//     await expect(studiesPage.header).toContainText('Studies');
//     await studiesPage.clickEditButtonForFirstTableRow();
//     await expect(editTreeTestPage.editTestTitle).toHaveValue('Changed Title 3');
// });

// test('Tree Test Options', async ({studiesPage, editTreeTestPage}) => {
//     await studiesPage.clickEditButtonForFirstTableRow();
//     await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
//     await editTreeTestPage.selectableParentsCheckbox.click();
//     await  editTreeTestPage.showSiblingsCheckbox.click();
//     await editTreeTestPage.submitButton.click();
//     await expect(studiesPage.header).toContainText('Studies');
//     await studiesPage.clickEditButtonForFirstTableRow();
//     await expect(editTreeTestPage.selectableParentsCheckbox).toBeChecked();
//     await expect(editTreeTestPage.showSiblingsCheckbox).toBeChecked();
// });

// test('Tree Test Status', async ({studiesPage, editTreeTestPage}) => {
//     await studiesPage.clickEditButtonForFirstTableRow();
//     await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
//     await editTreeTestPage.acceptResponses.click();
//     await editTreeTestPage.submitButton.click();
//     await expect(studiesPage.namedRow('Changed Title 3')).toContainText('Accepting Responses');
// });

    test('Find LastRow', async ({studiesPage, editTreeTestPage}) => {
        await studiesPage.clickEditButtonForFirstTableRow();
        await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
        await editTreeTestPage.fillLastRow('I am a string');
        await editTreeTestPage.addAnswer('I am a string');
    });
