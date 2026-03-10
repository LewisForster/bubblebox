import { sendEmail } from '../scripts/emailer.js';
import db_con from '../../config/db.js'
import cron from 'node-cron'



cron.schedule('*/5 * * * *', () => { // running every 5 minutes
    console.log("Sending emails...") // log to differentiate cron job - in case more are added in future. 
    sendReminderEmail();
});

function sendReminderEmail() { // selecting attributes we need for later checks, linking all together

    db_con.query(`SELECT username, email, task_name, task_id, task_due, task_reminder, user_reminder_emailed, due_reminder_emailed from tasks 
        INNER JOIN tasklist
        ON tasklist.list_id = tasks.list_id
        INNER JOIN users
        ON users.id = tasklist.user_id
        WHERE (
         (task_reminder <= NOW() AND user_reminder_emailed != 1) OR 
         (task_due <= NOW() AND tasks.due_reminder_emailed != 1 )
        )
    
        `, (err, result) => { // using less than equal to - in case the server desyncs by seconds, will send if task reminder <= now 
        if (err) {
            console.log(err)
        } if (result.length == 0) {
            console.log("No tasks found!")
            console.log(result)
        }
        else {
            const tasks = result
            console.log("TASKS PRINT", tasks)
            tasks.forEach(element => {
                const task_name = element.task_name
                const username = element.username
                let emailData;
                if (element.due_reminder_emailed == 0 && element.user_reminder_emailed == 1) { // if user has been emailed about their custom reminder, but not the now due reminder
                    console.log(element.email)
                    console.log(element)
                    emailData = {
                        to: element.email,
                        subject: `Reminder: ${element.task_name} is overdue!`,
                        text: `Dear ${element.username}, \n Your task ${element.task_name} is now overdue! \n
                    Please head to bubblebox, and complete your task!`,
                        html: `<p> Dear ${element.username}, your task ${element.task_name} is now overdue!</p> <br> Please head to bubblebox, and complete your task!`
                    };
                } else {
                    emailData = { // other case - if the user hasn't been emailed w/ a reminder, or didn't have one set
                        to: element.email,
                        subject: `Reminder: ${element.task_name} is due soon!`,
                        text: `Dear ${element.username}, \n Your task ${element.task_name} is due soon! \n
                    Please head to bubblebox, and complete your task!`,
                        html: `<p> Dear ${element.username}, your task ${element.task_name} is due soon!</p> <br> Please head to bubblebox, and complete your task!`
                    };
                }
                sendEmail(emailData)
                console.log("EMAIL SENT")
                if (element.task_due == element.task_reminder) {
                    db_con.query('UPDATE tasks SET user_reminder_emailed = 1, due_reminder_emailed = 1 WHERE task_id = ?', [element.task_id]);
                    console.log("DB UPDATED DUE + USER REM EMAIL") // if the task due date is the same as the reminder date - sets them both to sent
                    return;
                }
                if (element.user_reminder_emailed == 0) { // if the user hasn't been reminded of their task
                    db_con.query('UPDATE tasks SET user_reminder_emailed = 1 WHERE task_id = ?', [element.task_id]);
                    console.log("DB UPDATED USER REM EMAIL")
                    return;
                }
                if (element.due_reminder_emailed == 0) { // if the user hasn't been told their task is overdue
                    db_con.query('UPDATE tasks SET due_reminder_emailed = 1 WHERE task_id = ?', [element.task_id]);
                    console.log("DB UPDATED DUE REM EMAIL")
                    return;
                }

            });
        }
    }
    )
}

// this is a really messy and stupid way to do most of this, and I'll change it, but it works ok for now
export default cron