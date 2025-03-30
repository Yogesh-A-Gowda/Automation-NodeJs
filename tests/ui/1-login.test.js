import { Selector, Role, t } from 'testcafe';
import { config } from "../config"; 

fixture `Login Test` 
        .page `${config.URL}/app/login`

test('Login Test', async t => {
    const usernameField = Selector('#login-form-username');
    const passwordField = Selector('#login-form-password');
    const loginButton = Selector('#\\:r2\\:'); // Login button selector

    await t
        .typeText(usernameField, config.USER)
        .typeText(passwordField, config.PASSWORD)
        .click(loginButton);

            await t.expect(await t.eval(() => window.location.href))
                .contains(`${config.URL}/app/admin/master/org`);
        });