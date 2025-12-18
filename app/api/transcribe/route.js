import { transcribeWithGemini } from "@/app/lib/transcription/gemini";

export async function POST(request) {
  try {
    // Get the data sent from the frontend
    const formData = await request.formDaata();

    // Extract the audio file
    const audioFile = formData.get("audioFile");
    const chunkSize = formData.get("chunkSize");

    // Log info in the backend
    console.log("=== API Route Received ===");
    console.log("File name:", audioFile.name);
    console.log("File size:", audioFile.size, "bytes");
    console.log("File type:", audioFile.type);
    console.log("Chunk size:", chunkSize, "minutes");

    // Receiving transcription from gemini helper function
    const geminiResults = transcribeWithGemini("test", 1);

    console.log(geminiResults);

    // Send response to the frontend
    return Response.json({
      success: true,
      message: "Audio file received successfully!",
      fileName: audioFile.name,
      fileSize: audioFile.size,
    });
  } catch (error) {
    console.log("Error in the API route:", error);
    return Response.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
