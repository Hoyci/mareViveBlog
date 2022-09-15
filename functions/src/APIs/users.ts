import { Request, Response } from "express";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Busboy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

import { validateLoginData, validateSignUpData } from "../util/validators";
import config from "../util/config";
import { IUser } from "./users.type";
import { admin, db } from "../util/admin";

initializeApp(config);

const getUserDetail = async (request: Request, response: Response) => {
    let user = {
        userCredentials: {} || undefined
    }
    try {
        const document = await db.doc(`/users/${request.user.username}`).get();
        user.userCredentials = document.data();
        return response.json(user);
    } catch(err) {
        return response.status(500).json({ error: err })
    }
}

const updateUserDetails = async (request: Request, response: Response) => {
    const { firstName, lastName } = request.body;
    try {
        let document = db.collection("users").doc(`${request.user.username}`);
        console.log(document);
        await document.update({ firstName, lastName });
        return response.json({ message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        return response.status(500).json({ message: "Cannot update the value" })
    }

}


const loginUser = async (request: Request, response: Response) => {
    const user: IUser = {
        email: request.body.email,
        password: request.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return response.status(400).json({errors});

    try {
        const auth = getAuth();
        const useCredentials = await signInWithEmailAndPassword(auth, user.email, user.password);
        const token = await useCredentials.user.getIdToken();
        return response.json({ token });
    } catch (err: any) {
        console.log(err)
        return response.status(403).json({ general: 'Wrong credentials, please try again' });
    }
}

const signUpUser = async (request: Request, response: Response) => {
    const newUser: IUser = {
        username: request.body.username,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
    }
    
    const { valid, errors } = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    const user = await db.doc(`/users/${newUser.username}`).get()
    if (user.exists) {
        return response.status(400).json({ username: "This email is already taken"});
    } else {
        try {
            const auth = getAuth();
            const createdUser = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
            const userId = createdUser.user.uid;
            const token = await createdUser.user.getIdToken();
            const userCredentials = {
                userId,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                createdAt: new Date().valueOf()
            }
            await db.doc(`/users/${newUser.username}`).set(userCredentials);
            return response.status(201).json({ token });
        } catch (err: any) {
            console.log(err);
            if (err.code === "auth/email-already-in-use") {
                return response.status(400).json({ email: "Email already in use" });
            } else {
                return response.status(500).json({ general: "Something went wrong, please try again"})
            }
        }

    }
}

// const deleteImage = async (imageName: string) => {
//     const bucket = admin.storage().bucket();
//     const path = `profilePhotos/${imageName}`;
//     console.log('path', path);

//     try {
//         await bucket.file(path).delete();
//         return ;
//     } catch(err) {
//         console.log("Error trying to delete image from bucket", err);
//         return;
//     }
// }

const uploadProfilePhoto = async (request: Request, response: Response) => {
    // This function need to be refactored to accept upload photos to folder postPhotos
    // I don't understand why I need to use the deleteImage function. So this will be commented
    const busboy = Busboy({ headers: request.headers })
    let imageFileName = '';
    let imageToBeUploaded = {
        filePath: '',
        mimeType: ''
    };

    busboy.on('file', (name, file, info) => {
        const { filename, mimeType } = info
        if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
            response.status(400).json({ error: "Wrong file type submited" });
        }
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        imageFileName = `${request.user.username}.${imageExtension}`; // UID isn't better than username?
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimeType };
        file.pipe(fs.createWriteStream(filePath));
    });
    // await deleteImage(imageFileName);
    busboy.on('finish', async () => {
        try {
            await admin.storage().bucket().upload(
                imageToBeUploaded.filePath,
                {
                    resumable: false,
                    destination: `profilePhotos/${imageFileName}`,
                    metadata: {
                        metadata: {
                            contentType: imageToBeUploaded.mimeType
                        }
                    }
                });
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/profilePhotos/${imageFileName}?alt=media`;
            await db.doc(`/users/${request.user.username}`).update({
                imageUrl
            });
            return response.json({ message: "Image uploaded successfully" });
        } catch (err) {
            console.error(err);
            return response.status(500).json({ error: err });
        }
    });
    busboy.end(request.rawBody);
}


export { getUserDetail, updateUserDetails, loginUser, signUpUser, uploadProfilePhoto }
