import { Request, Response } from "express";
import { db } from "../util/admin";
import { IPost } from "./posts.type";

const getAllPosts = async (request: Request, response: Response) => {
    // Will be nice if I add a request.query to get the orderBy and use in the db orderBy
    try {
        const documents = await db.collection("posts")
        .where("username", "==", request.user.username)
        .orderBy("createdAt", "desc")
        .get()
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
    } catch(err: any)  {
        console.log(err);
        return response.status(500).json({error: err.code})
    }
}

const createPost = async (request: Request, response: Response) => {
    const { body, title, tag } = request.body;

    if (body.trim() === '') {
        return response.status(400).json({ body: 'Must not be empty' });
    }
    if (title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    if (tag.trim() === '') {
        return response.status(400).json({ tag: 'Must not be empty' });
    }

    const newPostItem: IPost = {
        title,
        body,
        tag,
        author: {
            userId: request.user.uid,
            username: request.user.username,
        },
        createdAt: new Date().valueOf(),
    };

    try {
        const document = await db.collection('posts').add(newPostItem);
        newPostItem.id = document.id;
        return response.json(newPostItem);
    } catch (err: any) {
        console.log(err);
        return response.status(500).json({ error: err.code })
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
        if (doc.data()?.username !== request.user.username) {
            return response.status(404).json({ error: "Unauthorized"})
        }
        document.delete();
        return response.json({ message: "Delete sucessfull" });
    } catch (err: any) {
        console.log(err);
        return response.status(500).json({ error: err.code })
    }
}

const editPost = async (request: Request, response: Response) => {
    if (request.body.postId || request.body.createdAt) {
        return response.status(403).json({ message: 'Not allowed to edit'});
    }
    const { postId } = request.params;

    try {
        let document = db.collection('posts').doc(`${postId}`);
        await document.update(request.body); // Validate this body
        return response.json({ message: 'Updated successfully' });
    } catch (err) {
        console.log(err);
            return response.status(500).json({ error: (err as Error).message })
        // return response.status(500).json({ error: 'whatever' })
    }
}

export { getAllPosts, createPost, deletePost, editPost }

// Create a postsRepository to handle the database call
// Create a postController to handle with the bussines logic
 
// interface IPost {
//     title: string
//     body: string
//     tag: string
//     createdAt: number
//     author: {
//         id: string,
//         username: string
//     }
// }