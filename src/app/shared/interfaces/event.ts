export interface VenueAddress {
    street: string
    streetNumber: string
    zipCode: string
    city: string
}

export interface Venue {
    name: string
    venueAddress: VenueAddress
}

export interface Performer {
    name: string
}

export interface Event {
    eventId: number
    title: string
    description: string
    venue: Venue
    performers: Performer[]
    price: number
    date: Date
    category: string
    userId: number
    imageUrl: string;
}

export interface BackendEvent {
    eventId: number;
    title: string;
    description?: string;
    date: Date;
    category?: string;
    userId: number;
    venueName: string;
    venueStreet: string;
    venueStreetNumber: string;
    venueZipCode: string;
    venueCity: string;
    performers: { name: string }[];
    price: number;
    imageUrl: string;
}