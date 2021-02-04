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
const onlineDB = db.collection('online_stores');


app.listen(3000, () => {
    console.log("Server started");
});


//Requests
app.get('/user', async function (req, res) {
    const phone = req.query.phone;
    const merchantID = 'Btg9U5yCb1b3dQpqNaEC';
    await onlineDB.doc(merchantID).get().then(async (merchant) => {
        if (merchant.exists) {
            await admin.auth().getUserByPhoneNumber('+91' + phone).then(async function (user) {
                await usersDB.doc(user.uid).get().then((details) => {
                    const points = details.data()['points'];
                    res.send(points.toString());
                });
            }).catch(() => {
                res.send("Sorry");
            });
        } else {
            res.send("Invalid source");
        }
    });
});

app.post('/user', async function (req, res) {
    const phone = req.query.phone;
    // await 
});