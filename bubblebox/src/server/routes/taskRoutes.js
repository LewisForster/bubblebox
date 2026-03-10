import express from 'express'
import "../../strategies/local.js";
import db_con from '../../config/db.js'

const router = express.Router();



router.post("/saveTask", (req, res) => {
    db_con.beginTransaction(err => {
        const { list_id, taskName, taskDescription, taskSize, taskPriority, taskColour, taskReminder, taskDue, userRemEmail, dueRemEmail, task_id, } = req.body;

        if (task_id) {
            const query = `UPDATE tasks SET list_ID = ?, task_name = ?, task_description = ?, task_size = ?, task_priority = ?, task_colour = ?, task_reminder = ?, task_due = ?, user_reminder_emailed = ?, due_reminder_emailed = ?
              WHERE task_id = ? `
            db_con.query(query, [list_id, taskName, taskDescription, taskSize, taskPriority, taskColour, taskReminder, taskDue, userRemEmail, dueRemEmail, task_id,], (err, result) => {
                if (err) {
                    return db_con.rollback(() => {
                        res.status(500).send("Error updating task!")
                    })
                } else {
                    return db_con.commit(() => {
                        console.log("SUPER TASK UPDATE RUNNING CODE")
                        res.status(200).json({ updated: true })
                    })
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
                    return db_con.commit(() => {
                        res.status(200).json({ created: true, taskId: result.insertId })
                    })
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
    const query = `SELECT task_id, task_name, task_description, task_size, task_priority, task_colour, task_reminder, task_due, user_reminder_emailed, due_reminder_emailed FROM tasks
     INNER JOIN tasklist 
     ON tasks.list_id=tasklist.list_id
     INNER JOIN users
     ON tasklist.user_id=users.id
     WHERE tasks.list_id = ? AND tasklist.user_id = ?`;
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

