import * as admin from "firebase-admin";

admin.initializeApp();
const firebaseDb: FirebaseFirestore.Firestore = admin.firestore();
firebaseDb.settings({ timestampsInSnapshots: true });
const db = firebaseDb;

export { admin, db };

