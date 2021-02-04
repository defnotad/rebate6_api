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


app.post('/transaction', async function (req, res) {
    const phone = req.query.phone;
    const merchantID = 'Btg9U5yCb1b3dQpqNaEC';
    const originalAmount = req.query.originalAmount;
    const pointsUsed = req.query.pointsUsed;
    const discountGiven = req.query.discountGiven;
    // const dateTime = Date();
    await onlineDB.doc(merchantID).get().then(async (merchant) => {
        console.log("Works 1");
        if (merchant.exists) {
            await admin.auth().getUserByPhoneNumber('+91' + phone).then(async function (user) {
                console.log("Works 2");
                await usersDB.doc(user.uid).get().then(async details => {
                    console.log("Works 3");
                    const oldPoints = details.data()['points'];
                    if (pointsUsed > oldPoints) {
                        res.send("Not enough points");
                    } else {
                        console.log("Works 4");
                        const newPoints = oldPoints - pointsUsed;
                        await usersDB.doc(user.uid).update({
                            points: newPoints,
                            online_transactions: {
                                originalAmount: Number(originalAmount),
                                pointsUsed: Number(pointsUsed),
                                discountGiven: Number(discountGiven),
                                // dateTime: dateTime,
                                merchantID: merchantID
                            },
                        }).then(async () => {
                            res.send("Yes");
                        }).catch((err) => console.log(err));
                    }
                });
            }).catch(() => {
                res.send("Sorry");
            });
        } else {
            res.send("Invalid source");
        }
    });
    // await 
});