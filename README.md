# Mini Transaction App with Nest.js

This is a mini transaction application built with Nest.js. It provides APIs for managing transactions between accounts.

## Installation

To run this application locally, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone <repository-url>
    ```

2. Navigate into the cloned directory:

    ```bash
    cd <Your-folder>
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

Before running the application, ensure that you have MongoDB installed and running on your local machine and set up mongodb replicaSet/cluster on your local machine. You may need to create the database configuration in the `src/config/database.config.ts` file if you're using a different database setup.

## Running the Application

Once you have installed the dependencies and configured the database, you can start the application using the following command:

    ```bash
    npm run start:dev
    ```

This command will start the application in development mode. You should see output indicating that the server is running and listening on a port (usually 3000 by default).

## Usage

You can now access the APIs provided by the application. The available endpoints include:

- `/transactions`: API endpoints for managing transactions
- `/accounts`: API endpoints for managing accounts
- `/auth`: API endpoints for user authentication and authorization
- `/user`: API endpoints for users aside authentication and authorization

You can explore the API documentation or the source code to understand how to interact with these endpoints.

## API Documentation

The API documentation is available via POSTMAN. You can access the API documentation by navigating to <url> in your web browser.

## Architectural Decisions

## Technologies Used

Nest.js: Chosen for its modular and scalable architecture, as well as its extensive ecosystem of libraries.
MongoDB: Selected as the database for its flexibility and scalability, suitable for handling transactional data.
Docker: Utilized for containerization to ensure easy deployment and scalability of the application.

## Project Structure
The project follows a modular structure, with separate modules for authentication, transactions, users and accounts and are all save in a folder called modules. This allows for better organization and separation of concerns.

## Error Handling
Error handling is implemented using Nest.js's built-in exception filter to provide informative error messages and appropriate HTTP status codes for client responses.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository, make your changes, and submit a pull request.
