export interface IPost {
    id? : string
    title: string,
    body: string,
    tag: string
    // postImageUrl?: string,
    author: {
        userId: string
        username: string
        firstName: string
        lastName: string
    }
    createdAt: number,
}

export interface IPostUpdate {
    title?: string,
    body?: string,
    tag?: string
}