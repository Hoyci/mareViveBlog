import { Request, Response } from "express";
import { db } from "../util/admin";
import { IPost, IPostUpdate } from "./posts.type";

const getAllPosts = async (request: Request, response: Response) => {
    // Will be nice if I add a request.query to get the orderBy and use in the db orderBy
    try {
        const documents = await db
            .collection("posts")
            .where("author.username", "==", request.user.username)
            .orderBy("createdAt", "desc")
            .get();
        const posts: IPost[] = [];
        documents.forEach((doc: any) => {
            posts.push({
                id: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                tag: doc.data().tag,
                author: doc.data().author,
                createdAt: doc.data().createdAt
            })
        });
        return response.json(posts);
    } catch(err)  {
        return response.status(500).json({ error: err })
    }
}

const getOnePost = async (request: Request, response: Response) => {
    const { postId } = request.params;

    try {
        const document = await db.doc(`/posts/${postId}`).get();
        if (!document.exists) {
            return response.status(404).json({ error: "Post not found" });
        }
        return response.json(document.data());

    } catch (err) {
        return response.status(500).json({ error: err })
    }
}

const createPost = async (request: Request, response: Response) => {
    const { body, title, tag } = request.body;
    const { uid, username, firstName, lastName } = request.user;

    const newPostItem: IPost = {
        title,
        body,
        tag,
        author: {
            userId: uid,
            username: username,
            firstName: firstName,
            lastName: lastName
        },
        createdAt: new Date().valueOf(),
    };

    try {
        const document = await db.collection('posts').add(newPostItem);
        newPostItem.id = document.id;
        return response.json(newPostItem);
    } catch (err) {
        return response.status(500).json({ error: err })
    }
}

const deletePost = async (request: Request, response: Response) => {
    const { postId } = request.params;

    try {
        const document = db.doc(`/posts/${postId}`);
        const doc = await document.get()
        if (!doc.exists) {
            return response.status(404).json({ error: "Post not found" })
        }
        if (doc.data()?.author.username !== request.user.username) {
            return response.status(404).json({ error: "Unauthorized" })
        }
        await document.delete();
        return response.json({ message: "Delete sucessfull" });
    } catch (err) {
        return response.status(500).json({ error: err })
    }
}

const editPost = async (request: Request, response: Response) => {
    const { title, body, tag, postId: _postId, createdAt } = request.body;
    const { postId } = request.params;

    if (_postId || createdAt) {
        return response.status(403).json({ message: 'Not allowed to edit'});
    }

    if (!title && !body && !tag ) {
        return response.status(403).json({ message: 'The body is empty' })
    }
    
    const updateBody: IPostUpdate = {
        ...(title && { title }),
        ...(body && { body }),
        ...(tag && { tag }),
    };

    try {
        let document = db.collection('posts').doc(`${postId}`);
        await document.update(updateBody);
        return response.json({ message: 'Updated successfully' });
    } catch (err) {
        return response.status(500).json({ error: err })
    }
}

export { getAllPosts, getOnePost, createPost, deletePost, editPost }