import { IUser } from "../APIs/users.type";
import { Request, Response, NextFunction } from "express";
// import { ObjectSchema } from "yup";

const isEmpty = (string: string) => {
   return string.trim() == '' 
}

const isEmail = (email: string) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(emailRegEx) ? true : false;
};

const validateLoginData = (data: IUser) => {
    let errors = {
        email: "",
        password: "",
    };
    if (isEmpty(data.email)) errors.email = "Must not be empty"
    if (isEmpty(data.password)) errors.password = "Must not be empty"

    return {
        errors,
        valid: !errors.email && !errors.password
    }
}

const validateSignUpData = (data: IUser) => {
    let errors = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    };

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty"
    } else if (!isEmail(data.email)) {
        errors.email = "Must be valid email address"
    }

    if (isEmpty(data.username || "")) errors.username = "Must not be empty";
    if (isEmpty(data.firstName || "")) errors.firstName = "Must not be empty";
    if (isEmpty(data.lastName || "")) errors.lastName = "Must not be empty";
    if (isEmpty(data.password || "")) errors.password = "Must not be empty";
    if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords must be the same";

    return {
        errors,
        valid: !errors.email && !errors.password && !errors.confirmPassword && !errors.firstName && !errors.lastName && !errors.username
    };
}

const requestValidator = (schema: any) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: request.body,
            query: request.query,
            params: request.params,
            user: request.user
        });
        return next()
    } catch (err) {
        if (err instanceof Error) {
            return response.status(500).json({ error: err.message });
        }
        return response.status(500).json({ error: 'Error on validating request'});
    }
}

export { validateLoginData, validateSignUpData, requestValidator }