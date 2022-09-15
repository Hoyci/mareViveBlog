import * as functions from "firebase-functions";
import express from "express";
import { getAllPosts, createPost, deletePost, editPost } from "./APIs/posts";
import { getUserDetail, updateUserDetails, loginUser, signUpUser, uploadProfilePhoto } from "./APIs/users";
import { auth } from './util/auth';

const app = express();

app.get("/posts", auth, getAllPosts);
// app.get('/posts/:postId', auth, getOnePost);
app.post("/posts", auth, createPost);
app.delete("/posts/:postId", auth, deletePost);
app.put("/posts/:postId", auth, editPost);

app.post("/login", loginUser); // Maybe this route need to be before the authenticated routes
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
