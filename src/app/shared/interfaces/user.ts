export interface User {
    userId: number
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
    role: string
}

export interface DecodedTokenSubject {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role": string;
    nbf: number;
    exp: number;
  }