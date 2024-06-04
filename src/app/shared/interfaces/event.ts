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
    performers: Performer[]
    price: number
    date: Date
    category: string
}

// export const EventsList : Event[] = [
//     {
//         title:'Helaina Ortsmann live in Athens',
//         description:'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
//         venue: {
//             name: "Kyttaro Club",
//             venueAddress: {
//                 street: 'street1',
//                 streetNumber: '123',
//                 zipCode: '12345'
//             }
//         },
//         performer: {
//             name: "Helaina Ortsmann"
//         },
//         price: 12.91,
//         date: new Date("6/1/2022"),
//         category: "Music"
//     },
//     {
//         title:'Jules Tilberry Live in Athens',
//         description:'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
//         venue: {
//             name: "Gagarin 205",
//             venueAddress: {
//                 street: 'street2',
//                 streetNumber: '234',
//                 zipCode: '12346'
//             }
//         },
//         performer: {
//             name: "Jules Tilberry"
//         },
//         price: 40.00,
//         date: new Date ("8/5/2022"),
//         category: "Music"
//     },
//     {
//         title:'Haze Carrier Live in Athens',
//         description:'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
//         venue: {
//             name: "AN Club",
//             venueAddress: {
//                 street: 'street1',
//                 streetNumber: '345',
//                 zipCode: '34567'
//             }
//         },
//         performer: {
//             name: "Haze Carrier"
//         },
//         price: 20.50,
//         date: new Date("12/3/2022"),
//         category: "Music"
//     },
//     {
//         title:"Myles Fee live in Athens",
//         description:"Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
//         venue:
//             {
//                 name:"Zoombox",
//                 venueAddress:
//                 {
//                     street:"6252 Oakridge Center",
//                     streetNumber:"1407",
//                     zipCode: '34567'
//                 }
//             },
//         performer:
//             {
//                 "name":"Myles Fee"
//             },
//         price:35.63,
//         date: new Date("6/1/2022"),
//         category:"Music"
//     },
//     {
//         title: "Stacy Sonier live in Athens",
//         description: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
//         venue:
//             {
//                 name: "Browsetype",
//                 venueAddress:
//                 {
//                     street: "Susan Drive",
//                     streetNumber: "464",
//                     zipCode: "00000"
//                 }
//             },
//         performer:
//             {
//                 name: "Stacy Sonier"
//             },
//         price: 39.75,
//         date: new Date("8/9/2024"),
//         category: "Music"
//     },
//     {
//         title: "Odelia Soloway live in Athens",
//         description: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
//         venue:
//             {
//                 name: "Flipbug",
//                 venueAddress:
//                 {
//                     street: "Rigney Circle",
//                     streetNumber: "21",
//                     zipCode: "42242"
//                 }
//             },
//         performer:
//             {
//                 name: "Odelia Soloway"
//             },
//         price: 46.41,
//         date: new Date("9/7/2024"),
//         category: "Music"
//     },
//     {
//         title: "Cart Butterworth live in Athens",
//         description: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
//         venue:
//             {
//                 name: "Janyx",
//                 venueAddress:
//                 {
//                     street: "Prairieview Plaza",
//                     streetNumber: "378",
//                     zipCode: "42505"
//                 }
//             },
//         performer:
//             {
//                 name: "Cart Butterworth"
//             },
//         price: 49.54,
//         date: new Date("25/8/2024"),
//         category: "Music"
//     },
//     {
//         title: "Tiebout Poston live in Athens",
//         description: "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.",
//         venue:
//             {
//                 name: "Wikizz",
//                 venueAddress:
//                 {
//                     street: "Tennessee Hill",
//                     streetNumber: "387",
//                     zipCode: "00000"
//                 }
//             },
//         performer:
//             {
//                 name: "Tiebout Poston"
//             },
//         price: 66.79,
//         date: new Date("30/1/2024"),
//         category: "Music"
//     },
//     {
//         title: "Nita Livingston live in Athens",
//         description: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
//         venue:
//             {
//                 name: "Edgewire",
//                 venueAddress:
//                 {
//                     street: "Crescent Oaks Drive",
//                     streetNumber: "5923",
//                     zipCode: "47835"
//                 }
//             },
//         performer:
//             {
//                 name: "Nita Livingston"
//             },
//         price: 27.86,
//         date: new Date("31/5/2022"),
//         category: "Music"
//     },
//     {
//         title: "Morris Woolford live in Athens",
//         description: "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
//         venue:
//             {
//                 name: "Tagcat",
//                 venueAddress:
//                 {
//                     street: "Grover Court",
//                     streetNumber: "664",
//                     zipCode: "47601"
//                 }
//             },
//         performer:
//             {
//                 name: "Morris Woolford"
//             },
//         price: 10.72,
//         date: new Date("8/6/2022"),
//         category: "Music"
//     },
//     {
//         title: "Juli Seely live in Athens",
//         description: "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
//         venue:
//             {
//                 name: "Quimm",
//                 venueAddress:
//                 {
//                     street: "Ridgeview Crossing",
//                     streetNumber: "9",
//                     zipCode: "61221"
//                 }
//             },
//         performer:
//             {
//                 name: "Juli Seely"
//             },
//         price: 71.46,
//         date: new Date("25/9/2024"),
//         category: "Music"
//     },
//     {
//         title: "Estelle Tildesley live in Athens",
//         description: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
//         venue:
//             {
//                 name: "Photobug",
//                 venueAddress:
//                 {
//                     street: "58138 Hagan Park",
//                     streetNumber: "4822",
//                     zipCode: "00000"
//                 }
//             },
//         performer:
//             {
//                 name: "Estelle Tildesley"
//             },
//         price: 77.58,
//         date: new Date("13/12/2023"),
//         category: "Music"
//     },
//     {
//         title: "Stanton March live in Athens",
//         description: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
//         venue:
//             {
//                 name: "Chatterbridge",
//                 venueAddress:
//                 {
//                     street: "Jana Drive",
//                     streetNumber: "138",
//                     zipCode: "00000"
//                 }
//             },
//         performer:
//             {
//                 name: "Stanton March"
//             },
//         price: 10.98,
//         date: new Date("9/11/2024"),
//         category: "Music"
//     },
//     {
//         title: "Horatius Clampton live in Athens",
//         description: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
//         venue:
//             {
//                 name: "Wordpedia",
//                 venueAddress:
//                 {
//                     street: "Butterfield Avenue",
//                     streetNumber: "44",
//                     zipCode: "00000"
//                 }
//             },
//         performer:
//             {
//                 name: "Horatius Clampton"
//             },
//         price: 65.59,
//         date: new Date("18/10/2024"),
//         category: "Music"
//     },
//     {
//         title: "Coleen McReynold live in Athens",
//         description: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
//         venue:
//             {
//                 name: "Centimia",
//                 venueAddress:
//                 {
//                     street: "Bowman Avenue",
//                     streetNumber: "8",
//                     zipCode: "18789"
//                 }
//             },
//         performer:
//             {
//                 name: "Coleen McReynold"
//             },
//         price: 81.86,
//         date: new Date("6/2/2024"),
//         category: "Music"
//     },
//     {
//         title: "Alix Legan live in Athens",
//         description: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
//         venue:
//             {
//                 name: "Layo",
//                 venueAddress:
//                 {
//                     street: "3682 Derek Point",
//                     streetNumber: "298",
//                     zipCode: "18301"
//                 }
//             },
//         performer:
//             {
//                 name: "Alix Legan"
//             },
//         price: 92.36,
//         date: new Date("6/7/2024"),
//         category: "Music"
//     },
//     {
//         title: "Don Burt live in Athens",
//         description: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
//         venue:
//             {
//                 name: "Feednation",
//                 venueAddress:
//                 {
//                     street: "Cascade Alley",
//                     streetNumber: "7",
//                     zipCode: "82004"
//                 }
//             },
//         performer:
//             {
//                 name: "Don Burt"
//             },
//         price: 68.82,
//         date: new Date("6/8/2022"),
//         category: "Music"
//     },
//     {
//         title: "A.J. Bloxsom live in Athens",
//         description: "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.\n\nProin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
//         venue:
//             {
//                 name: "Brainsphere",
//                 venueAddress:
//                 {
//                     street: "Autumn Leaf Avenue",
//                     streetNumber: "4",
//                     zipCode: "00000"
//                 }
//             },
//         performer:
//             {
//                 name: "Judas Bloxsom"
//             },
//         price: 78.97,
//         date: new Date("6/6/2024"),
//         category: "Music"
//     }    
// ]

