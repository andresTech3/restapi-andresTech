import { pool } from "../db.js"

const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({message : "something goes wrong"})
    }
}

const getUser = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if(rows.length <= 0) return res.status(404).json({message : 'users not found'});
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({message : "something goes wrong"})
    }
}

const createUsers = async (req, res) => {
    const {name, email} = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO users(name, email) VALUES (?,?)', [name, email]);
        res.send({
        id : rows.insertId,
        name,
        email,
    })
    } catch (error) {
        return res.status(500).json({message : "something goes wrong"})
    }
}

const updateUsers = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const [result] = await pool.query('UPDATE users SET name = IFNULL(?, name), email = IFNULL(?, email) WHERE id = ?', [name,email, id])

        if(result.affectedRows === 0) return res.status(404).json({message : 'users not found'})

        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])

        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({message : "something goes wrong"})
        
    }
}

const deleteUsers = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
        if (result.affectedRows <= 0) return res.status(404).json({message : 'users not found'}) 
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message : "something goes wrong"})
    }
}

export {
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers,
    getUser
}
