# GitHub Release Stats Backend

This is a backend developed using JavaScript, Express.js, and MongoDB.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- MongoDB

### Installing

1. Clone the repository:
    ```bash
    git clone https://github.com/RLAlpha49/github-release-stats-backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

- POST `/api/save-stats/:repo`: Save stats for a specific repository.
- GET `/api/get-stats/:repo`: Get stats for a specific repository.

## Running the Tests

Explain how to run the automated tests for this system.

## Deployment

Add additional notes about how to deploy this on a live system.

## Built With

- [Express.js](https://expressjs.com/) - The web framework used.
- [MongoDB](https://www.mongodb.com/) - The database used.

## License

This project is licensed under the GPL v3 License - see the [LICENSE](LICENSE) file for details.