import * as yup from "yup";

const createPostSchema = yup.object({
    body: yup.object({
        title: yup
                .string()
                .required("Title must not be empty"),
        body: yup
                .string()
                .required("Body must not be empty"),
        tag: yup
                .string()
                .required("Tag must not be empty")
    }),
    user: yup.object({
        uid: yup.string().required(),
        username: yup.string().required()
    })
});

const paramsIdPostSchema = yup.object({
    params: yup.object({
        postId: yup
                .string()
                .required("Params must not be empty")
    })
});



export { createPostSchema, paramsIdPostSchema }