import { Selector, Role, t } from 'testcafe';

import { config } from "../config.js";

//let TemptaskName = 'Yogesh'
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

fixture `Verify Task in List`
    .page `${config.URL}/app/admin/master/org`
    .beforeEach(async t => {
        await t.setTestSpeed(0.1);
        await login(t)
    });

test('Verify Task in List with Scroll and Loop inside Assertion', async t => {
        // Navigate to the task management page
        await t.navigateTo(`${config.URL}/app/employee/task-management/tasks`);
    
        // Select the parent container of the tasks list
        const taskListContainer = Selector('#root div').withText('Raised').nth(5);
        await t.expect(taskListContainer.exists).ok('Task list container did not appear or is not visible', { timeout: 5000 });
    
        // Select all tasks within the container (refined selector)
        const tasks = taskListContainer.find('div.MuiButtonBase-root.MuiListItemButton-root');
    
        await scrollAndLoadTasks(taskListContainer, tasks);
    
        const taskCount = await tasks.count;
        console.log(`Task list container found. Number of tasks: ${taskCount}`);
    
        // Debugging: Log the text of each task
        for (let i = 0; i < taskCount; i++) {
            const taskText = await tasks.nth(i).innerText;
            console.log(`Task at index ${i}: "${taskText}"`);
        }
        const taskFound = await checkTaskInList(tasks, taskCount, 'Test Task');
        await t.expect(taskFound).ok('Task with name "Test Task" was not found in the list.');
    });
    
    // Helper function to scroll and load tasks
    const scrollAndLoadTasks = async (container, tasksSelector) => {
        let previousCount = 0;
        let currentCount = await tasksSelector.count;
    
        while (previousCount < currentCount) {
            previousCount = currentCount;
            await t.scroll(container, 'bottom');
            await t.wait(1000); 
            currentCount = await tasksSelector.count;
        }
    };
    
    // Helper function to check if a task exists in the list
    async function checkTaskInList(tasks, taskCount, targetTaskName) {
        for (let i = 0; i < taskCount; i++) {
            const taskText = await tasks.nth(i).innerText; 
            const normalizedText = taskText.trim().toLowerCase();
    
            if (normalizedText.includes(targetTaskName.toLowerCase())) {
                console.log(`Task "${targetTaskName}" was found at index ${i+1}.`);
                return true;
            }
        }
    
        console.log(`Task "${targetTaskName}" was not found in the list.`);
        return false;
    }