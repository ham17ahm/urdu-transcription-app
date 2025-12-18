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

  function hancleChunkSizeChange(e) {
    const size = Number(e.target.value);
    setChunkSize(size);
    console.log(`Audio will be processed in ${size} chunks.`);
  }

  function handleStartTransciption() {
    if (!audioFile) {
      alert("You have not selected any audio file!");
      return;
    }

    async function getTranscriptionResults() {
      const url = "/api/testing";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
    }

    getTranscriptionResults();

    console.log("Transcription has started for the following audio:");
    console.log("File Name:", audioFile.name);
    console.log("Chunk Size:", chunkSize);

    // Temp note
    setFinalTranscriptionResults("Chill MAHOL!");
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
          onChange={hancleChunkSizeChange}
        />
      </div>

      {/* Button to start transcription process */}
      <div>
        <button onClick={handleStartTransciption}>Start Transcription</button>
      </div>

      {/* Textarea to show the final transcription results */}
      {/* <div>
        <h3>Final Transcription Results:</h3>
        <textarea
          rows={20}
          cols={100}
          value={finalTranscriptionResults}
          placeholder="Transcription will appear here..."
        />
      </div> */}
    </div>
  );
}
