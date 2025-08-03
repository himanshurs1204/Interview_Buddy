# Interview Buddy 🎯

**Interview Buddy** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that uses the **Gemini AI API** to generate personalized technical interview questions. It is designed to help job seekers streamline their preparation through realistic, AI-curated question sets, tailored to their skills and preferences.

---

## 🚀 Features

- 💬 **AI-Powered Questions**: Uses Gemini API to generate personalized technical interview questions.
- 🔐 **Secure Authentication**: User login/registration with hashed passwords (bcrypt.js) and JWT-based session management.
- 📊 **Question History**: View previously generated sessions and track your preparation.
- 🌐 **RESTful API Backend**: Built with Node.js and Express.js, connected to MongoDB.
- 💻 **Clean & Responsive UI**: Built with React.js, designed for smooth navigation and usability.

---

## 📸 Preview

| Login Page                     | Dashboard with Generated Questions     |
|-------------------------------|----------------------------------------|
| ![Login Page](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

> Add your screenshots to a `/screenshots` folder and update the file paths above accordingly.

---

## 🛠️ Tech Stack

| Tech        | Description                                |
|-------------|--------------------------------------------|
| React.js    | Frontend library                           |
| Node.js     | Backend runtime environment                |
| Express.js  | REST API framework                         |
| MongoDB     | NoSQL database                             |
| Gemini API  | AI-powered interview question generation   |
| bcrypt.js   | Password hashing                           |
| JWT         | Token-based authentication                 |

---

## 📂 Project Structure

```
InterviewBuddy/
├── client/                 # React frontend
│   └── src/
│       └── components/
├── server/                 # Express backend
│   └── routes/
│   └── controllers/
├── .env                    # Environment variables
├── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or cloud via Atlas)
- Gemini AI API key (from Google AI)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/interview-buddy.git
cd interview-buddy
```

### 2. Setup Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

### 4. Run the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd client
npm start
```

The app will run at: `http://localhost:3000`

---

## 🧠 How It Works

1. **User Signup/Login** → Authenticated using JWT & bcrypt.js.
2. **Generate Questions** → Sends a prompt to Gemini API.
3. **Store Sessions** → MongoDB stores user sessions and generated question sets.
4. **Review Past Sessions** → Users can view their previous interactions.

---

## 🛡️ Security Highlights

- Passwords hashed using `bcrypt.js`.
- JWT-based token auth for stateless and secure login.
- Protected API routes for authenticated access only.

---

## 📌 Future Enhancements

- 📅 Add scheduling feature for mock interviews.
- 📈 Analytics dashboard for preparation trends.
- 📁 Resume upload and smart analysis.

---

## 🤝 Contributing

Feel free to fork the project and submit pull requests or suggestions. Contributions are welcome!

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgments

- [Google Gemini API](https://ai.google.dev/)
- [MongoDB](https://www.mongodb.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)

---
