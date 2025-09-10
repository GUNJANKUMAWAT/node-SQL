Goodreads Book Management API
A simple and lightweight RESTful API for managing a collection of books, built with Node.js, Express, and SQLite. This project features basic CRUD (Create, Read, Update, Delete) operations for books and uses JSON Web Tokens (JWT) for authentication to protect certain endpoints.

Features
Database Initialization: Automatically connects to an SQLite database.

CRUD Operations:

Create: Add new books to the database.

Read: Fetch all books, a specific book by ID, or filter books by name.

Update: Modify the details of an existing book.

Delete: Remove a book from the database.

JWT Authentication: A middleware secures endpoints, requiring a valid token for access.

Simple Login: A basic login system to generate JWT tokens for users.

Technologies Used
Backend: Node.js, Express.js

Database: SQLite3 with the sqlite wrapper for async/await support.

Authentication: jsonwebtoken for creating and verifying JWTs.

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

Prerequisites
You need to have Node.js and npm installed on your machine.

Installation
Clone the repository (or simply save the code in a local directory).

Navigate to the project directory:

cd /path/to/your-project

Install the required npm packages:

npm install express sqlite3 sqlite jsonwebtoken

Start the server:
Assuming your main file is named app.js:

node app.js

You should see the following message in your console, indicating that the server has started successfully:

Server got Started

The server will be running on http://localhost:3000.

API Endpoints
The base URL for all endpoints is http://localhost:3000.

Database Setup
1. Create Book Table
This endpoint sets up the BOOK table in the database. You only need to run this once.

URL: /create/

Method: GET

Description: Creates the BOOK table with BOOK_ID and BOOK_NAME columns.

cURL Example:

curl http://localhost:3000/create/

Authentication
2. User Login
URL: /login/

Method: POST

Description: Authenticates a user and returns a JWT token upon success. Use this token for accessing protected routes.

Request Body:

{
    "username": "admin",
    "password": "admin"
}

cURL Example:

curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "admin"}' http://localhost:3000/login/

This will return a JWT token string. You will need to copy this token.

Book Management (CRUD)
Note: The following endpoints are protected. You must include the JWT token in the Authorization header as Bearer YOUR_JWT_TOKEN.

3. Add a New Book
URL: /addbook

Method: POST

Description: Adds a new book to the database.

Request Body:

{
    "id": 1,
    "name": "The Lord of the Rings"
}

cURL Example:

curl -X POST -H "Content-Type: application/json" -d '{"id": 1, "name": "The Lord of the Rings"}' http://localhost:3000/addbook

4. Get All Books
URL: /book/

Method: GET

Auth: Required.

Description: Retrieves a list of all books in the database.

cURL Example:

curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/book/

5. Get a Specific Book
URL: /book/:id

Method: GET

Auth: Required.

Description: Retrieves a single book by its BOOK_ID.

cURL Example:

# Replace 1 with the actual book ID
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/book/1

6. Update a Book
URL: /update/:id

Method: PUT

Auth: Required.

Description: Updates the name of a book specified by its BOOK_ID.

Request Body:

{
    "name": "The Hobbit"
}

cURL Example:

# Replace 1 with the actual book ID
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"name": "The Hobbit"}' http://localhost:3000/update/1

7. Delete a Book
URL: /remove/:id

Method: DELETE

Auth: Required.

Description: Deletes a book from the database by its BOOK_ID.

cURL Example:

# Replace 1 with the actual book ID
curl -X DELETE -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/remove/1

8. Filter/Search for Books
URL: /getbook/

Method: GET

Description: Searches for books where the name contains the provided query string. This route is not protected.

Query Parameter: search_q

cURL Example:

# Searches for books with "Lord" in the name
curl "http://localhost:3000/getbook/?search_q=Lord"
