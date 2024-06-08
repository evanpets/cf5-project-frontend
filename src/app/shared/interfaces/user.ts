export interface User {
    userId: number //just added
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    role: string
}

export interface Credentials {
    username: string
    // email: string
    password: string
}

export interface LoggedInUser {
    username: string
    email: string
}

export interface DecodedTokenSubject {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    nbf: number;
    exp: number;
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