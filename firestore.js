const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccount = require("./pon-todo-list-firebase-adminsdk-k425p-ab169c2299.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;