import { transcribeWithGemini } from "@/app/lib/transcription/gemini";
import { transcribeWithElevenlabs } from "@/app/lib/transcription/elevenlabs";
import { transcribeWithOpenAI } from "@/app/lib/transcription/openai";
import { transcribeWithChirp } from "@/app/lib/transcription/chirp";

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

    // Start all 4 transcriptions at the same time
    const results = await Promise.allSettled([
      transcribeWithGemini("test", 1),
      transcribeWithElevenlabs("test", 1),
      transcribeWithOpenAI("test", 1),
      transcribeWithChirp("test", 1),
    ]);

    // Extract actual values from the the transcription results
    const geminiResults =
      results[0].status === "fulfilled" ? results[0].value : results[0].reason;
    const elevenlabsResults =
      results[1].status === "fulfilled" ? results[1].value : results[1].reason;
    const openAIResults =
      results[2].status === "fulfilled" ? results[2].value : results[2].reason;
    const chirpResults =
      results[3].status === "fulfilled" ? results[3].value : results[3].reason;

    // // TEMPORARY: Testing error handling
    // throw new Error("Testing error display!");

    // Log all results to see what we got
    console.log("=== Transcription Results ===");
    console.log("Gemini:", geminiResults);
    console.log("ElevenLabs:", elevenlabsResults);
    console.log("OpenAI:", openAIResults);
    console.log("Chirp:", chirpResults);

    // Send response to the frontend
    return Response.json({
      success: true,
      message: "Audio file received successfully!",
      fileName: audioFile.name,
      fileSize: audioFile.size,
      transcription: `
=== GEMINI ===
${geminiResults.text}

=== ELEVENLABS ===
${elevenlabsResults.text}

=== OPENAI ===
${openAIResults.text}

=== CHIRP ===
${chirpResults.text}
`.trim(),
    });
  } catch (error) {
    console.log("Error in the API route:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
