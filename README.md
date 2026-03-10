# Restaurant Web App

A comprehensive full-stack web application for a restaurant, built with a Django backend and a React (TypeScript) frontend.

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Menu Management**: Browse menu items categorized by type.
- **Cart & Ordering**: Manage cart items and place orders seamlessly.
- **Advanced Admin Dashboard**:
  - Manage menu items, categories, and track orders.
  - Data visualization with charts.
- **Responsive Design**: Functional and visually appealing on all device sizes.

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS (or styled-components depending on configuration)
- Zustand (for state management)
- Vite

### Backend
- Django
- Django REST Framework (DRF)
- PostgreSQL
- Simple JWT (for authentication)

## Project Structure

- `frontend/`: Contains the React Vite application.
- `backend/`: Contains the Django project and applications.

## API Documentation
The API can be tested using the provided `Restaurant_Web_App.postman_collection.json` file.

## Setup Instructions

### Backend Setup
1. Navigate to the \`backend\` directory.
2. Create a virtual environment: \`python -m venv venv\`
3. Activate the virtual environment.
4. Install dependencies: \`pip install -r requirements.txt\`
5. Apply migrations: \`python manage.py migrate\`
6. Run the server: \`python manage.py runserver\`

### Frontend Setup
1. Navigate to the \`frontend\` directory.
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm run dev\`
