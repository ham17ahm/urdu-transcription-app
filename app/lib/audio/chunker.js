const ffmpeg = require("ffmpeg-static");
const { exec } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs").promises;

// Convert exec to work with async/await
const execPromise = promisify(exec);

/**
 * Splits an audio file into chunks of specified duration
 * @param {File} audioFile - The uploaded audio file
 * @param {number} chunkSizeMinutes - Size of each chunk in minutes
 * @returns {Promise<Array>} - Array of audio chunk buffers
 */
export async function splitAudioIntoChunks(audioFile, chunkSizeMinutes) {
  console.log("=== Starting Audio Chunking ===");
  console.log("File:", audioFile.name);
  console.log("Chunk size:", chunkSizeMinutes, "minutes");

  // Convert the uploaded file to a Buffer
  const audioBuffer = await audioFile.arrayBuffer();
  const nodeBuffer = Buffer.from(audioBuffer);

  // Get the project root directory
  const projectRoot = process.cwd();
  console.log(projectRoot);

  // Create path to tmp folder
  const tmpFolderPath = path.join(projectRoot, "tmp");
  console.log(tmpFolderPath);

  // Create tmp folder if it does not exist already
  await fs.mkdir(tmpFolderPath, { recursive: true });

  // Create full file path
  const filePath = path.join(tmpFolderPath, `${Date.now()}_${audioFile.name}`);
  console.log(filePath);

  // Save the audio file
  await fs.writeFile(filePath, nodeBuffer);

  return filePath;
}
