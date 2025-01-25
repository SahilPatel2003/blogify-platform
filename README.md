# Blogify Platform - MERN Stack with Node.js Backend

This repository hosts a full-stack blogging platform built using React, Node.js, Express.js, and Tailwind CSS. It provides features for creating and managing blogs with options for drafts, scheduled posts, and publishing.

## Features

- **User Management**
  - Register using first name, last name, email, and password.
  - Login using email and password.

- **Blog Management**
  - Create a blog with the following:
    - Title
    - Subtitle
    - Big description with an editor
    - Attachments
    - URLs
  - Save as a **draft** or schedule for **future publication**.
  - Automatically change status to **published** when the scheduled time arrives.
  - Notification email to the user when the blog is published.
  - Edit or delete blogs as needed.

- **Frontend**
  - Separate user interface for showing **published blogs** only.
  - Responsive design using **Tailwind CSS**.

- **Backend**
  - Two backend implementations:
    - Express.js with MongoDB
    - HTTP and MySQL

## Technology Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB and MySQL (two implementations)

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB or MySQL setup
