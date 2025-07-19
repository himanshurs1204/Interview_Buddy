import axios from 'axios'
import { BASE_URL } from "./apiPath";


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers:{
        "Content-Type" :"application/json",
        Accept:"application/json"
    },
})

// Request Interceptor
axiosInstance.interceptors.request.use( (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Response Interceptor
axios.interceptors.response.use(
    (response) =>{
        return response;
    },
    (error) =>{
        // handle common error globally 
        if(error.response){
            if(error.response.status === 401){
                // Redirect to Login Page
                window.location.href = '/';
            }
            else if(error.response.status === 500){
                console.error("server error. Please try again")
            }
            else if(error.code === "ECONNABORTED"){
                console.error("Request Timeout. Please try again")
            }
        }
        return Promise.reject(error)
    }
);


export default axiosInstance;