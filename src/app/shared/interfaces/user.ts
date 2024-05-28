export interface User {
    Username: string
    Password: string
    Email: string
    FirstName: string
    LastName: string
    PhoneNumber: string
    Role: string
}

export interface Credentials {
    Username: string
    // email: string
    Password: string
}

export interface LoggedInUser {
    Username: string
    Email: string
}

// export const dummyUser : User = {
//     username: "alansmith",
//     password: "12345",
//     email: "alansmith@yahoo.gr",
//     firstName: "alan",
//     lastName: "smith",
//     phoneNumber: "1234567890",
//     userRole: "User"
// }