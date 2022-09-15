import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

interface BusboyFile {
    fieldname: string
    file: NodeJS.ReadableStream | undefined
    filename: string;
    destination: string;
    encoding?: string,
    mimetype?: string
}

declare global {
    namespace Express {
        interface Request {
            user: DecodedIdToken,
            files: {
                [fieldname: string]: BusboyFile[]
            };
            rawBody: any
        }
    }
}