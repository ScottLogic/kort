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

test('Unique link give up results page test', async ({ studiesPage, resultsPage, editTreeTestPage, treeTestStudy}) => {
    await studiesPage.clickNewStudy();

    const userName = "uniqueGiveUp";
    const testName = "ResultPage GiveUp Link Test";

    //Sets up unique link
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testName);
    await studiesPage.clickEditButtonForFirstTableRow(testName);
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.uniqueParticipantLinkRadioButton.click();
    await editTreeTestPage.addParticipantName(userName); 
    await editTreeTestPage.submitButton.click();

    //Navigate to page again after saving
    await studiesPage.clickEditButtonForFirstTableRow(testName);

    //Taking the unique URL from the page, and passing it to the preview page
    await treeTestStudy.goto(await editTreeTestPage.copyUniqueLink(userName));

    //Runs through tree tests
    //First question
    await expect(treeTestStudy.header).toContainText(testName);
    await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
    await treeTestStudy.giveUpButton.click();
    await treeTestStudy.modalConfirmGiveUpButton.click();

    //Second question
    await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
    await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
    await treeTestStudy.giveUpButton.click();
    await treeTestStudy.modalConfirmGiveUpButton.click();

    //Confirmation message
    await expect(treeTestStudy.thankYouMessage).toContainText('Thank you.');

    //Navigate to check results
    await studiesPage.clickResultsButtonForFirstTableRow(testName);

    //Navigate back to the studies table, and view results for the test
    await studiesPage.goto();
    await studiesPage.clickResultsButtonForFirstTableRow(testName);

    //Results page assertions
    const answerOne = 'n/a';
    const answerTwo = 'n/a';
    await resultsPage.headerText(testName);
    await expect(resultsPage.header).toContainText(testName);
    await expect(resultsPage.responseCounter).toContainText('1');
    await resultsPage.responses(userName);
    await resultsPage.dataByResponse(userName, answerOne, answerTwo);
    await expect(resultsPage.dataNameCell).toContainText(userName);

    //As both answers are the same in this test, we need to specify the first element, and then the second
    await expect(resultsPage.task1Cell.first()).toContainText(answerOne);
    await expect(resultsPage.task2Cell.nth(1)).toContainText(answerTwo);

    await resultsPage.responsesByTask('Where is the Apples?');
    await expect(resultsPage.taskCell).toContainText(answerOne);
    await expect(resultsPage.taskCell).toContainText('1 of 1');

    await resultsPage.responsesByTask('Where is the Bacon?');
    await expect(resultsPage.taskCell).toContainText(answerTwo);
    await expect(resultsPage.taskCell).toContainText('1 of 1');

        //Delete Studuies
        await studiesPage.goto();
        await studiesPage.deleteStudy(testName);
});

test('Unique link Multiple Correct Users', async ({ studiesPage, resultsPage, editTreeTestPage, treeTestStudy}) => {
    await studiesPage.clickNewStudy();

    const users = ["UserOne", "UserTwo"];
    const testName = "ResultPage Multiple Correct User";

    //Sets up unique link
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testName);
    await studiesPage.clickEditButtonForFirstTableRow(testName);
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.uniqueParticipantLinkRadioButton.click();
    for(let user of users) {
        await editTreeTestPage.addParticipantName(user) ;
    }

    await editTreeTestPage.submitButton.click();

    for(let user of users) {
        //Navigate to page again after saving
        await studiesPage.clickEditButtonForFirstTableRow(testName);

        //Taking the unique URL from the page, and passing it to the preview page
        await treeTestStudy.goto(await editTreeTestPage.copyUniqueLink(user));

        //Runs through tree tests
        //First question
        await expect(treeTestStudy.header).toContainText(testName);
        await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
        await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
        await treeTestStudy.selectNode("Fruits","Apple");
        await treeTestStudy.nextConfirm();

        //Second question
        await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
        await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
        await treeTestStudy.selectNode('Meats', 'Bacon');
        await treeTestStudy.finishConfirm();

        //Confirmation message
        await expect(treeTestStudy.thankYouMessage).toContainText('Thank you.');
        await studiesPage.goto();
    }

    //Navigate back to the studies table, and view results for the test
    await studiesPage.goto();
    await studiesPage.clickResultsButtonForFirstTableRow(testName);

    //Results page assertions
    const answerOne = 'Fruits/Apple';
    const answerTwo = 'Meats/Bacon';
    await resultsPage.headerText(testName);
    await expect(resultsPage.header).toContainText(testName);
    await expect(resultsPage.responseCounter).toContainText('2');

    for(let user of users) {
        await resultsPage.responses(user);
        await resultsPage.dataByResponse(user, answerOne, answerTwo);
        await expect(resultsPage.dataNameCell).toContainText(user);
        await expect(resultsPage.task1Cell).toContainText(answerOne);
        await expect(resultsPage.task2Cell).toContainText(answerTwo);
    }

    await resultsPage.responsesByTask('Where is the Apples?');
    await expect(resultsPage.taskCell).toContainText(answerOne);
    await expect(resultsPage.taskCell).toContainText('2 of 2');

    await resultsPage.responsesByTask('Where is the Bacon?');
    await expect(resultsPage.taskCell).toContainText(answerTwo);
    await expect(resultsPage.taskCell).toContainText('2 of 2');

    //Delete Studuies
    await studiesPage.goto();
    await studiesPage.deleteStudy(testName);
});

