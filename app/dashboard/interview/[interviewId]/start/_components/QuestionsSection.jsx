import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
  if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
    console.log("mockInterviewQuestions is null or empty");
    return null;
  }

  console.log("mockInterviewQuestions:", mockInterviewQuestions);
  console.log("activeQuestionIndex:", activeQuestionIndex);

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);

      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find((voice) =>
          [
            "Google UK English Female",
            "Microsoft Zira Desktop - English (United States)",
          ].includes(voice.name)
        );

        if (femaleVoice) {
          speech.voice = femaleVoice;
        }

        window.speechSynthesis.speak(speech);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      } else {
        setVoice();
      }
    } else {
      alert("Sorry, Your Browser does not support text to speech");
    }
  };

  return (
    <div className="p-5 border rounded-lg">
      {/* Section for question indexes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-5">
        {mockInterviewQuestions.map((question, index) => (
          <div key={index}>
            <h2
              className={`p-2 rounded-full text-xs md:text-sm text-center ${
                activeQuestionIndex === index
                  ? "bg-primary text-white"
                  : "bg-secondary"
              }`}
            >
              Question {index + 1}
            </h2>
          </div>
        ))}
      </div>

      {/* Section for active question */}
      <div className="p-5 border rounded-lg">
        <h2 className="my-5 text-sm md:text-base">
          {mockInterviewQuestions[activeQuestionIndex]?.question}
        </h2>
        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)
          }
        />
        <div className="border rounded-lg p-5 bg-blue-100 mt-16">
          <h2 className="flex gap-2 text-sm items-center text-primary">
            <Lightbulb className="text-sm" />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            Click on the record answer when you want to answer the question. At
            the end of interview you will be provided a feedback along with the
            correct answer for each question and which will help you to analyze
            your mistakes.
          </h2>
        </div>
      </div>
    </div>
  );
}

export default QuestionsSection;
