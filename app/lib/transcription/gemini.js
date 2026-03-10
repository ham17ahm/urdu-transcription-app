/**
 * Transcribes an audio chunk using Gemini
 * @param {Buffer} audioChunk - The audio data to transcribe
 * @param {number} chunkIndex - Which chunk number this is (for tracking)
 * @returns {Promise<Object>} - The transcription result
 */

// Imports
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initiate Gemini instance and read API key
const geminiAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to transcribe audio with Gemini
export async function transcribeWithGemini(audioChunk, chunkIndex) {
  try {
    console.log(`[Gemini] Starting transcription for chunk ${chunkIndex}...`);

    // Convert audioChunk into base64
    const base64AudioFile = audioChunk.toString("base64");

    // Select a Gemini model:
    // gemini-2.0-flash | gemini-2.5-flash | gemini-3-flash-preview | gemini-3.1-flash-lite-preview
    const model = geminiAi.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // Build the request payload for Gemini:
    // - First item is the text prompt instructing the model
    // - Second item is the audio data, passed as base64-encoded inline content
    const contents = [
      { text: "Transcribe this audio clip in Urdu verbatim." },
      {
        inlineData: {
          mimeType: "audio/mp3",
          data: base64AudioFile,
        },
      },
    ];

    // Send the audio and prompt to Gemini and await the transcription response
    const result = await model.generateContent(contents);

    console.log(result.response.text());

    console.log(`[Gemini] ✅ Completed chunk ${chunkIndex}`);

    return {
      service: "Gemini",
      chunkIndex: chunkIndex,
      text: result.response.text(),
      success: true,
    };
  } catch (error) {
    console.error(`[Gemini] ❌ Error on chunk ${chunkIndex}:`, error);

    return {
      service: "Gemini",
      chunkIndex: chunkIndex,
      text: "",
      success: false,
      error: error.message,
    };
  }
}
