import React, { useState } from 'react';

const MicButton = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recorded, setRecorded] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
                setRecorded(e.data);
            };

            recorder.onstop = () => {
                setRecordedChunks((prev) => [...prev, recorded]);
                const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob)
                setAudioUrl(url);
                console.log('Recording stopped, audio URL:', url);
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

            // Create the Blob after stopping recording
            const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);

            // Create anchor element for downloading the audio Blob
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${url}.wav`;

            // Trigger click event to initiate download
            anchor.click();

            // Clean up
            URL.revokeObjectURL(url);
            anchor.remove();

            // Clear recordedChunks for the next recording
            setRecordedChunks([]);
        }
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <audio src={audioUrl} controls="controls" />
        </div>
    );
};

export default MicButton;
