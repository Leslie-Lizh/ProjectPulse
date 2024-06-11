const debug = require("debug")("pern:controllers:usersController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../../config/database');

const SALT_ROUNDS = 6;

const createJWT = (user) =>
    jwt.sign({ user }, process.env.SECRET, { expiresIn: "30m" });

async function showUsers(req, res) {
    const isAdmin = false;
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * from users where is_admin = $1;", [isAdmin]);
        debug(result.rows);
        res.json(result.rows)
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Database query failed' });
    } finally {
        if (client) client.release();
    }
}

async function createUser(req, res) {
    const { name, dept, role, email, password, is_admin } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const client = await pool.connect();
    try {
        const queryText = 'INSERT INTO users (name, dept, role, email, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const result = await client.query(queryText, [name, dept, role, email, hashedPassword, is_admin]);
        const user = result.rows[0];
        delete user.password; // remove password before jwt
        const token = createJWT(user);
        res.status(201).json(token);
    } catch (err) {
        debug(err);
        res.status(500).json({msg: "Failed to create user"})
    } finally {
        if (client) client.release();
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user === null) {
            res.status(401).json({ msg: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            delete user.password; // remove password before jwt
            const token = createJWT(user);
            res.json(token);
        } else {
            res.status(401).json({ msg: "Password incorrect" });
        }
    } catch (err) {
        debug(err);
        res.status(500).json({msg: "Failed to retrieve user info"})
    } finally {
        if (client) client.release();
    }
}

async function showAllProjects(req, res) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT p.id AS project_id, project_title, description, client, project_created_date, name FROM projects p JOIN user_project up ON p.id = up.project_id JOIN users u ON u.id = up.user_id; ")
        debug(result.rows);
        res.json(result.rows)
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function showUserProjects(req, res) {
    const { userName } = req.params;
    debug(userName);
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT project_title, description, client, project_created_date, name FROM projects p JOIN user_project up ON p.id = up.project_id JOIN users u ON u.id = up.user_id WHERE name = $1; ", [userName])
        debug(result.rows);
        res.json(result.rows)
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function showAllTasks(req, res) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT t.id AS task_id, p.id AS project_id, project_title, task_title, task_created_date, target_timeline, assignee, status, task_completed_date FROM tasks t JOIN projects p ON t.project_id = p.id; ")
        debug(result.rows);
        res.json(result.rows)
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function showUserTasks(req, res) {
    const { userName } = req.params;
    debug(userName);
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT t.id AS task_id, p.id AS project_id, project_title, task_title, task_created_date, target_timeline, assignee, status, task_completed_date FROM tasks t JOIN projects p ON t.project_id = p.id WHERE assignee = $1; ", [userName])
        debug(result.rows);
        res.json(result.rows)
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function editTask(req, res) {
    const { taskId } = req.params;
    debug(taskId);
    const { task_title } = req.body;
    debug(task_title);
    const client = await pool.connect();
    try {
        const result = await client.query("UPDATE tasks SET task_title = $1 WHERE id = $2 RETURNING *", [task_title, taskId])
        debug("result", result.rows);
        const finalResult = await client.query("SELECT t.id AS task_id, p.id AS project_id, project_title, task_title, task_created_date, target_timeline, assignee, status, task_completed_date FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1", [taskId])
        debug("finalResult", finalResult.rows);
        res.json(finalResult.rows[0])
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Error editing task, database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function deleteTask(req, res) {
    const { taskId } = req.params;
    console.log(taskId);
    const client = await pool.connect();
    try {
        const result = await client.query("DELETE FROM tasks WHERE id = $1 RETURNING *;", [taskId])
        debug("result", result.rows);
        res.json({ deleted: result.rows[0] })
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Error deleting task, database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function createTask(req, res) {
    const { project_title, task_title, target_timeline, task_created_date, assignee, status } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT id FROM projects WHERE project_title = $1", [project_title])
        const { id } = result.rows[0];
        const newTask = await client.query("INSERT INTO tasks (task_title, target_timeline, task_created_date, assignee, status, project_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;", [task_title, target_timeline, task_created_date, assignee, status, id])
        debug(newTask.rows)
        const addedTask = await client.query("SELECT t.id AS task_id, p.id AS project_id, project_title, task_title, task_created_date, target_timeline, assignee, status, task_completed_date FROM tasks t JOIN projects p ON t.project_id = p.id WHERE task_title = $1 AND assignee = $2", [task_title, assignee])
        res.json(addedTask.rows[0])
    } catch(err) {
        debug(err);
        res.status(500).json({ msg: 'Error creating task, database query failed' })
    } finally {
        if (client) client.release();
    }
}

async function completeTask(req, res) {
    const { taskId } = req.params;
    const { status, task_completed_date } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query("UPDATE tasks SET status = $1, task_completed_date = $2 WHERE id = $3 RETURNING *", [status, task_completed_date, taskId])
        debug(result.rows);
        const completedTask = await client.query("SELECT t.id AS task_id, p.id AS project_id, project_title, task_title, task_created_date, target_timeline, assignee, status, task_completed_date FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1", [taskId])
        res.json(completedTask.rows[0])
    } catch (err) {
        debug(err);
        res.status(500).json({ msg: 'Error completing task, database query failed' })
    } finally {
        if (client) client.release();
    }
}

module.exports = {
    showUsers,
    createUser,
    login,
    showAllProjects,
    showUserProjects,
    showAllTasks,
    showUserTasks,
    editTask,
    deleteTask,
    createTask,
    completeTask
}