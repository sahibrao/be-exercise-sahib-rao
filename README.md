# BE Exercise - Sahib Rao

## Overview

Creating a CRUD API, for users to read, create, update and delete todo list items. As DB layer is assumed to exist, the application only works within the mocked test environment.

## Libraries

- **express** – Web framework for building APIs and handling HTTP requests.
- **mongoose** – MongoDB object modeling for schema definitions, validation, and queries.
- **bcryptjs** – Password hashing library used to securely store user credentials.
- **jsonwebtoken (JWT)** – For generating and verifying authentication tokens.
- **dotenv** – Loads environment variables from a `.env` file into `process.env`.
- **cors** – Enables Cross-Origin Resource Sharing to allow requests from different domains.
- **helmet** – Adds secure HTTP headers to protect against common web vulnerabilities.
- **jest** - Ensuring relability with unit and integration testing.

## Project Structure

The project follows a `MVC-inspired architecture` with separation of concerns between routes, controllers, services, and models.

```
src/
│
├── config/              # Database connection and environment configuration
│   └── database.ts
│
├── controllers/         # Handles incoming requests and delegates logic to services
│   ├── auth.controller.ts
│   └── todo.controller.ts
│
├── middleware/          # Middleware for authentication, error handling, etc.
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── models/              # Mongoose schemas and data models
│   ├── user.model.ts
│   └── todo.model.ts
│
├── routes/              # Express route definitions
│   ├── auth.routes.ts
│   └── todo.routes.ts
│
├── services/            # Business logic and database interactions
│   ├── auth.service.ts
│   └── todo.service.ts
│
├── test/                # Unit and integration tests
│   ├── controllers/
|   |   ├── auth.controller.test.ts
|   |   └── todo.controller.test.ts
|   ├── integration/
|   |   ├── todo.integration.test.ts
│   └── services/
|       ├── auth.services.test.ts
|       └── todo.services.test.ts
│
├── types/               # Custom TypeScript types and definitions
│   └── express.d.ts
│
├── utils/               # Utility functions and request validators
│   ├── todoValidators.ts
│   └── userValidators.ts
│
│
├── app.ts               # Main Express app setup
└── ...

```
