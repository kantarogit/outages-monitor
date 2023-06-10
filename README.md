# outages-monitor
Get a mail notification every time there is planned power outage in your area

This is a Node.js application that notifies users of planned outages by EVN Macedonia, in their area using data from the EVN website.

## Installation
To install the application, clone the repository and run the following command:
`npm install`

This will install the required dependencies.

## Usage
To use the application, run the following command:
`npm run startApp`

This will run the `evnFlow` function, which retrieves the planned outages for each user in the `users.json` file and sends an email notification to each user.
Note that a valid api and secret keys for a mailjet account are required as a environment variables.
See more at [https://www.mailjet.com](https://www.mailjet.com/).

## Configuration
The `appCOnfig.json` contains the user data in a object of pairs of the following properties:

- email: The email address to send notifications to.
- searchLocations: An array of search locations to retrieve outage data for.

## Actions
A chron job scheduled each day at 10pm will run the whole process, thus basically automating the whole flow, so you never miss a power outage again 😉
