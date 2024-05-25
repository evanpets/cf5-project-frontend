export interface VenueAddress {
    street: string
    streetNumber: string
    zipCode: string
}

export interface Venue {
    name: string
    venueAddress: VenueAddress
}

export interface Performer {
    name: string
}

export interface Event {
    title: string
    description: string
    venue: Venue
    performer: Performer
    price: number
    date: Date
    category: string
}

export const EventsList : Event[] = [
    {
        title:'Helaina Ortsmann live in Athens',
        description:'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
        venue: {
            name: "Kyttaro Club",
            venueAddress: {
                street: 'street1',
                streetNumber: '123',
                zipCode: '12345'
            }
        },
        performer: {
            name: "Helaina Ortsmann"
        },
        price: 12.91,
        date: new Date("6/1/2022"),
        category: "Music"
    },
    {
        title:'Jules Tilberry Live in Athens',
        description:'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
        venue: {
            name: "Gagarin 205",
            venueAddress: {
                street: 'street2',
                streetNumber: '234',
                zipCode: '12346'
            }
        },
        performer: {
            name: "Jules Tilberry"
        },
        price: 40.00,
        date: new Date ("8/5/2022"),
        category: "Music"
    },
    {
        title:'Haze Carrier Live in Athens',
        description:'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
        venue: {
            name: "AN Club",
            venueAddress: {
                street: 'street1',
                streetNumber: '345',
                zipCode: '34567'
            }
        },
        performer: {
            name: "Haze Carrier"
        },
        price: 20.50,
        date: new Date("12/3/2022"),
        category: "Music"
    }       
]