test('Unique link Multiple Incorrect Users', async ({ studiesPage, resultsPage, editTreeTestPage, treeTestStudy}) => {
    await studiesPage.clickNewStudy();

    const users = ["UserOne", "UserTwo"];
    const testName = "ResultPage Multiple Incorrect User";

    //Sets up unique link
    await studiesPage.clickEditButtonForFirstTableRow();
    await expect(editTreeTestPage.header).toContainText('Edit Tree Test');
    await editTreeTestPage.changeTestTitle(testName);
    await studiesPage.clickEditButtonForFirstTableRow(testName);
    await editTreeTestPage.acceptResponses.click();
    await editTreeTestPage.uniqueParticipantLinkRadioButton.click();
    for(let user of users) {
        await editTreeTestPage.addParticipantName(user) ;
    }

    await editTreeTestPage.submitButton.click();

    for(let user of users) {
        //Navigate to page again after saving
        await studiesPage.clickEditButtonForFirstTableRow(testName);

        //Taking the unique URL from the page, and passing it to the preview page
        await treeTestStudy.goto(await editTreeTestPage.copyUniqueLink(user));

        //Runs through tree tests
        //First question
        await expect(treeTestStudy.header).toContainText(testName);
        await expect(treeTestStudy.taskNum).toContainText('Task 1 of 2');
        await expect(treeTestStudy.taskQuestion).toContainText('Where is the Apples?');
        await treeTestStudy.selectNode('Meats', 'Bacon');
        await treeTestStudy.nextConfirm();

        //Second question
        await expect(treeTestStudy.taskNum).toContainText('Task 2 of 2');
        await expect(treeTestStudy.taskQuestion).toContainText('Where is the Bacon?');
        await treeTestStudy.selectNode("Fruits","Apple");
        await treeTestStudy.finishConfirm();

        //Confirmation message
        await expect(treeTestStudy.thankYouMessage).toContainText('Thank you.');
        await studiesPage.goto();
    }

    //Navigate back to the studies table, and view results for the test
    await studiesPage.goto();
    await studiesPage.clickResultsButtonForFirstTableRow(testName);

    //Results page assertions
    const answerOne = 'Meats/Bacon';
    const answerTwo = 'Fruits/Apple';
    await resultsPage.headerText(testName);
    await expect(resultsPage.header).toContainText(testName);
    await expect(resultsPage.responseCounter).toContainText('2');

    for(let user of users) {
        await resultsPage.responses(user);
        await resultsPage.dataByResponse(user, answerOne, answerTwo);
        await expect(resultsPage.dataNameCell).toContainText(user);
        await expect(resultsPage.task1Cell).toContainText(answerOne);
        await expect(resultsPage.task2Cell).toContainText(answerTwo);
    }

    await resultsPage.responsesByTask('Where is the Apples?');
    await expect(resultsPage.taskCell).toContainText(answerOne);
    await expect(resultsPage.taskCell).toContainText('2 of 2');

    await resultsPage.responsesByTask('Where is the Bacon?');
    await expect(resultsPage.taskCell).toContainText(answerTwo);
    await expect(resultsPage.taskCell).toContainText('2 of 2');

    //Delete Studuies
    await studiesPage.goto();
    await studiesPage.deleteStudy(testName);
});