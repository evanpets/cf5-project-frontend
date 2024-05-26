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
    firstName: string
    email: string
}

export const dummyUser : User = {
    username: "vagpet",
    password: "12345",
    email: "vagelis.pets@yahoo.gr",
    firstName: "Vangelis",
    lastName: "Petsalis",
    phoneNumber: "1234567890",
    userRole: "User"
}