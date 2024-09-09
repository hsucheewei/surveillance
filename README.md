# Vigilanz Surveillance System

## Overview
Vigilanz is a real-time home surveillance system that utilizes advanced object detection and real-time notifications to provide enhanced security for homeowners and small businesses. The system leverages the COCO-SSD object detection model to identify persons, pets, and vehicles, and it sends immediate email alerts when potential security threats are detected. The frontend is built using vanilla HTML, CSS, JavaScript, and Tailwind CSS, while the backend is powered by TypeScript, Express.js, and Prisma.

## Features
- **Real-time object detection**: Detects intruders, pets, and vehicles using COCO-SSD.
- **Email Alerts**: Sends real-time notifications to users when motion is detected.
- **Scalable Architecture**: Designed for multi-camera systems, with video processing done on the client-side for optimal performance.
- **User-Friendly Interface**: Simple and responsive UI for managing footage, devices, and account settings.
  
## Requirements
Before running the project, ensure that you have the following installed:
- Node.js (>= 14.x)
- Prisma
- TailwindCSS
- A database (configured in `.env`)

## Setup

### 1. Install Dependencies
First, clone the repository and install all dependencies using `npm`:
```bash
npm i
```

### 2. TailwindCSS Setup
Run TailwindCSS to compile your styles and watch for changes:
```bash
npx tailwindcss -i ./public/style.css -o ./public/output.css --watch
```

### 3. Prisma Setup
Next, ensure that your Prisma database migrations are up to date:
```bash
npx prisma migrate dev
```

### 4. Run the Development Server
To start the development server, run the following command:
```bash
npm run dev
```

This will launch the application at `http://localhost:3000`, where you can view the surveillance dashboard, manage devices, and review footage.

## Folder Structure

- **/public**: Contains static assets like styles, images, and JavaScript files.
- **/src**: Contains TypeScript source files for the backend.
- **/prisma**: Contains Prisma schema files for managing the database.
  
## Usage
1. After starting the server, navigate to `http://localhost:3000`.
2. Set up your cameras in the **Devices** section.
3. View captured footage and alerts under the **Footage** section.
4. Customize your account settings in the **Settings** section.
  
## Technologies Used
- **Frontend**: Vanilla HTML, CSS, JavaScript, TailwindCSS
- **Backend**: TypeScript, Express.js
- **Database**: Prisma ORM

## Development Commands

- **Compile TailwindCSS**:
  ```bash
  npx tailwindcss -i ./public/style.css -o ./public/output.css --watch
  ```

- **Run Database Migrations**:
  ```bash
  npx prisma migrate dev
  ```

- **Install Dependencies**:
  ```bash
  npm i
  ```

- **Start Development Server**:
  ```bash
  npm run dev
  ```
