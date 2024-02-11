import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { practice } from "./practice";
// import { fs } from 'fs';

const MicButton = ({ onButtonClick }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recorded, setRecorded] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  let advice = "";

  useEffect(() => {
    (async () => {
      if (recordedChunks.length > 0) {
        const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        console.log("Recording stopped, audio URL:", url);

        const formData = new FormData();
        formData.append("file", audioBlob); // assuming you're using an input element of type file
        try {
          const response = await fetch("http://127.0.0.1:5002/upload", {
            method: "POST",
            body: formData,
          });

          const responseData = await response.text(); // or response.json() if response is JSON
          console.log(responseData);
          const ratings = responseData.split(",");

          let exercises = [];
          let values = {};
          let stutter = {};

          //ratings.forEach((rating) => {
          //const category = rating.split(":")[0].trim();
          //const value = rating.split(":")[1].trim();

          //console.log(category);
          //console.log(value);

          const rankedCategories = ratings
            .filter((rating) => {
              const category = rating.split(":")[0].trim();
              return [
                "Prolongation",
                "Block",
                "SoundRep",
                "WordRep",
                "Interjection",
              ].includes(category);
            })
            .map((rating) => {
              const category = rating.split(":")[0].trim();
              const value = parseInt(rating.split(":")[1].trim());
              return { category, value };
            })
            .sort((a, b) => b.value - a.value);
          console.log(rankedCategories);
          console.log(
            rankedCategories[0].category,
            rankedCategories[1].category
          );
          let firstCat = rankedCategories[0].category;
          let secCat = rankedCategories[1].category;
          let firstTips = practice[firstCat];
          let secTips = practice[secCat];
          console.log(firstTips);

          let firstPractice =
            firstTips[
              Math.floor((Math.random() + 0.1) * (firstTips.length - 2))
            ];
          let secPractice =
            secTips[Math.floor((Math.random() + 0.1) * (secTips.length - 1))];
          advice =
            "Practice these exercises!\n\n" +
            firstTips[0] +
            "\n" +
            firstPractice +
            "\n \n" +
            secTips[0] +
            "\n" +
            secPractice;
          console.log("mic", advice);
          onButtonClick(advice);
          // const newAdvice = {
          //   message: advice,
          //   sender: "Stutstut"
          // }
          // console.log(advice);
          // let sortedKeys = Object.keys(values).sort();
          // let sortedValues = {};

          // sortedKeys.forEach(function (key) {
          //   sortedValues[key] = values[key];
          // });
          console.log(values);
        } catch (error) {
          // Handle error
        }
      }
    })();
  }, [recordedChunks]);

  // const handleClick = () => {
  //   onButtonClick(advice);
  // };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        setRecordedChunks((prev) => [...prev, e.data]);
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
      // onButtonClick(advice);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);

      // // Create the Blob after stopping recording
      // const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      // const url = URL.createObjectURL(audioBlob);

      // // Create anchor element for downloading the audio Blob
      // const anchor = document.createElement('a');
      // anchor.href = url;
      // anchor.download = `${url}.wav`;

      // // Trigger click event to initiate download
      // anchor.click();

      // // Clean up
      // URL.revokeObjectURL(url);
      // anchor.remove();

      // Clear recordedChunks for the next recording
      setRecordedChunks([]);
    }
  };

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{ backgroundColor: "#C9DFF0" }}
      >
        {isRecording ? (
          <FontAwesomeIcon icon={faCircle} />
        ) : (
          <FontAwesomeIcon icon={faMicrophone} />
        )}
      </button>
      {/* <audio src={audioUrl} controls="controls" /> */}
    </div>
  );
};

export default MicButton;
