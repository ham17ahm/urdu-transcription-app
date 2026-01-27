import { transcribeWithGemini } from "@/app/lib/transcription/gemini";
import { transcribeWithElevenlabs } from "@/app/lib/transcription/elevenlabs";
import { transcribeWithOpenAI } from "@/app/lib/transcription/openai";
import { transcribeWithChirp } from "@/app/lib/transcription/chirp";

import { splitAudioIntoChunks } from "@/app/lib/audio/chunker";

export async function POST(request) {
  try {
    // Get the data sent from the frontend
    const formData = await request.formData();

    // Extract the audio file
    const audioFile = formData.get("audioFile");
    const chunkSize = formData.get("chunkSize");

    // Log info in the backend
    console.log("=== API Route Received ===");
    console.log("File name:", audioFile.name);
    console.log("File size:", audioFile.size, "bytes");
    console.log("File type:", audioFile.type);
    console.log("Chunk size:", chunkSize, "minutes");

    // Store result of splitAudioIntoChunks() (chunker.js) into a variable

    const chunks = await splitAudioIntoChunks(audioFile, chunkSize);

    // Create an empty array to store ALL results
    let allChunkResults = [];

    // Loop through each chunk, process it with all four services, and append the results to allChunkResults

    for (let i = 0; i < chunks.length; i++) {
      // Start all 4 transcriptions at the same time
      const tempChunkResults = await Promise.allSettled([
        transcribeWithGemini(chunks[i], i),
        transcribeWithElevenlabs(chunks[i], i),
        transcribeWithOpenAI(chunks[i], i),
        transcribeWithChirp(chunks[i], i),
      ]);

      // Push each result into array
      allChunkResults.push(tempChunkResults);
    }

    console.log(allChunkResults);

    console.log("=== DETAILED STRUCTURE ===");
    console.log("allChunkResults[0] is:", allChunkResults[0]);
    console.log("allChunkResults[0][0] is:", allChunkResults[0][0]);
    console.log("allChunkResults[0][0].value is:", allChunkResults[0][0].value);

    // Build a simple combined transcription
    let combinedText = "";

    for (let i = 0; i < allChunkResults.length; i++) {
      combinedText += `\n=== CHUNK ${i} ===\n`;
      combinedText += `Gemini: ${allChunkResults[i][0].value.text}\n`;
      combinedText += `ElevenLabs: ${allChunkResults[i][1].value.text}\n`;
      combinedText += `OpenAI: ${allChunkResults[i][2].value.text}\n`;
      combinedText += `Chirp: ${allChunkResults[i][3].value.text}\n`;
    }

    console.log("=== COMBINED TEXT ===");
    console.log(combinedText);

    // Send response to the frontend
    return Response.json({
      success: true,
      message: "Audio file received successfully!",
      fileName: audioFile.name,
      fileSize: audioFile.size,
      transcription: combinedText,
    });
  } catch (error) {
    console.log("Error in the API route:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Something went wrong!",
      },
      { status: 500 },
    );
  }
}
