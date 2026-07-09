# Warehouse Management Frontend

Frontend for the Warehouse Management System (WMS), built with **Angular 21** and **Tailwind CSS**. It provides the authentication flows (login and user registration) that communicate with the WMS backend REST API.

## Tech Stack

- [Angular](https://angular.dev/) `^21.2.0` (standalone components, signals)
- [Tailwind CSS](https://tailwindcss.com/) `^4.1.12`
- [TypeScript](https://www.typescriptlang.org/) `~5.9.2`
- [Vitest](https://vitest.dev/) `^4.0.8` (unit testing)
- [Prettier](https://prettier.io/) `^3.8.1` (code formatting)

## Prerequisites

Make sure the following tools are installed on your machine:

| Tool                           | Version                                    | Notes                                           |
| ------------------------------ | ------------------------------------------ | ----------------------------------------------- |
| [Node.js](https://nodejs.org/) | `>= 20.19` or `>= 22.12` (LTS recommended) | Required by Angular 21                          |
| [npm](https://www.npmjs.com/)  | `>= 10.9.7`                                | Used as the package manager                     |
| Angular CLI                    | `^21.2.17`                                 | Installed automatically as a project dependency |

Verify your installation:

```bash
node -v
npm -v
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/matimorici/Warehouse-Management-Frontend.git
cd Warehouse-Management-Frontend
```

### 2. Move into the Angular project

The Angular application lives inside the `wms-frontend` folder:

```bash
cd wms-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm start
```

This runs `ng serve`. Once the build finishes, open your browser at:

```
http://localhost:4200
```

The application will automatically reload whenever you modify any source file.

## Available Scripts

From the `wms-frontend` directory:

| Command                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `npm start`            | Start the dev server (`ng serve`) on `http://localhost:4200` |
| `npm run build`        | Build the project for production into `dist/`                |
| `npm run watch`        | Build in watch mode using the development configuration      |
| `npm test`             | Run unit tests with Vitest                                   |
| `npm run ng <command>` | Run any Angular CLI command                                  |

## Backend Connection

The frontend talks to the WMS backend REST API. By default, the API URL is configured in `src/app/services/auth.service.ts`:

```ts
private apiUrl = 'http://localhost:8080/api';
```

Make sure the backend is running at that address before using the login and register features. Update the URL if your backend is hosted elsewhere.

## Project Structure

```
wms-frontend/
├── public/                  # Static assets
├── src/
│   ├── index.html
│   ├── main.ts              # Bootstrap entry point
│   ├── styles.css           # Global styles (Tailwind)
│   └── app/
│       ├── app.ts           # Root component
│       ├── app.config.ts    # App providers
│       ├── app.routes.ts    # Route definitions
│       ├── pages/
│       │   ├── login/       # Login page
│       │   └── register/    # User registration page
│       └── services/
│           └── auth.service.ts  # Authentication API calls
├── angular.json
├── package.json
└── tsconfig.json
```

## Features

- 🔐 **Login** – authenticates users against the backend `/api/auth/login` endpoint.
- 📝 **Register** – registers new users via the `/api/usuarios` endpoint.
- 🎨 **Tailwind CSS** styling out of the box.
- ⚡ **Angular signals** for reactive state management.

## Build for Production

```bash
npm run build
```

The optimized artifacts will be generated in the `dist/wms-frontend/` folder and can be served by any static file server (e.g. Nginx, Vercel, Netlify, Firebase Hosting).

## Troubleshooting

- **`ng: command not found`** – the Angular CLI is a project dependency. Run it via `npm run ng <command>` instead of the global `ng`.
- **Port `4200` already in use** – start the server on a different port: `npm start -- --port 4300`.
- **API requests fail** – confirm the backend is running and that `apiUrl` in `auth.service.ts` points to the correct address.
- **Dependency issues** – delete `node_modules` and `package-lock.json`, then run `npm install` again.

Users:
- Admin:
    -00-00000000-0
    -Admin123
- Operario:
    20-00000000-8
    Password1