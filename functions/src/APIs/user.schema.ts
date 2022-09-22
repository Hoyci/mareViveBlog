import * as yup from "yup";

const loginUserSchema = yup.object({
    body: yup.object({
        email: yup.string()
                .email("Not a proper email")
                .required("Email must not be empty"),
        password: yup.string()
                    .required("Password must not be empty")
    })
});

const signUpSchema = yup.object({
    body: yup.object({
        username: yup.string().required("Username must not be empty"),
        firstName: yup.string().required("First name must not be empty"),
        lastName: yup.string().required("Last name must not be empty"),
        email: yup.string().required("Email must not be empty"),
        password: yup.string().required("Password must not be empty"),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
    })
});

const userDetailSchema = yup.object({
    user: yup.object({
        username: yup.string().required("Username not found")
    })
})

export { loginUserSchema, signUpSchema, userDetailSchema }