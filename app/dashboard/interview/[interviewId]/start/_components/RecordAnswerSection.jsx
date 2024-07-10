import React, { useEffect, useState } from "react";
import { Webcam as IconWebcam, Mic } from "lucide-react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAiModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0 && !isRecording) {
      setUserAnswer(
        (prevAns) =>
          prevAns + results.map((result) => result?.transcript).join("")
      );
    }
  }, [results, isRecording]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (
        mockInterviewQuestions &&
        mockInterviewQuestions.length > 0 &&
        activeQuestionIndex >= 0 &&
        activeQuestionIndex < mockInterviewQuestions.length
      ) {
        UpdateUserAnswer();
      } else {
        toast("Error: Invalid question or activeQuestionIndex");
      }
    } else {
      if (!isRecording) {
        startSpeechToText();
      }
    }
  };

  const UpdateUserAnswer = async () => {
    if (userAnswer.length > 10) {
      setLoading(true);
      const feedbackPrompt =
        "Question: " +
        mockInterviewQuestions[activeQuestionIndex]?.question +
        ", User Answer: " +
        userAnswer +
        ", Depends on question and user answer for given interview question, please give us rating for answer and feedback as area of improvements if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp = result.response
        .text()
        .trim()
        .replace("```json", "")
        .replace("```", "");
      console.log(mockJsonResp);
      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestions[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });
      if (resp) {
        toast("User answer recorded successfully");
        setUserAnswer("");
        setResults([]);
      }
      setResults([]);
      setLoading(false);
    } else {
      toast("Analyzing the answer....");
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5 relative">
        <Image
          src="/camera.png"
          width={200}
          height={200}
          className="absolute z-0"
          alt="Camera Icon"
        />
        <Webcam
          audio={false}
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
            position: "relative",
          }}
        />
        <IconWebcam className="z-20" />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-700 flex gap-2">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
