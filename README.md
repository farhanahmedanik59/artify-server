# Artify 🎨

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/artify-server?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/yourusername/artify-server?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/yourusername/artify-server?style=for-the-badge)
![License](https://img.shields.io/github/license/yourusername/artify-server?style=for-the-badge)

Artify is a platform for **art sharing**, allowing artists and enthusiasts to showcase and explore creative works.  
This repository contains the **backend server** built with **Express.js**.

---

## 🌟 Features

- Upload, share, and explore artworks.
- User authentication and profile management.
- Categorize and search artworks by tags or artists.
- RESTful API for frontend integration.
- Secure image upload and storage.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Authentication:** JWT or session-based
- **Environment Management:** dotenv

---

## 🚀 Demo

> **Frontend Demo:** [Website Link](https://assignment10-297ce.web.app/)  






---

## ⚡ Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/artify-server.git
cd artify-server
Install dependencies

#bash
Copy code
npm install
Set up environment variables

Create a .env file in the root directory:

#.env
Copy code
PORT=5000
DB_URI=your_database_uri
JWT_SECRET=your_jwt_secret
Start the server

#bash
Copy code
npm start
Server runs at http://localhost:5000.

📦 API Endpoints
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Login existing user
GET	/api/artworks	Fetch all artworks
POST	/api/artworks	Upload a new artwork
GET	/api/artworks/:id	Get artwork details
DELETE	/api/artworks/:id	Delete an artwork

(Add more endpoints as per your server routes)

🤝 Contributing
Contributions are welcome! Follow these steps:

Fork the repository

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m 'Add some feature'

Push to the branch: git push origin feature-name

Open a Pull Request

📝 License
This project is licensed under the MIT License.

💡 Notes / TODO
Add more API endpoints for comments and likes

Integrate with frontend for live previews

Add cloud storage for artwork images (AWS S3, Cloudinary, etc.)

Add automated tests for endpoints
