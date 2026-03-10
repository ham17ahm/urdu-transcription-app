// This is a HELPER FUNCTION that will handle OpenAI transcription
// We'll use OpenAI's audio transcription model (as per: https://platform.openai.com/docs/guides/speech-to-text)

// Imports
import OpenAI from "openai";

// Initiate OpenAI instance and read API key
const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribes an audio chunk using OpenAI
 * @param {Buffer} audioChunk - The audio data to transcribe
 * @param {number} chunkIndex - Which chunk number this is (for tracking)
 * @returns {Promise<Object>} - The transcription result
 */
export async function transcribeWithOpenAI(audioChunk, chunkIndex) {
  try {
    console.log(`[OpenAI] Starting transcription for chunk ${chunkIndex}...`);

    // Convert buffer to file object
    const fileObject = new File([audioChunk], "chunk.mp3", {
      type: "audio/mp3",
    });

    // Make OpenAi API request
    const transcription = await openAi.audio.transcriptions.create({
      file: fileObject,
      model: "gpt-4o-transcribe",
      language: "ur",
    });

    console.log(`[OpenAI] ✅ Completed chunk ${chunkIndex}`);
    console.log(transcription.text);

    return {
      service: "OpenAI",
      chunkIndex: chunkIndex,
      text: transcription.text,
      success: true,
    };
  } catch (error) {
    console.error(`[OpenAI] ❌ Error on chunk ${chunkIndex}:`, error);

    return {
      service: "OpenAI",
      chunkIndex: chunkIndex,
      text: "",
      success: false,
      error: error.message,
    };
  }
}
