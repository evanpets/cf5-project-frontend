export interface User {
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    userRole: string
}

export interface Credentials {
    email: string
    password: string
}

export interface LoggedInUser {
    username: string
    email: string
}

export const dummyUser : User = {
    username: "alansmith",
    password: "12345",
    email: "alansmith@yahoo.gr",
    firstName: "alan",
    lastName: "smith",
    phoneNumber: "1234567890",
    userRole: "User"
}