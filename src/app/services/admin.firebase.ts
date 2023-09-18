import admin from "firebase-admin";
// import functions from 'firebase-functions';
// import * as serviceAccount from "./test-authentication-398607-firebase-adminsdk-hoc9n-cfc69d97b7.json" // service account key
const serviceAccount = require("../../test-authentication-398607-firebase-adminsdk-hoc9n-cfc69d97b7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
});

export const verifyFirebaseToken = async (idToken: string) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        return null;
    }
};