require('dotenv').config();
export const BASE_URL = "process.env.BACKEND";
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Signup
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get logged in user details
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
    },
    AI: {
        GENERATE_QUESTIONS: "/api/ai/generate-question", // Generate interview questions and answers using Gemini
        GENERATE_EXPLANATION: "/api/ai/generate-explanation", // Generate concept explanation using Gemini
    },
    SESSION: {
        CREATE: "/api/sessions/create", // Create a new interview session with questions api/sessions/create
        GET_ALL: "/api/sessions/my-session", // Get all user sessions
        GET_ONE: (id) => `/api/sessions/${id}`, // Get session details with questions
        DELETE: (id) => `/api/sessions/delete/${id}`, // Delete a session
    },
    QUESTION: {
        ADD_TO_SESSION: "/api/questions/add", // Add more questions to a session
        PIN: (id) => `/api/questions/${id}/pin`, // Pin or Unpin a question
        UPDATE_NOTE: (id) => `/api/questions/${id}/note`, // Update/Add a note to a question
    },
};

