const express = require('express")
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser .urlencoded({ extended: false }))
app.use (bodyParser. json())

//import db
const students = require(' ./db')

//login
app-post('/index', (reg, res) =› {
    const newMember = req.body;
    members.push (newMember);
    res.status (201) . send ({"status" : "Welcome to BukSU fitness gym"})

//get all
app.get('member/all', (reg, res) => {
res.status(201).json (members) ;
})

//get users
app.get('/member/i/:id',
(req, res) => {
const id = req-params. id;
const s = students.find((st) -> st.id == id);