import { Request, Response, NextFunction } from "express";
import { admin, db } from "./admin";


const auth = async (request: Request, response: Response, next: NextFunction) => {
    let idToken;
    const { authorization } = request.headers
    if (authorization && authorization.startsWith("Bearer ")) {
        idToken = authorization.split("Bearer ")[1];
    } else {
        console.error("No token found");
        return response.status(503).json({ error: "Unauthorized" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        request.user = decodedToken;
        const user = await db.collection("users").where("userId", "==", request.user.uid).limit(1).get();
        if (user.docs[0].data()) {
            request.user.firstName = user.docs[0].data().firstName;
            request.user.lastName = user.docs[0].data().lastName;
            request.user.username = user.docs[0].data().username;
            request.user.imageUrl = user.docs[0].data().imageUrl;
            return next();
        }
        throw new Error('Error while verifying token')
    } catch (err) {
        return response.status(403).json(err);
    }
}

export { auth }