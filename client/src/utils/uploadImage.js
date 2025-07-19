import {API_PATHS} from './apiPath'
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) =>{
    const formData = new FormData();
    // Appemd image file to form data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers:{'Content-Type':'multipart/form-data',}   //set header for file upload 
        });
        return response.data  // Return response data




    } catch (error) {
        console.error('error uploading image: ', error)
        throw error; // Rethrow error for handeling
    }
}

export default uploadImage;
