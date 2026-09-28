# Movie & Show Watchlist API

A REST API for keeping track of the movies and shows you want to watch, are watching, or have finished, organized by genre. Built with Node.js, Express, and MongoDB Atlas.

Anyone can browse the watchlist, but you have to log in with GitHub before you can add, edit, or delete anything.

> CSE 341 — Project 2. Part 1 was the CRUD work on titles and genres; Part 2 added the GitHub OAuth login and locked down the write routes.

## Live Demo

- **API base URL:** `https://cse341-wk3-project-ptd0.onrender.com`
- **Swagger docs:** `https://cse341-wk3-project-ptd0.onrender.com/api-docs`

## Tech Stack

- Node.js + Express for the server
- MongoDB Atlas with Mongoose for storage and validation
- Passport (GitHub OAuth) + express-session for auth, with sessions stored in MongoDB via connect-mongo
- swagger-jsdoc + swagger-ui-express for the docs
- dotenv and cors

## What it does

- Full CRUD on titles and genres
- Validation lives in the Mongoose schemas — required fields, enums, number ranges, unique names
- Every route is wrapped in try/catch and returns a sensible status code with a `{ "error": "..." }` body
- GitHub login required for any write; reads are open to everyone
- Swagger docs at `/api-docs`, plus a `swagger.json` in the repo

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

### `users`

Created automatically the first time someone logs in with GitHub — you don't POST to this one directly.

| Field | Type | Rules |
| --- | --- | --- |
| `githubId` | String | required, unique |
| `username` | String | required |
| `email` | String | optional |
| `createdAt` | Date | defaults to now |

## Logging in

Auth is GitHub OAuth. To log in, open `/auth/github` in a browser — it sends you to GitHub, and once you approve, GitHub redirects back to `/auth/github/callback`, a session cookie gets set, and you land on the docs. The session is what the write routes check for.

Because it's cookie-based, the login only works in a real browser. The Swagger "Try it out" button works too once you've logged in, since the docs and the API live on the same domain and share the cookie — but you can't log in *through* Swagger, only through `/auth/github`.

| Route | What it does |
| --- | --- |
| GET `/auth/github` | Starts the GitHub login (open this in a browser) |
| GET `/auth/github/callback` | Where GitHub sends you back; creates the session |
| GET `/auth/logout` | Ends the session |
| GET `/auth/status` | Handy for checking whether you're logged in — returns `{ loggedIn, user }` |

Anything that changes data needs you to be logged in. If you're not, those routes return `401 { "error": "Not authenticated" }`:

- POST, PUT, DELETE on `/titles`
- POST, PUT, DELETE on `/genres`

The GET routes stay public.

## API Endpoints

All responses are JSON. Errors come back as `{ "error": "message" }`. A 🔒 means you need to be logged in.

### Titles

| Method | Route | Description | Success |
| --- | --- | --- | --- |
| GET | `/titles` | Get all titles | 200 |
| GET | `/titles/:id` | Get one title | 200 |
| POST | `/titles` | Create a title 🔒 | 201 |
| PUT | `/titles/:id` | Update a title 🔒 | 200 |
| DELETE | `/titles/:id` | Delete a title 🔒 | 200 |

### Genres

| Method | Route | Description | Success |
| --- | --- | --- | --- |
| GET | `/genres` | Get all genres | 200 |
| GET | `/genres/:id` | Get one genre | 200 |
| POST | `/genres` | Create a genre 🔒 | 201 |
| PUT | `/genres/:id` | Update a genre 🔒 | 200 |
| DELETE | `/genres/:id` | Delete a genre 🔒 | 200 |

### Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error / invalid id |
| 401 | Not logged in (on a protected route) |
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

3. Copy the env template and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/watchlist?retryWrites=true&w=majority
   PORT=3000
   SESSION_SECRET=any-long-random-string
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
   ```

   You get the GitHub values by registering an OAuth app under GitHub → Settings → Developer settings → OAuth Apps. The callback URL there has to match `GITHUB_CALLBACK_URL` exactly. Since a GitHub OAuth app only allows one callback, I use a separate app for local (`localhost`) and for the deployed site.

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
| `SESSION_SECRET` | Yes | Signs the session cookie — any long random string |
| `GITHUB_CLIENT_ID` | Yes | From your GitHub OAuth app |
| `GITHUB_CLIENT_SECRET` | Yes | From your GitHub OAuth app |
| `GITHUB_CALLBACK_URL` | Yes | Must match the callback registered on GitHub |
| `PORT` | No | Port to listen on (defaults to 3000) |

`.env` is gitignored and never committed. On Render these go in the service's Environment settings — and watch out, the value field takes just the value, not the whole `KEY=value` line.

## Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com) linked to this GitHub repo.
2. Build command: `npm install` · Start command: `npm start`.
3. Add all the environment variables from the table above in the Render dashboard. `GITHUB_CALLBACK_URL` here should be the deployed URL, e.g. `https://your-app.onrender.com/auth/github/callback`, and that same URL needs to be the callback on your production GitHub OAuth app.
4. In MongoDB Atlas, allow network access from anywhere (`0.0.0.0/0`) so Render can connect.

The Swagger server URL updates automatically in production via Render's `RENDER_EXTERNAL_URL`.
