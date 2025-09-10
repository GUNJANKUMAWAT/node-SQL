const express = require('express');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
let db = null;
const myDBpath = path.join(__dirname, 'goodreads.db');

//Initialize the database
const initializeDB = async ()=>{
    try{
        db = await open({
            filename: myDBpath,
            driver: sqlite3.Database
        })
        app.listen(3000, ()=>{
            console.log("Server got Started")
        })
    }
    catch(err){
        console.log("Error in DB Connection");
    }
}
initializeDB();

//create book table API
app.get('/create/', async (req, res)=>{
    await db.run(`CREATE TABLE BOOK(BOOK_ID INT, BOOK_NAME TEXT)`);
    res.send("Table Created Successfully")
})
app.use(express.json());

//Insert Book API
app.post('/addbook', async (req, res) => {
   const {id, name} = req.body;
   try {
      await db.run(`INSERT INTO BOOK VALUES (?, ?)`, [id, name]);
      res.send("Book Added successfully");
   } catch (error) {
      res.status(500).send("Error adding book: " + error.message);
   }
});
//Middleware to check login
function checkLogin(req, res, next){
    const authData = req.headers.authorization || '';
    const token = authData.split(' ')[1];
    jwt.verify(token, "ABC", (err, payload)=>{
        if (err){
            res.send("Login Required");
        }
        else{
            next();
        }
    })
}

//Get all books API
app.get('/book/', checkLogin, async (req, res)=>{
    const data = await db.all(`SELECT * FROM BOOK`);
    res.send(data);
})

//Get specific book API by ID
app.get('/book/:id', checkLogin, async (req, res)=>{
    const id = req.params.id;
    const que = `SELECT * FROM BOOK WHERE BOOK_ID = ${id}`;
    const data = await db.all(que);
    res.send(data);
})

//Login API
app.post('/login/', (req, res)=>{
    const {username, password} = req.body;
    if (username === "admin" && password === "admin"){
        const payload = {
            username: username,
        }
        const jwtToken = jwt.sign(payload, "ABC");
        res.send(jwtToken);
    }
    else{
        res.send("Invalid Credentials");
    }
})

//Delete Book API by ID
app.delete('/remove/:id', checkLogin, async (req, res)=>{
    const id = req.params.id;
    const que = `DELETE FROM BOOK WHERE BOOK_ID = ${id}`;
    await db.run(que);
    res.send("Book Deleted Successfully");
})

//Update Book API by ID
app.put('/update/:id', checkLogin, async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    try {
        await db.run(
            `UPDATE BOOK SET BOOK_NAME = ? WHERE BOOK_ID = ?`,
            [name, id]
        );
        res.send("Book Updated Successfully");
    } catch (error) {
        res.status(500).send("Error updating book: " + error.message);
    }
});

//API to filter Books by Book Names
app.get('/getbook/', async (req, res)=>{
    const name = req.query.search_q;
    const que = `SELECT * FROM BOOK WHERE BOOK_NAME LIKE '%${name}%'`;
    const data = await db.all(que);
    res.send(data);
})