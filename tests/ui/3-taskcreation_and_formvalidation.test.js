import { Selector, Role, t } from 'testcafe';

import { config } from "../config.js";

let TemptaskName = 'Yogesh'
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

fixture `Create Task and validate FORM`
    .page `${config.URL}/app/admin/master/org`
    .beforeEach(async t => {
        await t.setTestSpeed(0.1);
        await login(t)
    });

test('Task Creation',async t => {
    await t.navigateTo(`${config.URL}/app/employee/task-management/tasks`)
    const AddTask = Selector('#root button').withText('Add Task')
    await t.click(AddTask)

    const supCatDropDown = Selector('#\\:r2\\:')
    
    await t
        .click(supCatDropDown)
        .typeText(supCatDropDown,'Listings & Catalogies')
        .pressKey('down')
        .pressKey('enter')
        .pressKey('tab')
        .expect(supCatDropDown.value).notEql('', 'SuperCategory required field should be filled');

    

    const subCatDropDown = Selector('#\\:r4\\:')

    await t
        .click(subCatDropDown)
        .pressKey('down')
        .pressKey('enter')
        .pressKey('tab')
        .expect(supCatDropDown.value).notEql('', 'SubCategory required field should be filled');
  

    const taskName = Selector('#task-name-input')
    await t
        .typeText(taskName,TemptaskName)
        .pressKey('tab')
        .expect(taskName.value).notEql('', 'Task-Name required field should be filled');

    const assignedTo = Selector('#\\:rb\\:')
    await t
        .click(assignedTo)
        .pressKey('down')
        .pressKey('enter')
        .pressKey('tab')
        .expect(assignedTo.value).notEql('', 'AssignedTo required field should be filled');

    const priority = Selector('#\\:rf\\:')
    await t
    .click(priority)
    .pressKey('down')
    .pressKey('enter')
    .pressKey('tab')
    .expect(priority.value).notEql('', 'Priority required field should be filled');

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 10);
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const dueDate = Selector('#\\:rh\\:')
    await t
    .click(dueDate)
    .typeText(dueDate, formattedDate)
    .expect(dueDate.value).notEql('', 'Due-Date required field should be filled');


    const description = Selector('#root .ql-editor.ql-blank') //Selector('#root div div').nth(165).find('div div').nth(5).find('div div form div').nth(58).find('div div div div div').nth(1).find('div p') //#root > div.MuiStack-root.css-1ut4hys > div.MuiStack-root.css-kaqfb8 > div > div > div > div > form > div.MuiBox-root.css-1r9qazs > div > div > div > div > div.ql-container.ql-snow > div.ql-editor > p
    await t
    .click(description)
    .typeText(description, "Test Description")
    .expect(dueDate.value).notEql('', 'Description required field should be filled');

    const reviewer = Selector('#\\:rd\\:')
    await t
    .click(reviewer)
    .pressKey('down')
    .pressKey('down')
    .pressKey('enter')
    .expect(reviewer.exists).ok('At least one reviewer should be selected');

    const submitButtonCheck = Selector('#root div').withText('Submit').nth(8)
    await t
        .click(submitButtonCheck)

    const YesCreate = Selector('button').withText('Yes, create it!')
    await t
        .click(YesCreate)
        .expect(await t.eval(() => window.location.href)).contains(`${config.URL}/app/employee/task-management/tasks`);    
    
})
