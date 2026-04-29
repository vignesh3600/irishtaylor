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

4. seed admin user ( or ) manually update role in the db level 
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
I used Codex to accelerate the initial development process, especially for setting up the Redux architecture and integrating APIs efficiently.

Instead of manually writing boilerplate code—which is repetitive and time-consuming—I leveraged Codex to:
* Generate a standard Redux folder structure (store, slices, reducers, actions)
* Configure Redux Toolkit with best practices
* Automatically create async thunks for API calls
* Reduce manual errors in setup and improve consistency

For API integration, I provided my backend endpoints to Codex and used it to:

* Create Redux async actions (createAsyncThunk)
* Handle loading, success, and error states
* Structure reducers to manage API responses cleanly
* Ensure proper state normalization

This significantly reduced development time and allowed me to focus more on business logic rather than repetitive setup.

- chatgpt:
I used ChatGPT to integrate shadcn/ui, which is a modern UI component library for building clean and accessible interfaces like product card and card contents.

Specifically, ChatGPT helped me:

* Quickly set up ShadCN in my React project
* Generate UI components like: Forms, Buttons, Modals
* Ensure proper Tailwind CSS integration

This improved the UI development speed and ensured a professional design system.

- Codex:
I also used Codex to generate unit tests, which helped ensure code reliability and maintainability.

With Codex, I was able to:

* Generate test cases
* Write tests for API integration logic
* Instead of writing tests from scratch, I provided my functions/components and Codex generated: Structured test suites, Mock API calls

This ensured better code quality while saving time during development.

