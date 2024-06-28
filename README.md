# FinalProjectFrontend

This application was developed by Evangelos Petsalis with the aim of serving as the frontend of the final project of Coding Factory 5.

## How to run

The application runs on `https://localhost:4200/`. Type `ng serve` in the CLI to load it.

## Instructions on how to set up

Two SQL scripts are provided in .txt files in the same package: one that creates the database and user, and another that inserts data into the database. A dummy user to whom the events inserted are linked is inserted, but they cannot be retrieved because the password is directly imported to the database, which fails later validity changes. How to overcome this:

Run the backend server. On load, Swagger will also load. You can go to the User controller methods there and run `api/users/registration` using the following code to insert an admin user(you can adapt it to your liking):
```
{
  "username": "admin",
  "email": "admin@aueb.gr",
  "password": "Admin2024!",
  "firstName": "admin",
  "lastName": "admin",
  "phoneNumber": "1231231231",
  "role": 1
}
```
Role is set to 1 for "Admin" role.

Once that is successfully inserted, you can log in using the username and password from the code above and have full access to the application's features. You can also edit the existing user's password through the Admin User Menu and log in with that user, for access to the script-inserted events through the "My events" tab.

## Manual
### Main Purpose
This application serves as a platform where a visitor can do two main things:
1. Use the website's pages to search for events of various sorts.

2. Create an account and, by doing so, gain the ability to submit events to the server and also shortlist events by saving them.

## Navigation:
## Homepage
The homepage consists of:
1. A carousel of various upcoming events, displaying some basic information, which autorotate. The visitor can use the previous and next buttons on the slide to search for an event, or click on it to navigate to its details.

2. A search bar for filtering. In the select box on the right-hand side, the filters to choose are:
    - "Event" (default), which allows the user to search for an event by its title.
    - "Venue", which allows the user to search for the name of a venue and locate all events taking place at that venue.
    - "Performer", which allows the user to search for all events where a specified performer is performing.
    - "Date", which allows the user to search for all events on a specified date (DD-MM-YYYY).

In all cases, the events appear in the form of event cards. Some basic information is displayed on the card, on which the visitor can click to navigate to its details. If the visitor is a logged-in user, they will also be able to click on the bookmark icon to save or unsave the event. Up to ten events are loaded to the page, in which case the visitor can click on the "Load Ten More" button to get more events matching their choice.


## Navbar

The navbar consists of several menu items (clicking on the brand name at the top left corner redirects to the homepage):

### **1. Home:**

Redirects to the homepage.

### **2. Music/Cinema/Theater:**

Nav items that contain event lists similar to the one in the homepage, where events appear based on the event category they are listed under, allowing the user to search for the event of their choice. 

### **3. Submit an event**:

Allows a logged-in user to submit an event to the server. If the visitor is not logged-in, they will be redirected to the login page.

### **4. Events:**

This nav contains two items, "Upcoming Events" and "Past Events". As the names indicate, on click the user will be redirected to a page containing one of two datatables (the visitor can navigate between the datatables by clicking on the buttons above the datatable) where events whose date has passed or, conversely, has not arrived yet, appear.

The visitor can use any of the column headers to sort the information to their liking, or click on an item of interest to show a dialog box with a few more details about it. If they click on "Details", they will be redirected to the event details page for the event of their choice.

### **5. About Us:**

A simple about-us page, where the project is briefly described. The visitor is prompted to browse the website further, or register as a user if they are not one yet.

### **6. Admin menu:**

Available only if the logged-in user is labeled with the "Admin" role. Redirects to the admin menu.

### **7. User side menu:**

If the user is not logged in, a prompt to log in and an icon that redirects to the login page appear. If the user has logged in, in the place of the above appear an account icon with the user's username and a dropdown menu that appears on click. At the bottom of it, there is a logout prompt which the user can click on to sign out of their account. Any of the other three choices ("Edit details", "My Events", "Saved Events") redirect the user to the respective tab in the user menu.

## Footer

Contains information such as copyright and social media links (set to default for privacy reasons). Contains links to the following pages:

### **1. Contact us:**

Contains contact information (mostly set to false values for privacy reasons).

### **2. Terms and Conditions:**

Contains standard terms and conditions regarding the use of the application.

### **3. FAQ:**

Can host frequently asked questions. Currently hosts information on how the application was created.

## Event Submission Form

Allows a logged-in user to submit an event to the server. Some basic information regarding it is requested (Title, Description, Venue, Performer, Price, Date, Category). The user can also upload an image from his device that will be associated with the event. 

- The venue of the event can be chosen among the existing ones (pre-loaded) ones or the user can choose to submit a new one, in which case they must provide the name of the venue and the street, street number, ZIP code and city that comprise the venue's address.

- The user can add multiple performers by clicking on the "I want to add more performers" button, or click on the icon next to the performer field to remove one.

## Login Page

The visitor types in the username (or email) and the password they used to sign up, and on success are redirected to the homepage. They are also prompted to register if they have not become users yet. 

## Registration Page

Allows a visitor to create an account the apppication. Some basic information is requested (Username, Password, Email, First name, Last name, Phone number).The password must fulfill certain conditions and also be confirmed by repeating it in the Confirm Password field.
- The default role for a created user is "User".


## Event Details Page

Detailed information about events is displayed. The visitor can go back to the homepage by clicking on the "Home" button in the top left corner, or scroll through the list by clicking on the "Previous" and "Next" buttons in the bottom left and bottom right corner, respectively.

## User Menu

Contains several options for the user.

### Edit profile:

Here, the user can edit their account information, except for their username, by clicking on the "Edit" button. "Save" confirms the changes while "Cancel" closes the edit form.

### My Events:

Here, the user can see all events they have submitted. If any exist, the user can edit their details or delete an event altogether. "Edit" loads the edit form, in which "Save" stores the changes and "Cancel" retracts the edit form. "Delete" removes the event (after a confirmation dialog box).

### Saved Events:

Here, the user can display a list of all the events they have saved. They can click on the cards of those events to navigate to their details or they can choose to unsave them (in which case a confirmation dialog will appear as the page will refresh the list and the event will not be retrievable unless searched for again).


## Admin Menu
Given that the user is an admin for the application, they will be able to access this menu through the navbar. Here, they have access to CRUD methods regarding users, events and venues.

### User Admin menu:

The admin is presented with a menu with three choices which lead to the respective CRUD method(s):
- Insert User
- Update/Delete User
- Find User

#### Insert User:

Here, the admin can insert a user to the database by filling in their information. No password confirmation is requested.

#### Update/Delete User:

Here, the admin can load a list of all users and update their information or delete them.

#### Find User:

Here, the admin can search for a user using their ID or their exact username.

### Event Admin menu:

The admin is presented with a menu with three choices which lead to the respective CRUD method(s):
- Insert Event
- Update/Delete Event
- Find Event

#### Insert Event:

Here, the admin can insert an event to the database by filling in its information and uploading an image associated with it.

#### Update/Delete Event:

Here, the admin can load a list of all events and update their information or delete them.

#### Find Event:

Here, the admin can search for an event using their ID or a string within their title. In the case of multiple results (in the latter case), "Previous" and "Next" buttons allow the admin to scroll between the results.

### Venue Admin menu:

The admin is presented with a menu with three choices which lead to the respective CRUD method(s):
- Insert Venue
- Update/Delete Venue
- Find Venue

#### Insert Venue:

Here, the admin can insert a venue to the database by filling in its information.

#### Update/Delete Venue:

Here, the admin can load a list of all venues and update their information or delete them.

#### Find Venue:

Here, the admin can search for a venue using its exact registered name.