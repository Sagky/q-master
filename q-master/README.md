# Q Master

Q Master is a beginner-friendly Smart Queue Management System prototype for one restaurant, **Nhas City Chicken**. Customers scan a QR code at the restaurant entrance or on the table, open the landing page, and join the digital walk-in queue instead of waiting in a physical line.

This project is intentionally simple for a university software architecture project. It uses a **Layered Monolithic Architecture**, Node.js, Express.js, plain HTML, CSS, JavaScript, and an in-memory data store.

## Features

- QR-style landing page for Nhas City Chicken
- Customer queue page at `/queue`
- Automatically generated ticket numbers such as `A001`, `A002`, and `A003`
- Queue position and estimated waiting time
- Current serving ticket display
- Administrator dashboard at `/admin`
- Call next customer
- Skip or remove customers
- Pause and resume the queue
- Queue history with action time
- Basic queue statistics
- Simple polling every 3 seconds for live updates

## Architecture Explanation

Q Master uses a **Layered Monolithic Architecture**. All code runs as one application, but the responsibilities are separated into layers.

### Presentation Layer

Located in `public/`.

- `landing.html` shows the QR code entry page.
- `index.html` shows the end user queue page.
- `admin.html` shows the administrator dashboard.
- `style.css` contains the mobile-friendly visual design.
- `app.js` handles customer page interactions and polling.
- `admin.js` handles administrator dashboard interactions and polling.

### HTTP Server and API Routing

Located in `server.js`.

This file starts the Express server, serves the HTML pages, and defines the API routes.

### Application Layer / Business Logic

Located in `queueService.js`.

This file contains the main queue rules:

- Users cannot join when the queue is paused.
- Ticket numbers are generated automatically.
- Estimated waiting time is calculated as people ahead multiplied by 5 minutes.
- Calling next marks the first waiting ticket as served.
- Skipping and removing tickets move them into history.

### Data Layer

Located in `dataStore.js`.

This file stores the shared queue state in memory. There is no database in this prototype.

### Real-Time Communication Layer Simulation

Located in `public/app.js` and `public/admin.js`.

Both pages poll `/api/queue` every 3 seconds. This simulates live updates without using WebSockets.

## File Structure

```text
q-master/
  public/
    landing.html
    index.html
    admin.html
    style.css
    app.js
    admin.js
  server.js
  queueService.js
  dataStore.js
  package.json
  README.md
```

## API Endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | Landing page |
| GET | `/queue` | Customer queue page |
| GET | `/admin` | Administrator dashboard |
| POST | `/api/join` | Join the queue |
| GET | `/api/queue` | Get queue state |
| POST | `/api/call-next` | Serve the next waiting customer |
| POST | `/api/skip/:ticket` | Skip one ticket |
| POST | `/api/remove/:ticket` | Remove one ticket |
| POST | `/api/pause` | Pause the queue |
| POST | `/api/resume` | Resume the queue |

## How to Run Locally

1. Install Node.js version 18 or newer.
2. Open a terminal in the `q-master` folder.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm start
```

5. Open the app in your browser:

```text
http://localhost:3000
```

Customer page:

```text
http://localhost:3000/queue
```

Admin dashboard:

```text
http://localhost:3000/admin
```

## How to Deploy on Render

1. Push this project to a GitHub repository.
2. Log in to Render.
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Use these settings:

```text
Environment: Node
Build Command: npm install
Start Command: npm start
```

6. Deploy the service.

The server uses:

```js
process.env.PORT || 3000
```

This is required because Render provides the production port through the `PORT` environment variable.

## Demo Admin Access Notice

The administrator dashboard is open only for demonstration purposes. In a production environment, it would be protected by authentication and role-based access control.

## Prototype Limits

This prototype does not include:

- Login or authentication
- Payment features
- SMS, WhatsApp, or email APIs
- AI waiting time prediction
- Multi-organization support
- Microservices
- A database

The queue state is stored in memory, so it resets when the server restarts.
