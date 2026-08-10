import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import SpinnerLoader from '../../components/loader/SpinnerLoader';
import axiosInstance from './../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const CreateSessionForm = () => {
    const [sessionMode, setSessionMode] = useState('role');
    const [resumeFile, setResumeFile] = useState(null);
    const [formData, setFormData] = useState({
        role: '',
        experience: '',
        topicsToFocus: '',
        description: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value
        }))
    }

    const validateRoleBasedForm = () => {
        const { role, experience, topicsToFocus } = formData;
        if (!role || !experience || !topicsToFocus) {
            return 'Please fill all the required role-based fields.';
        }
        return null;
    };

    const validateResumeBasedForm = () => {
        const { role, experience } = formData;
        if (!role || !experience) {
            return 'Please provide the target role and experience for the resume-based session.';
        }
        if (!resumeFile) {
            return 'Please upload your resume to generate resume-based questions.';
        }
        return null;
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = sessionMode === 'role' ? validateRoleBasedForm() : validateResumeBasedForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            let aiResponse;
            let generatedQuestions = [];
            let resumeKeywords = [];

            if (sessionMode === 'role') {
                const { role, experience, topicsToFocus } = formData;
                aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                });
                generatedQuestions = aiResponse.data ?? [];
            } else {
                const form = new FormData();
                form.append('role', formData.role);
                form.append('experience', formData.experience);
                form.append('description', formData.description || '');
                form.append('numberOfQuestions', '10');
                form.append('resume', resumeFile);

                aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS_FROM_RESUME, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                generatedQuestions = aiResponse.data?.questions ?? aiResponse.data ?? [];
                resumeKeywords = aiResponse.data?.keywords ?? [];
            }

            if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
                setError('The AI could not generate questions. Please try again with different details.');
                return;
            }

            const sessionPayload = {
                ...formData,
                sessionType: sessionMode,
                resumeKeywords,
                questions: generatedQuestions,
                topicsToFocus: sessionMode === 'role' ? formData.topicsToFocus : (resumeKeywords.join(', ') || 'Resume based interview preparation'),
            };

            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, sessionPayload);

            if (response.data?.session?._id) {
                navigate(`/interview-prep/${response.data?.session?._id}`)
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
            <h3 className='text-lg font-semibold text-black'> Start Your Interview Journey here</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-3'>
                Choose the way you want to create your interview session.
            </p>

            <div className='mb-4 p-1 rounded-full bg-orange-50 border border-orange-100 flex gap-2'>
                <button
                    type='button'
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${sessionMode === 'role' ? 'bg-[#FF9324] text-white shadow-sm' : 'text-slate-700 hover:text-black'}`}
                    onClick={() => setSessionMode('role')}
                >
                    Role based
                </button>
                <button
                    type='button'
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${sessionMode === 'resume' ? 'bg-[#FF9324] text-white shadow-sm' : 'text-slate-700 hover:text-black'}`}
                    onClick={() => setSessionMode('resume')}
                >
                    Resume based
                </button>
            </div>

            <form onSubmit={handleCreateSession} className='flex flex-col gap-3 '>
                <Input
                    value={formData.role}
                    onChange={({ target }) => handleChange('role', target.value)}
                    label='Target Role'
                    placeholder='(e.g. Backend Developer, Frontend Developer, MERN Stack Developer, etc)'
                    type='text'
                />

                <Input
                    value={formData.experience}
                    onChange={({ target }) => handleChange('experience', target.value)}
                    label='Years of Experience'
                    placeholder='(e.g. 1 Year, 2 years, Put 0 for freshers)'
                    type='text'
                />

                {sessionMode === 'role' && (
                    <Input
                        value={formData.topicsToFocus}
                        onChange={({ target }) => handleChange('topicsToFocus', target.value)}
                        label='Topics to Focus'
                        placeholder='(comma seprated, e.g Nodejs, React, Javascript, MongoDB)'
                        type='text'
                    />
                )}

                {sessionMode === 'resume' && (
                    <div>
                        <label className='text-[13px] text-slate-800'>Upload Resume</label>
                        <div className='input-box flex-col items-start gap-2 py-3'>
                            <input
                                id='resume-upload'
                                type='file'
                                accept='.pdf,.doc,.docx,.txt,.md,.rtf'
                                onChange={({ target }) => setResumeFile(target.files?.[0] ?? null)}
                                className='hidden'
                            />
                            <label htmlFor='resume-upload' className='w-full cursor-pointer flex items-center justify-between gap-3 text-sm text-slate-700'>
                                <span className='truncate'>{resumeFile ? resumeFile.name : 'Choose resume file'}</span>
                                <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-[#FF9324]'>Browse</span>
                            </label>
                        </div>
                    </div>
                )}

                <Input
                    value={formData.description}
                    onChange={({ target }) => handleChange('description', target.value)}
                    label='Description'
                    placeholder='(Any specific goals or notes for this session)'
                    type='text'
                />

                {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                <button
                    type='submit'
                    className='btn-primary w-full mt-2'
                    disabled={isLoading}
                >
                    {isLoading && <SpinnerLoader />} Create Session
                </button>
            </form>
        </div>
    )
}

export default CreateSessionForm
