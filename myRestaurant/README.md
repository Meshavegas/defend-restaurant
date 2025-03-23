# Defend Restaurant

## Project Overview

A restaurant management application with a FastAPI backend and a React Native frontend using Expo.

## Prerequisites

- Python 3.x
- Node.js and npm
- SQL Server
- Expo CLI (`npm install -g expo-cli`)

## Project Structure

- `/Backend` - FastAPI backend, database access, and business logic
- `/myRestaurant` - React Native/Expo mobile application frontend

## Setup Instructions

### Backend Setup (FastAPI)

1. Navigate to the Backend directory:

   ```bash
   cd Backend
   ```

2. Create a Python virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:
     ```bash
     .\venv\Scripts\Activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:

   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at http://localhost:8000

### Frontend Setup (React Native/Expo)

1. Navigate to the myRestaurant directory:

   ```bash
   cd myRestaurant
   ```

2. Install the required npm packages:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npm start
   # or
   expo start
   ```

4. Run the application:

   - Scan the QR code with Expo Go app on your iOS/Android device
   - Press `a` to run on an Android emulator (must be running)
   - Press `i` to run on an iOS simulator (macOS only, requires Xcode)

## Development Notes

### Backend Development

- API documentation is available at http://localhost:8000/docs when the server is running
- The backend uses FastAPI with SQLAlchemy for database access
- Make sure SQLite is running before starting the backend

### Frontend Development

- The application is built using React Native and Expo
- The main entry point is `App.js`
- Screen components are located in the `/Screens` directory
- Static assets are stored in the `/assets` directory

## Troubleshooting

### Backend Issues

- Check that all required Python packages are installed

### Frontend Issues

- Make sure to have the latest version of Node.js and npm
- If you encounter package dependency issues, try running `npm install` again
- For Expo connection problems, ensure your device is on the same network as your development machine

## License

not yet

## Contact

[Your Contact Information Here]
