# Superhero Database (JSN test task) v0.0.1

A full-stack application for managing superhero information with image uploads and CRUD operations.

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **Styling**: CSS Modules

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Multer
- **API Validation**: Zod
- **Language**: TypeScript

## Setup Instructions

### 1. Clone the repository

### 2. Set up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
3. ```
   npm install
   ```

4. Set up environment variables:
   - Update the database connection string in `.env`:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/superheroes?schema=public"
     ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000` by default.

### 3. Set up the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   
   npm install
   ```

3. Start the development server:
   ```bash
   
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` by default.

## Testing

### Backend Tests
Run the following command in the backend directory:
```bash
npm test
```

## API Endpoints

- `GET /api/superheroes` - Get all superheroes
- `GET /api/superheroes/:id` - Get a single superhero by ID
- `POST /api/superheroes` - Create a new superhero
- `PUT /api/superheroes/:id` - Update a superhero
- `DELETE /api/superheroes/:id` - Delete a superhero
- `POST /api/upload` - Upload images for a superhero

