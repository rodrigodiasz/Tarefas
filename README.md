# Tarefas+ — Task Manager

A Next.js application for task management, providing an intuitive and efficient way to organize daily activities. With **Tarefas**, users can authenticate via **Google Authentication** and perform full CRUD operations on their tasks in real time.

## Features

- **Task Management**: Create, edit, and delete tasks seamlessly.
- **Real-time Synchronization**: Tasks are stored and updated dynamically using Firebase Firestore.
- **Secure Authentication**: Login with **Google Authentication** via Firebase for personalized task management.
- **Responsive Interface**: A modern and adaptive UI built with **Tailwind CSS** for an optimal experience on all devices.
- **Optimized Performance**: Uses **Next.js** for fast page loads and improved user experience.

## How It Works

1. The user authenticates using **Google Authentication** via Firebase.
2. After logging in, the user gains access to a dashboard where they can create, edit, and delete tasks.
3. Tasks are stored in **Firebase Firestore**, ensuring real-time updates and data persistence.
4. The application provides a smooth and efficient experience using **Next.js**.

## Technologies Used

- **Next.js**: A React framework with server-side rendering and optimized performance.
- **Tailwind CSS**: A utility-first CSS framework for responsive and modern styling.
- **Firebase**: Used for Google Authentication and Firestore database to handle CRUD operations.

## How to Get Started

```bash
# Clone the repository
git clone https://github.com/rodrigodiasz/Tarefas.git

# Navigate to the project directory
cd Tarefas

# Install the dependencies
npm install

# Run the application
npm run dev
