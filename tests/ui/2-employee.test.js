import { Selector, Role, t } from 'testcafe';

import { config } from "../config.js"; 

let TemptaskName = 'Yogesh'
const testUser = Role(`${config.URL}/app/login`, async t => {
    const usernameField = Selector('#login-form-username');
    const passwordField = Selector('#login-form-password');
    const loginButton = Selector('#\\:r2\\:'); // Login button selector

    await t
        .typeText(usernameField, config.USER)
        .typeText(passwordField, config.PASSWORD)
        .click(loginButton);
}, { preserveUrl: true });

// Login Function for Reuse
async function login(t) {
    await t.useRole(testUser);
}

fixture `Employee View Tests`
    .page `${config.URL}/app/admin/master/org`
    .beforeEach(async t => {
        await t.setTestSpeed(0.1);
        await login(t)
    });

test('Switch to Employee View', async t => {
    const kebabMenu = Selector('header [class^="MuiButtonBase-root MuiIconButton-root MuiIconButto"]').nth(1);
    await t.click(kebabMenu);
    //await t.debug();
    const switchToEmployeeView = Selector('#account-menu li').withText('Switch to Employee');
    await t.click(switchToEmployeeView);

    await t.expect(await t.eval(() => window.location.href))
        .contains(`${config.URL}/app/employee/task-management/tasks`);
});
