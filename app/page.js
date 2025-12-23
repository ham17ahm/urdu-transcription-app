"use client";

import { useState } from "react";

export default function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(5);
  const [finalTranscriptionResults, setFinalTranscriptionResults] =
    useState("");

  function handleAudioFileChange(e) {
    const selectedAudioFile = e.target.files[0];
    setAudioFile(selectedAudioFile);
    console.log("Audio file selected", selectedAudioFile);
  }

  function handleChunkSizeChange(e) {
    const size = Number(e.target.value);
    setChunkSize(size);
    console.log(`Audio will be processed in ${size} chunks.`);
  }

  function handleTextareaChange(e) {
    const newText = e.target.value;
    setFinalTranscriptionResults(newText);
  }

  function handleStartTransciption() {
    if (!audioFile) {
      alert("You have not selected any audio file!");
      return;
    }

    async function getTranscriptionResults() {
      const url = "/api/transcribe";

      // Create object to send form data
      const formData = new FormData();

      // Adding new fields to formData
      formData.append("audioFile", audioFile);
      formData.append("chunkSize", chunkSize);

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        setFinalTranscriptionResults(result.transcription);
      } catch (error) {
        console.error(error.message);
      }
    }

    // Run the function
    getTranscriptionResults();
  }

  return (
    <div>
      <h1>Urdu Audio Transcription System</h1>
      <p>Upload an audio file to get started</p>
      {/* Audio File Select */}
      <input type="file" accept="audio/*" onChange={handleAudioFileChange} />
      {audioFile && <p>Selected Audio File: {audioFile.name}</p>}
      {/* Input for user to select chunk size (in minutes) */}
      <div>
        <label>Chunk size (minutes): </label>
        <input
          type="number"
          min="1"
          max="30"
          value={chunkSize}
          onChange={handleChunkSizeChange}
        />
      </div>
      {/* Button to start transcription process */}
      <div>
        <button onClick={handleStartTransciption}>Start Transcription</button>
      </div>

      {/* Textarea to show the final transcription results */}
      <div>
        <h3>Final Transcription Results:</h3>
        <textarea
          rows={20}
          cols={100}
          value={finalTranscriptionResults}
          onChange={handleTextareaChange}
          placeholder="Transcription will appear here..."
        />
      </div>
    </div>
  );
}
