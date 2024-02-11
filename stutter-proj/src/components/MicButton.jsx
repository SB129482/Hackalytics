import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
// import { fs } from 'fs';


const MicButton = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recorded, setRecorded] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
        (async () => {

            if (recordedChunks.length > 0) {
                const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob)
                setAudioUrl(url);
                console.log('Recording stopped, audio URL:', url);

                const formData = new FormData();
                formData.append('file', url); // assuming you're using an input element of type file

                try {
                    const response = await fetch('http://127.0.0.1:5002/upload', {
                        method: 'POST',
                        body: formData,
                    });
                    // Handle response
                } catch (error) {
                    // Handle error
                }
            }
        })();
    }, [recordedChunks])

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
        } catch (err) {
            console.error('Error accessing microphone:', err);
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
                {isRecording ? <FontAwesomeIcon icon={faCircle} /> : <FontAwesomeIcon icon={faMicrophone} />}
            </button>
            {/* <audio src={audioUrl} controls="controls" /> */}
        </div>
    );
};

export default MicButton;
