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

  // Get ffmpeg info of audio file
  let ffmpegInfo;
  try {
    ffmpegInfo = await execPromise(`${ffmpeg} -i ${filePath} -f null NUL`);
    console.log(ffmpegInfo);
  } catch (error) {
    console.log(error);
    throw error;
  }

  // Get the duration of the audio
  const audioDuration = ffmpegInfo["stderr"].match(
    /Duration:\s(\d{2}:\d{2}:\d{2}\.\d{2})/
  );

  // Check to see if audio duration is actually in the FFmpeg output
  if (!audioDuration) {
    throw new Error("Could not find duration in FFmpeg output");
  }
  console.log(audioDuration[1]);

  // Convert total duration to seconds
  // Get hours, minutes and seconds seperately
  const hours = Number(audioDuration[1].substring(0, 2));
  const minutes = Number(audioDuration[1].substring(3, 5));
  const seconds = Number(audioDuration[1].substring(6, 8));
  console.log(hours, minutes, seconds);

  // Get the total seconds
  const totalAudioDurationinSeconds = hours * 3600 + minutes * 60 + seconds;
  console.log(totalAudioDurationinSeconds);

  // Convert chunk size minutes to seconds
  const chunkSizeInSeconds = chunkSizeMinutes * 60;
  console.log(chunkSizeInSeconds);

  // Calculate the number of chunks needed
  const numberOfChunksNeeded = Math.ceil(
    totalAudioDurationinSeconds / chunkSizeInSeconds
  );
  console.log(numberOfChunksNeeded);

  // Create an output pattern
  const outputPattern = path.join(tmpFolderPath, "chunk_%03d.mp3");
  console.log(outputPattern);

  // Create a split command for FFmpeg
  const splitCommand = `${ffmpeg} -i ${filePath} -c copy -f segment -segment_time ${chunkSizeInSeconds} ${outputPattern}`;
  console.log(splitCommand);

  // Run the split command
  let ffmpegSplitResults;
  try {
    ffmpegSplitResults = await execPromise(splitCommand);
    console.log(ffmpegSplitResults);
  } catch (error) {
    console.log(error);
    throw error;
  }

  // Create an array of the file paths of all chunks
  let filePathsArrayOfChunks = [];
  let chunkFilePath = "";

  for (let index = 0; index < numberOfChunksNeeded; index++) {
    const paddedIndex = String(index).padStart(3, "0");
    chunkFilePath = path.join(tmpFolderPath, `chunk_${paddedIndex}.mp3`);
    filePathsArrayOfChunks.push(chunkFilePath);
  }

  console.log(filePathsArrayOfChunks);

  // Creating array of chunk buffers
  let chunkBuffers = [];

  for (let index = 0; index < filePathsArrayOfChunks.length; index++) {
    const element = filePathsArrayOfChunks[index];
    console.log(element);
  }

  return filePathsArrayOfChunks;
}
