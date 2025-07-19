import React from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {AnimatePresence, motion} from 'framer-motion';
import {LuCircleAlert, LuListCollapse} from 'react-icons/lu';
// import SpinnerLoader from '../../components/loader/SpinnerLoader';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useEffect } from 'react';
import DashboardLayout from './../../components/layout/DashboardLayout';
import RoleInfoHeader from './RoleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import QuestionCard from '../../components/cards/QuestionCard';
import AIResponsePreview from './AIResponsePreview';
import Drawer from '../../components/loader/Drawer';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import SpinnerLoader from './../../components/loader/SpinnerLoader';

const Interviewprep = () => {

  const {sessionId} = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('')

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false)
  const [explanation, setExplation] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isUpdateLoader, setIsUpdateLoader] = useState(false)

  // Fetch Session data by session Id
  const fetchSessionById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if(response.data && response.data.session){
        setSessionData(response.data.session)
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  // Genrate concept Explanation
  const genrateConceptExplanation = async (question) => {
    try {
      setErrorMsg('')
      setExplation(null)

      setIsLoading(true)
      setOpenLeanMoreDrawer(true)

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION,{question})

      if(response.data){
        setExplation(response.data)
      }
    } catch (error) {
      setExplation(null)
      setErrorMsg("Failed to genrate explanation. Please try Again later")
      console.error("Error", error)
    }
    finally{
      setIsLoading(false)
    }
  }  
  
  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))
      console.log(response)

      if(response.data && response.data.question){
        // toast.success('Question Pinned successfully')
        fetchSessionById();
      }
    } catch (error) {
      console.error("error",error)
    }
  }
  
  // Add more question to a session
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true)
      // Call Api to genrate questions
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 5,
        })

        // Should be array like [{question, answer}]
        const genrateQuestions = aiResponse.data;
        const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION,
          {
            sessionId,
            questions: genrateQuestions,
          });
          if(response.data){
            toast.success("Added More Q&A");
            fetchSessionById();
          }
    } catch (error) {
      if(error.response && error.response.data.message){
        setErrorMsg(error.response.data.message)
      }
      else{
        setErrorMsg("Something went wrong")
      }
    }
    finally{
      setIsUpdateLoader(false)
    }
  }

  useEffect(() =>{
    if(sessionId){
      fetchSessionById()
    }
    return () =>{}
  },[])
  return (
    <DashboardLayout>
        <RoleInfoHeader
            role={sessionData?.role || ""}
            topicsToFocus={sessionData?.topicsToFocus || ""}
            experience={sessionData?.experience || "-"}
            questions={sessionData?.questions?.length || "-"}
            description={sessionData?.description || ""}
            lastUpdated={
              sessionData?.updatedAt
                ? moment(sessionData.updatedAt).format("Do MMM YYYY")
                : ""
            }
        />

        <div className='container mx-auto px-4 pb-4 pt-4 md:px-0'>
          <h2 className='text-lg font-semibold color-black'>Interview Q & A</h2>
          <div className='grid grid-cols-12 gap-4 mt-5 mb-10'>
            <div className={`col-span-12 ${openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
                <AnimatePresence>
                  {sessionData?.questions?.map((data, index) =>{
                    return(
                      <motion.div
                      key={data._id || index}
                      initial={{opacity: 0, y: -20}}
                      animate={{opacity: 1, y: 0}}
                      exit = {{opacity: 0, scale: 0.95}}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        delay: index*0.1,
                        damping: 15
                      }}
                      layout // this is key prop that animates position changes
                      layoutId={`question-${data._id || index}`} // helps framer track specific item
                      >
                      <>
                      <QuestionCard
                      questions={data?.question}
                      answer={data?.answer}
                      onLearnMore={() => genrateConceptExplanation(data?.question)}
                      isPinned ={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />
                      </>

                      {!isLoading && sessionData?.questions?.length == index + 1 && (
                        <div className='flex items-center justify-center mt-5'>
                          <button 
                          className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer' 
                          disabled={isLoading || isUpdateLoader} 
                          onClick={uploadMoreQuestions}>
                          {isUpdateLoader ? (<SpinnerLoader/>) : (<LuListCollapse className='text-lg'/>)} {" "} Load More
                          </button>
                        </div>
                      )}

                      </motion.div>
                    )
                  })}
                </AnimatePresence>
            </div>
          </div>

          <div>
            <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={ () => setOpenLeanMoreDrawer(false)}
            title = {!isLoading && explanation?.title}
            >
              {errorMsg && (
                <p className='flex gap-2 text-sm text-amber-400 font-medium'> <LuCircleAlert className='mt-1'/> {errorMsg}</p>
              )}
              {isLoading && <SkeletonLoader/>}
              {!isLoading && explanation && (
                <AIResponsePreview content={explanation?.explanation}/>
              )}

            </Drawer>
          </div>

        </div>

    </DashboardLayout>
  )
}

export default Interviewprep;