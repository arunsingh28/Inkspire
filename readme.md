# Inkspire  

## Description  
Inkspire is a full-stack application designed to deliver a seamless blogging experience. It consists of a **server** built with TypeScript and Node.js, and a **client** powered by React and Vite. This project is designed for scalability, performance, and ease of development.  

---

## Table of Contents  
1. [Prerequisites](#prerequisites)  
2. [Project Structure](#project-structure)  
3. [Setup and Installation](#setup-and-installation)  
   - [Backend (Server)](#backend-server)  
   - [Frontend (Client)](#frontend-client)  
4. [Environment Configuration](#environment-configuration)  
5. [Scripts](#scripts)  
6. [Deployment](#deployment)  

---

## Prerequisites  
Before you begin, ensure you have the following installed on your system:  
- **Node.js** (v18.x or higher recommended)  
- **pnpm** (preferred) or npm  
- A modern browser for client testing  

---

## Project Structure  
```plaintext  
Inkspire  
├── server         # Backend codebase (Node.js, TypeScript)  
├── client         # Frontend codebase (React, Vite)  
├── .github        # Github action 

```  

---

## Setup and Installation  

### Backend (Server)  
1. Navigate to the `server` directory:  
   ```bash  
   cd server  
   ```  
2. Install dependencies:  
   ```bash  
   pnpm install  
   # Or, if pnpm is not installed  
   npm install  
   ```  
3. Build the project:  
   ```bash  
   pnpm build  
   ```  
4. Start the project:  
   - For production:  
     ```bash  
     pnpm start  
     ```  
   - For development:  
     ```bash  
     pnpm dev  
     ```  

### Frontend (Client)  
1. Navigate to the `client` directory:  
   ```bash  
   cd client  
   ```  
2. Install dependencies:  
   ```bash  
   pnpm install  
   # Or, if pnpm is not installed  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   pnpm dev  
   ```  
   The application will be available at `http://localhost:5173`.  

---

## Environment Configuration  
1. An `.env.example` file is provided in the `server` directory.  
2. Create a `.env` file in the same directory and populate it with the necessary environment variables, such as:  
   - AWS keys  
   - MongoDB URI  

Example:  
```plaintext  
AWS_ACCESS_KEY_ID=your_access_key  
AWS_SECRET_ACCESS_KEY=your_secret_key  
MONGO_URI=your_mongo_uri  
```  

3. The client does not require environment variables for local development unless specified.

---

## Scripts  

### Backend (Server)  
- `pnpm build` - Compiles the TypeScript files to JavaScript.  
- `pnpm start` - Starts the application in production mode using `dist/app.js`.  
- `pnpm dev` - Starts the development server with `nodemon` for hot-reloading.  

### Frontend (Client)  
- `pnpm dev` - Starts the development server with Vite.  
- `pnpm build` - Builds the client for production.  
- `pnpm lint` - Runs ESLint for code quality checks.  
- `pnpm preview` - Serves the built production files locally for preview.  

---

## Deployment  
For deployment, build both the client and server, configure the environment variables, and serve the files using a production server or a cloud service like AWS 


