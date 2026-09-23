# Movie & Show Watchlist API

A RESTful API for managing a personal movie and show watchlist, built with Node.js, Express, and MongoDB Atlas. Track what you want to watch, what you're watching, and what you've finished organized by genre and streaming platform.

> **CSE 341 — Project 2, Part 1 (CRUD Operations).** This is Part 1 of 2. Authentication/OAuth is added in Part 2.

## Live Demo

- **API base URL:** `https://cse341-wk3-project-ptd0.onrender.com`
- **Swagger docs:** `https://cse341-wk3-project-ptd0.onrender.com/api-docs`

## Tech Stack

- **Node.js + Express** — server and routing
- **MongoDB Atlas + Mongoose** — database and schema validation
- **swagger-jsdoc + swagger-ui-express** — interactive API documentation
- **dotenv** — environment variable management
- **cors** — cross-origin resource sharing

## Features

- Full CRUD (GET, POST, PUT, DELETE) across **three collections**
- Schema-level validation: required fields, enums, numeric ranges, and unique constraints
- Consistent error handling on every route with proper HTTP status codes
- Interactive Swagger UI documentation
- A committed `swagger.json` spec file

## Data Model

### `titles` (main collection)

| Field | Type | Rules |
| --- | --- | --- |
| `title` | String | required |
| `type` | String | required, enum: `movie`, `show` |
| `releaseYear` | Number | required |
| `runtime` | Number | minutes, ≥ 0 |
| `status` | String | required, enum: `watchlist`, `watching`, `finished` |
| `rating` | Number | 1–10, optional |
| `dateWatched` | Date | optional |
| `genreId` | ObjectId | required, references `genres` |

### `genres` (lookup collection)

| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | required, unique |
| `description` | String | optional |

### `platforms` (lookup collection)

| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | required, unique |
| `description` | String | optional |
| `baseUrl` | String | optional |
| `subscriptionCost` | Number | ≥ 0, optional |

## API Endpoints

All responses are JSON. Errors return `{ "error": "message" }`.

### Titles

| Method | Route | Description | Success |
| --- | --- | --- | --- |
| GET | `/titles` | Get all titles | 200 |
| GET | `/titles/:id` | Get one title | 200 |
| POST | `/titles` | Create a title | 201 |
| PUT | `/titles/:id` | Update a title | 200 |
| DELETE | `/titles/:id` | Delete a title | 200 |

### Genres

| Method | Route | Description | Success |
| --- | --- | --- | --- |
| GET | `/genres` | Get all genres | 200 |
| GET | `/genres/:id` | Get one genre | 200 |
| POST | `/genres` | Create a genre | 201 |
| PUT | `/genres/:id` | Update a genre | 200 |
| DELETE | `/genres/:id` | Delete a genre | 200 |

### Platforms

| Method | Route | Description | Success |
| --- | --- | --- | --- |
| GET | `/platforms` | Get all platforms | 200 |
| GET | `/platforms/:id` | Get one platform | 200 |
| POST | `/platforms` | Create a platform | 201 |
| PUT | `/platforms/:id` | Update a platform | 200 |
| DELETE | `/platforms/:id` | Delete a platform | 200 |

### Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error / invalid id |
| 404 | Resource not found |
| 500 | Internal server error |

## Example Requests

Create a genre:

```bash
curl -X POST https://cse341-wk3-project-ptd0.onrender.com/genres \
  -H "Content-Type: application/json" \
  -d '{ "name": "Science Fiction", "description": "Futuristic and speculative stories" }'
```

Create a title (use a real `genreId` from the response above):

```bash
curl -X POST https://cse341-wk3-project-ptd0.onrender.com/titles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "type": "movie",
    "releaseYear": 2010,
    "runtime": 148,
    "status": "finished",
    "rating": 9,
    "genreId": "PASTE_GENRE_ID_HERE"
  }'
```

## Local Setup

### Prerequisites

- Node.js 20+
- A MongoDB Atlas account and connection string

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Asimi1234/cse341-wk3-project.git
   cd cse341-wk3-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy the template and fill in your values):

   ```bash
   cp .env.example .env
   ```

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/watchlist?retryWrites=true&w=majority
   PORT=3000
   ```

4. Start the server:

   ```bash
   npm start        # production
   npm run dev      # auto-restart on file changes
   ```

5. Open the docs at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `PORT` | No | Port to listen on (defaults to 3000) |

> `.env` is gitignored and never committed. On Render, set these in the service's **Environment** settings.

## Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com) linked to this GitHub repo.
2. Build command: `npm install` · Start command: `npm start`.
3. Add the `MONGODB_URI` environment variable in the Render dashboard.
4. In MongoDB Atlas, allow network access from anywhere (`0.0.0.0/0`) so Render can connect.

The Swagger server URL updates automatically in production via Render's `RENDER_EXTERNAL_URL`.
