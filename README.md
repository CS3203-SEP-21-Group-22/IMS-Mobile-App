# Inventory Management System for computer laboratories - Mobile Application

## Local Development Setup

### Prerequisites

- [Node.js v20+](https://nodejs.org/en/download/) installed on your local machine
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed on your local machine
- [Authentication Service](https://github.com/CS3203-SEP-21-Group-22/authentication-server) setup and running
- [Backend Service](https://github.com/CS3203-SEP-21-Group-22/IMS-Backend) setup and running

### Steps

1. Clone the repository.

   ```
   git clone https://github.com/CS3203-SEP-21-Group-22/IMS-Mobile-App.git
   ```

2. Navigate to the project directory.

   ```
   cd IMS-Mobile-App
   ```

3. Run the following command to install the dependencies.

   ```
   npm install
   ```

4. In `app.json`, replace following values in UpperCase letters with the registered Client ID and URLs of the Authentication and Backend Services.

   ```json
   {
     "expo": {
       "authServerUrl": "URL_OF_AUTHENTICATION_SERVER",
       "authClientId": "CLIENT_ID_REGISTERED_ON_AUTHENTICATION_SERVER",
       "backendAPIUrl": "URL_OF_BACKEND_SERVER/api"
     }
   }
   ```

5. Run the following command to start the development server.

   ```
   npm start
   ```

6. Open the Expo Go app on your mobile device and scan the QR code displayed in the terminal.
