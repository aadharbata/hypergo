# 🏠 Property Listing Backend

A RESTful backend built with **Node.js**, **Express**, and **MongoDB** to manage property listings, favorites, and property recommendations between users. This server supports authentication, property CRUD operations, and user interactions.

---

## 🚀 Features

- 🔐 JWT-based user authentication
- 🏡 Property CRUD (Create, Read, Update, Delete)
- ⭐ Add/remove properties to/from favorites
- 📨 Recommend properties to other users by email
- 📥 Bulk upload properties via CSV
- 📤 Export properties to CSV
- 🌐 Deployed on Vercel (serverless functions)

---

## 📁 Folder Structure

.
├── api/
│ └── index.js # Express server setup (exported as Vercel serverless function)
├── controllers/
│ ├── authController.js # Login, register
│ ├── propertyController.js # Property CRUD, CSV import/export
│ ├── favoriteController.js # Favorites logic
│ └── recommendationController.js # Property recommendation logic
├── models/
│ ├── User.js # Mongoose schema for users
│ ├── Property.js # Mongoose schema for properties
│ ├── Favorite.js # Favorites schema
│ └── Recommendation.js # Recommendations schema
├── routes/
│ └── propertyRouter.js # Express routes for all features
├── utils/
│ └── csvUtils.js # Functions to parse/export CSV files
├── .env # Environment variables
├── vercel.json # Vercel config
├── package.json
└── README.md

yaml
Copy
Edit

---

## 🧪 Tech Stack

- **Node.js**, **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **CSV Parser** for bulk data upload
- **Vercel** (deployed as serverless functions)

---

## 🔧 Environment Variables (`.env`)

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_USER_PASSWORD=aadhar123
Set these in Vercel → Project → Settings → Environment Variables too.

📦 Installation
bash
Copy
Edit
git clone https://github.com/yourusername/property-backend.git
cd property-backend
npm install
To run locally:

bash
Copy
Edit
npm start
📬 API Routes
🔐 Auth
POST /auth/register – Register new user

POST /auth/login – Login and get JWT token

🏡 Property
POST /property – Create property (auth required)

GET /property – Get all properties

POST /property/upload-csv – Upload CSV file of properties (multipart/form-data)

GET /property/export – Download properties as CSV

⭐ Favorites
POST /property/favorite/:id – Add to favorites

GET /property/favorites – Get user’s favorite properties

📨 Recommendations
POST /property/recommend – Recommend a property to a user by email

GET /property/recommendations – View properties recommended to the logged-in user

⛅ Deployment on Vercel
Your Express app is deployed via Vercel Serverless Functions.

🔄 Key files:
api/index.js — Entry point for the serverless function

vercel.json — Vercel build + route config

json
Copy
Edit
{
  "version": 2,
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.js" }]
}
📌 Future Improvements
✅ Add pagination & filtering

✅ Image uploads (Cloudinary/S3)

✅ Admin dashboard for properties

✅ Email notifications for recommendations

🙋‍♂️ Author
Aadhar Batra
mbatrajpr635@gmail.com
IIT Kharagpur | Software & Web Development
