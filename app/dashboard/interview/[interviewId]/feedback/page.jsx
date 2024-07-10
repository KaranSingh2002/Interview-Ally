"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    // Group the user answers by the question
    const groupedFeedback = result.reduce((acc, curr) => {
      if (!acc[curr.question]) {
        acc[curr.question] = {
          question: curr.question,
          correctAns: curr.correctAns,
          userAns: curr.userAns,
          feedback: curr.feedback,
          rating: curr.rating,
        };
      }
      return acc;
    }, {});

    // Convert the grouped feedback object to an array
    setFeedbackList(Object.values(groupedFeedback));
  };

  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-base text-gray-500">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font=bold text-green-500">Congralutions!</h2>
          <h2 className="font-bold text-2xl">
            Here is your interview feedback
          </h2>

          <h2 className="text-purple-400 text-lg my-3">
            Your overall interview rating:<strong>7/10</strong>
          </h2>
          <h2 className="text-sm text-gray-500">
            Find below your interview questions with the correct answers,Your
            answer and feedback for improvement
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-6 w-full">
                  {item.question}
                  <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating:</strong>
                      {item.rating}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-800">
                      <strong>Your Answer : </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-500">
                      <strong>Correct Answer : </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                      <strong>Feedback : </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          <div className="border rounded-lg p-5 bg-blue-100 mt-16">
            <h2 className="flex gap-2 text-sm items-center text-primary">
              <Lightbulb className="text-sm" />
              <strong>Note:</strong>
            </h2>
            <h2 className="text-sm text-primary my-2">
              Please keep in mind that your rating is influenced by various
              factors, even if your explanations are accurate. The goal is to
              help you improve and enhance your communication skills and
              knowledge.{" "}
            </h2>
          </div>
        </>
      )}
      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
}

export default Feedback;
