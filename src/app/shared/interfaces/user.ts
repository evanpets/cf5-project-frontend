export interface User {
    username: string,
    password: string;
    email: string;
    firstName: string
    lastName: string;
    phoneNumber: string
    userRole: string
}

export interface Credentials {
    email: string;
    password: string;
}

export interface LoggedInUser {
    firstName: string
    email: string
}