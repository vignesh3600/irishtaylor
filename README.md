# MERN Clothing Store Assessment

Full stack ecommerce CRUD app for clothing products with role based JWT auth, RTK Query state management, Yup frontend validation, express-validator backend validation, Socket.io stock alerts, MongoDB/Mongoose plugins, reusable UI components, and backend tests with Mocha/Chai.

## Features

- Admin: create, view, update, delete products and view registered users.
- Admin: upload product images while creating or editing products.
- User: browse products, add/remove cart items, update quantities, and view cart totals.
- Auth: register/login/logout client flow, JWT API security, role based access for `admin` and `user`.

- Validation: server side `express-validator` rules with `matchedData(req)` and client Yup onchange validation.
- Realtime: Socket.io emits notifications when product stock changes.
- Data layer: Mongoose schemas use pagination, soft delete, lean virtuals, and custom audit plugins.
- UI: React, Tailwind, Shadcn-style reusable components, theme toggle, modals, product cards, and error boundary.
- Tests: route and controller coverage using Mocha, Chai, Supertest, and mongodb-memory-server.

## API Response Format

Every backend API uses the same success/error contract.

```json
{
  "success": true,
  "result": {},
  "message": "Operation completed successfully"
}
```

```json
{
  "success": false,
  "result": null,
  "message": "Readable error message"
}
```

## Setup

1. Install dependencies:
   npm install
   
2. Copy env examples:
   copy server\.env.example server\.env
   copy client\.env.example client\.env
   
3. Run both apps:
   npm run dev

4. seed admin user
   npm run seed


## Commands

```bash
npm test
npm run build
npm run dev --workspace server
npm run dev --workspace client
```

## Demo Roles

The first registered user can be promoted manually in MongoDB by setting `role: "admin"`, or you can create an admin through a seed/script. New registrations default to `user`.


## AI Tools Used

- Codex:
used codex to setup the boiler plate for redux to eliminate the time and used it for api integation with codex


- chatgpt:
used chatgpt for the shadecn

