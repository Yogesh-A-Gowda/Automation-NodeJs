import { Selector, Role, t } from 'testcafe';

import { config } from "../config.js";

const testUser = Role(`${config.URL}/app/login`, async t => {
    const usernameField = Selector('#login-form-username');
    const passwordField = Selector('#login-form-password');
    const loginButton = Selector('#\\:r2\\:');

    await t
        .typeText(usernameField, config.USER)
        .typeText(passwordField, config.PASSWORD)
        .click(loginButton);
}, { preserveUrl: true });

// Login Function for Reuse
async function login(t) {
    await t.useRole(testUser);
}

fixture `Negative Test`
    .page `${config.URL}/app/admin/master/org`
    .beforeEach(async t => {
        await t.setTestSpeed(0.1);
        await login(t)
    });
test('Submit button should be disabled', async t => {
        await t.navigateTo(`${config.URL}/app/employee/task-management/tasks`);
    
        const AddTask = Selector('#root button').withText('Add Task');
        await t.click(AddTask);
    
        const submitButtonEnabled = Selector('#root button').withText('Submit'); // Enabled button
        // const submitButtonDisabled = Selector('#root div').withText('Submit'); // Disabled button
    
        // Ensure Submit Button is Disabled Initially
        const isSubmitEnabledInitially = await submitButtonEnabled.exists;
        console.log("Is Submit Button Enabled Initially?", isSubmitEnabledInitially);
    
        
        await t.expect(isSubmitEnabledInitially).notOk(
            'Submit button should be disabled initially, but it is enabled!'
        );
    });

    test('Error message check', async t=> {

        await t.navigateTo(`${config.URL}/app/employee/task-management/tasks`);
        
        const AddTask = Selector('#root button').withText('Add Task');
        await t.click(AddTask);
    
        const supCatDropDown = Selector('#\\:r2\\:');
        const subCatDropDown = Selector('#\\:r4\\:');
        const taskName = Selector('#task-name-input');
        const assignedTo = Selector('#\\:rb\\:');
        const priority = Selector('#\\:rf\\:');
        const dueDate = Selector('#\\:rh\\:');
        const description = Selector('#root .ql-editor.ql-blank');
        const errorMessages = Selector('#root p').withText('Field is required');
    
    
        const submitButtonEnabled = Selector('#root button').withText('Submit'); // Enabled button
       // const submitButtonDisabled = Selector('#root div').withText('Submit'); // Disabled button
    
        // Ensure Submit Button is Disabled Initially
        const isSubmitEnabledInitially = await submitButtonEnabled.exists;
        console.log("Is Submit Button Enabled Initially?", isSubmitEnabledInitially);
        if (isSubmitEnabledInitially) {
            console.log("Clicking Submit even though it should have been disabled...");
            await t.click(submitButtonEnabled);
        }
    
        await t.expect(errorMessages.exists).ok('Validation messages should appear', { timeout: 5000 });
        
        const errorText = await errorMessages.innerText;
        console.log("Captured Validation Errors:", errorText);
    
        await t.expect(supCatDropDown.value).eql('', 'SuperCategory should be empty');
        await t.expect(subCatDropDown.value).eql('', 'SubCategory should be empty');
        await t.expect(taskName.value).eql('', 'Task-Name should be empty');
        await t.expect(assignedTo.value).eql('', 'AssignedTo should be empty');
        await t.expect(priority.value).eql('', 'Priority should be empty');
        await t.expect(dueDate.value).eql('', 'Due-Date should be empty');
        await t.expect(description.textContent).eql('', 'Description should be empty');
    
    
    });

test('Reviewer-Field Negative Test', async t=> {
    await t.navigateTo(`${config.URL}/app/employee/task-management/tasks`);
        
    const AddTask = Selector('#root button').withText('Add Task');
    await t
        .click(AddTask)

    const errorMessages = Selector('#root p').withText('reviewer field must have at least 1 items')
    const reviewer = Selector('#\\:rd\\:')


    const submitButtonEnabled = Selector('#root button').withText('Submit');
    const isSubmitEnabledInitially = await submitButtonEnabled.exists;
     console.log("Is Submit Button Enabled Initially?", isSubmitEnabledInitially);

     if (isSubmitEnabledInitially) {
         console.log("Clicking Submit even though it should have been disabled...");
         await t
            .click(submitButtonEnabled)
            .debug()

     }
 
    await t.expect(errorMessages.exists).ok('Validation messages should appear', { timeout: 5000 });

    

    const errorText = await errorMessages.innerText;
    console.log("Captured Validation Errors:", errorText);

    await t.expect(reviewer.value).eql('', 'Reviewer should be empty');


})