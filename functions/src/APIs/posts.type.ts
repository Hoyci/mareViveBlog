export interface IPost {
    id? : string
    title: string,
    body: string,
    tag: string
    // postImageUrl?: string,
    author: {
        userId: string
        username: string
    }
    createdAt: number,
}