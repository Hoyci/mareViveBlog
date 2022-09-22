import * as functions from "firebase-functions";
import express from "express";
import { getAllPosts, getOnePost, createPost, deletePost, editPost } from "./APIs/posts";
import { getUserDetail, updateUserDetails, loginUser, signUpUser, uploadProfilePhoto } from "./APIs/users";
import { auth } from './util/auth';
import { requestValidator } from "./util/validators"
import { createPostSchema, paramsIdPostSchema } from "./APIs/posts.schema";
import { loginUserSchema, signUpSchema, userDetailSchema } from "./APIs/user.schema";

const app = express();

app.post("/login", requestValidator(loginUserSchema), loginUser);
app.post("/signup", requestValidator(signUpSchema), signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, requestValidator(userDetailSchema), getUserDetail);
app.post("/user", auth, requestValidator(userDetailSchema), updateUserDetails);

app.get("/posts", auth, getAllPosts);
app.get('/posts/:postId', auth, requestValidator(paramsIdPostSchema), getOnePost);
app.post("/posts", auth, requestValidator(createPostSchema), createPost);
app.delete("/posts/:postId", auth, requestValidator(paramsIdPostSchema), deletePost);
app.put("/posts/:postId", auth, editPost);

exports.api = functions.https.onRequest(app);
