const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Firebase/Firestore
const { credential } = require("firebase-admin");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const usersDB = db.collection('users');


app.listen(3000, () => {
    console.log("Server started");
    getUsers();
});

//Functions
async function getUsers() {
    const users = await usersDB.get();
    users.forEach(user => console.log(user.data()['points']));
}