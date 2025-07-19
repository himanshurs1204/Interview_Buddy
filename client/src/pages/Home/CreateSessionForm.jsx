import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import SpinnerLoader from '../../components/loader/SpinnerLoader';
import axiosInstance from './../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';



const CreateSessionForm = () => {
    
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)

    const navigate = useNavigate();
    const handleChange = (key, value) =>{
        setFormData((prevData) => ({
            ...prevData,
            [key]: value
        }))
    }

    const handleCreateSession = async (e) =>{
        e.preventDefault();
        const { role, experience, topicsToFocus } = formData;
        if(!role || !experience || !topicsToFocus){
            setError("Please fill all the required fields.");
            return;
        }

        console.log(formData)
        setError("")
        setIsLoading(true);

        // Calling API to genrate question
        try {
            const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
                role,
                experience,
                topicsToFocus,
                numberOfQuestions: 10,
            })

            // Should be Like [{question, answer}]
            const generatequestion = aiResponse.data;

            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE,{
                ...formData,
                questions: generatequestion,
            })

            if(response.data?.session?._id){
                navigate(`/interview-prep/${response.data?.session?._id}`)
            }

        } catch (error) {
            if(error.response && error.response.data.message){
                setError(error.response.data.message)
            }
            else{
                setError("something went wrong please try again")
            }
        }
        finally{
            setIsLoading(false)
        }
    }


  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
        <h3 className='text-lg font-semibold text-black'> Start Your Interview Journey here</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-3'>
            Fill out few quick details and unlock your personalized set interview questions
        </p>

        <form onSubmit={handleCreateSession} className='flex flex-col gap-3 '>
            <Input value={formData.role}
            onChange={({target}) => handleChange("role", target.value)}
            label = "Target Role"
            placeholder='(e.g. Backend Developer, Frontend Developer, MERN Stack Developer, etc)'
            type='text'
            />

            <Input value={formData.experience}
            onChange={({target}) => handleChange("experience", target.value)}
            label = "years of Experience"
            placeholder='(e.g. 1 Year, 2 years, Put 0 for freshers)'
            type='number'
            />

            <Input value={formData.topicsToFocus}
            onChange={({target}) => handleChange("topicsToFocus", target.value)}
            label = "Topics to Focus"
            placeholder='(comma seprated, e.g Nodejs, React, Javascript, MongoDB)'
            type='text'
            />

            <Input value={formData.description}
            onChange={({target}) => handleChange("description", target.value)}
            label = "Description"
            placeholder='(Any specific goals or notes for this session)'
            type='text'
            />

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p> }

            <button
            type='submit'
            className='btn-primary w-full mt-2'
            disabled={isLoading}
            >
               {isLoading && <SpinnerLoader/>} Create Session
            </button>

        </form>
    </div>
  )
}

export default CreateSessionForm