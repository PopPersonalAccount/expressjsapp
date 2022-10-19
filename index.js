const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { user } = require("./models")

const saltRounds = 10;
function hash(password) {
    bcrypt.genSalt(saltRounds, function (saltError, salt) {
        if (saltError) {
        throw saltError
        } else {
        bcrypt.hash(password, salt, function(hashError, hash) {
            if (hashError) {
            throw hashError
            } else {
            console.log(hash)
            }
        })
        }
    })
};


const app = express();
const port = 3000;
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));

const templatePath = path.join(__dirname+"/templates/")

router.get("login",(req,res) => {
    res.sendFile(templatePath+"login.html")
});

router.get("/", (req,res) => {
    res.sendFile(templatePath+"index.html")
});

router.get("/register", (req,res) => {
    res.sendFile(templatePath+"login.html")
});

router.post("/regiser", (req,res) => {
    if(req.body.pass && req.body.user) {
        const hashedUser = hash(req.body.user)
        const hashedPass = hash(req.body.pass)
        const User = new user({"username": hashedUser, "password": hashedPass})
        User.save()
        return res.redirect("/register")
    }
    else {
        return res.sendStatus(400)
    };
});

app.use("/", router)

async function start() {

    app.listen(port, () => {
        console.log(`Express app listening on port ${port}`)
    })
}
start()