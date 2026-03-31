import express from 'express'
import "../../strategies/local.js";
import db_con from '../../config/db.js'

const router = express.Router();



router.post("/saveTask", (req, res) => {
    db_con.beginTransaction(err => {
        const { list_id, taskName, taskDescription, taskSize, taskPriority, taskColour, taskReminder, taskDue, userRemEmail, dueRemEmail, task_id, tags } = req.body;

        function syncTags(task_id, tagList, res) {
            db_con.query('DELETE FROM tagsjoin WHERE task_id = ?', [task_id], (err) => {
                if (err) {
                    console.log("err")
                    return db_con.rollback(() => {
                        res.status(500).send("Error updating tags")
                    })
                }
            }) // deleting duplicates
            const tagValues = tags.map(tag_id => [task_id, tag_id]);
            db_con.query('INSERT INTO tagsjoin (task_id, tag_id) VALUES ?', [tagValues], (err) => {
                if (err) {
                    console.log("SAVE TAG ERR", err)
                    return db_con.rollback(() => {
                        res.status(500).send("Error updating tags")
                    })
                } else {
                    return db_con.commit(() => {
                        console.log("SAVING TAGS")
                        res.status(200).json({ saved: true, task_id })
                    })
                }
            })
        }
        if (task_id) {
            const query = `UPDATE tasks SET list_ID = ?, task_name = ?, task_description = ?, task_size = ?, task_priority = ?, task_colour = ?, task_reminder = ?, task_due = ?, user_reminder_emailed = ?, due_reminder_emailed = ?
              WHERE task_id = ? `
            db_con.query(query, [list_id, taskName, taskDescription, taskSize, taskPriority, taskColour, taskReminder, taskDue, userRemEmail, dueRemEmail, task_id,], (err, result) => {
                if (err) {
                    return db_con.rollback(() => {
                        res.status(500).send("Error updating task!")
                    })
                } else {
                    console.log("UPDATING TASKS")
                    syncTags(task_id, tags, res)
                }
            })
        } else {
            const query = 'INSERT INTO tasks (list_id, task_name, task_description, task_size, task_priority, task_colour, task_reminder, task_due, user_reminder_emailed, due_reminder_emailed) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?)'
            db_con.query(query, [list_id, taskName, taskDescription, taskSize, taskPriority, taskColour, taskReminder, taskDue, userRemEmail, dueRemEmail], (err, result) => {
                if (err) {
                    console.log("INSERT ERROR IF ERR")
                    console.log(err)
                    return db_con.rollback(() => {
                        res.status(500).send("Error saving task!")
                    })
                } else {
                    console.log("adding into DB")
                    console.log(result)
                    syncTags(task_id, tags, res)
                }
            })
        }
    }

    )
}
)


router.post("/deleteTask", (req, res) => {
    db_con.beginTransaction(err => {
        const { task_id } = req.body
        console.log("task_id", task_id)
        const query = 'DELETE FROM tasks WHERE task_id = ?'
        console.log("taskid yes", task_id)
        db_con.query(query, [task_id], (err, result) => {
            if (err) {
                return db_con.rollback(() => {
                    res.status(500).send("Error deleting task")
                    console.log(err)
                })
            } else {
                return db_con.commit(() => {
                    console.log("deleted", result)
                    res.status(200).json({ deleted: true })
                })
            }
        })
    }
    )
})

router.get("/taskInfo", (req, res) => {
    const { list_id, } = req.query;
    const query = `SELECT tasks.task_id, task_name, task_description, task_size, task_priority, task_colour, task_reminder, task_due, user_reminder_emailed, due_reminder_emailed,
     GROUP_CONCAT(tags.tag_id) AS "tag_id",
     GROUP_CONCAT(tags.tag_name) AS "tag_name" 
     FROM tasks
     INNER JOIN tasklist ON tasks.list_id=tasklist.list_id
     INNER JOIN users ON tasklist.user_id=users.id
     LEFT JOIN tagsjoin ON tasks.task_id = tagsjoin.task_id
     LEFT JOIN tags ON tagsjoin.tag_id = tags.tag_id
     WHERE tasks.list_id = ? AND tasklist.user_id = ?
     GROUP BY tasks.task_id`;
    // https://www.reddit.com/r/SQL/comments/1bn9xhl/comment/kwhhgmj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    // https://www.reddit.com/r/SQL/comments/1bn9xhl/comment/kwh9a7p/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    // https://www.geeksforgeeks.org/sql/mysql-group_concat-function/
    db_con.query(query, [list_id, req.user.id], (err, result) => {
        if (err) {
            console.log("DIDNT FETCH TASK INFO")
            console.log(err)
            return res.status(500).send("ERROR RETRIEVING TASK")

        } else {
            console.log("SENDING TASK INFO")
            console.log("list ID:", list_id)
            console.log(result)
            return res.status(200).json(result)
        }
    })
})

router.get("/taskData", (req, res) => {
    const { task_id } = req.query
})
export default router;

