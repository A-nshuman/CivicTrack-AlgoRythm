# CivicTracker
https://civic-track.netlify.app/

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules .

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


---

## CivicTrack API Documentation

### Base URL

```
http://35.209.137.61:5050/
```

---

### Authentication

#### `POST /auth/login`
- **Description:** Login with email and password.
- **Body:** `{ email, password }`
- **Response:** User object, sets `session_id` cookie.

#### `POST /auth/register`
- **Description:** Register a new user.
- **Body:** `{ email, password, name }`
- **Response:** User object, sets `session_id` cookie.

#### `GET /auth/me`
- **Description:** Get current logged-in user.
- **Response:** User object.

---

### Tickets

#### `GET /tickets`
- **Description:** List tickets (filter by location, category, status, title).
- **Query Params:** `lat`, `long`, `dist`, `category`, `status`, `title`
- **Response:** Array of tickets.

#### `GET /tickets/:id`
- **Description:** Get ticket by ID.
- **Response:** Ticket object.

#### `POST /tickets/create`
- **Description:** Create a new ticket.
- **Body:** `{ title, description, category, anonymous, coordinates }`
- **Files:** Up to 5 photos (`photos`)
- **Response:** Created ticket.

#### `DELETE /tickets/delete/:id`
- **Description:** Delete a ticket (reporter or admin only).
- **Response:** Success message.

#### `PUT /tickets/set-status/:id`
- **Description:** Update ticket status (admin only).
- **Body:** `{ status }`
- **Response:** Updated ticket.

#### `PUT /tickets/set-location/:id`
- **Description:** Update ticket location (reporter or admin).
- **Body:** `{ coordinates: { lat, long } }`
- **Response:** Updated ticket.

#### `PUT /tickets/update/:id`
- **Description:** Update ticket details (reporter only).
- **Body:** `{ title, description, category }`
- **Response:** Updated ticket.

#### `POST /tickets/:id/report`
- **Description:** Report a ticket (add comment).
- **Body:** `{ comment }`
- **Response:** Updated ticket.

---

### Admin

> All `/admin` routes require authentication and user must not be banned.

#### `GET /admin/reported-tickets`
- **Description:** List tickets with reports.
- **Response:** Array of reported tickets.

#### `GET /admin/clear-reports/:id`
- **Description:** Clear reports for a ticket.
- **Response:** Success message.

#### `GET /admin/ban-user/:email`
- **Description:** Ban a user by email.
- **Response:** Success message.

#### `GET /admin/unban-user/:email`
- **Description:** Unban a user by email.
- **Response:** Success message.

#### `GET /admin/stats`
- **Description:** Get system statistics.
- **Response:** Stats object.

#### `GET /admin/banned-users`
- **Description:** List banned users.
- **Response:** Array of users.

---

### Notes

- All endpoints expect and return JSON unless otherwise specified.
- Authentication is managed via cookies (`session_id`).
- Add request/response examples, error codes, and field descriptions as needed.

---
