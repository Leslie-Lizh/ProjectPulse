// import pg from "pg";
const pg = require("pg");
const { Pool } = pg

const main = async () => {
    const connectionString = 'postgresql://neondb_owner:uOGJ6eL7jTod@ep-sparkling-mountain-a11ciqqo.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
 
    const pool = new Pool({
      connectionString,
    })
    
    // const text = "INSERT INTO bands (name, genre) VALUES ($1, $2) RETURNING *"; /* the RETURNING * returns the new added row*/
    // const values = ["BlackPink", "Kpop"];
    // const result = await pool.query(text, values);

    // const name = "Lee";
    // const result = await pool.query("SELECT project_title, description, client, project_created_date, name FROM projects p JOIN user_project up ON p.id = up.project_id JOIN users u ON u.id = up.user_id WHERE name = $1; ", [name])
    // const isAdmin = false;
    // const result = await pool.query("SELECT t.id AS task_id, p.id AS project_id, project_title, task_title, task_created_date, target_timeline, assignee, status FROM tasks t JOIN projects p ON t.project_id = p.id")
    // const result = await pool.query("SELECT project_title, task_title, task_created_date, target_timeline, assignee, status FROM tasks t JOIN projects p ON t.project_id = p.id WHERE assignee = $1; ", [name]) 
    // const quote = "I hate drinking SO MUCH";
    // const id = "1";
    // const result = await pool.query("UPDATE musicians SET quote = $1 WHERE id = $2 RETURNING *", [quote, id]);
    // console.log("result", result.rows)
    // const final = await pool.query("select b.id as id_band, m.id as id_mus, b.name as band_name, m.name as mus_name, genre, quote, band_id from bands b join musicians m on b.id = m.band_id where m.id = $1;", [id])
    // console.log("final", final.rows)
    // const res = await pool.query("DELETE FROM musicians WHERE id = $1 RETURNING *;", [id])
    // console.log("result", res.rows)
    // const fin = await pool.query("select b.id as id_band, m.id as id_mus, b.name as band_name, m.name as mus_name, genre, quote, band_id from bands b join musicians m on b.id = m.band_id")
    // console.log("final", fin.rows)
    // const result = await pool.query("SELECT p.id AS project_id, project_title, description, client, project_created_date, name FROM projects p JOIN user_project up ON p.id = up.project_id JOIN users u ON u.id = up.user_id")
    // console.log("result", result.rows)
    // const project_title = "Smart Casino Backend System"
    // const result = await pool.query("SELECT id FROM projects WHERE project_title = $1", [project_title])
    // console.log(result.rows[0])
    // const taskId = "5"
    // const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *;", [taskId])
    // console.log(result.rows)
    await pool.end()

};

main();