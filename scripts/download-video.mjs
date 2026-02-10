import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { createWriteStream, mkdirSync, unlinkSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure ffmpeg path from the ffmpeg-static package
ffmpeg.setFfmpegPath(ffmpegStatic);

const VIDEO_URL = "https://www.youtube.com/watch?v=TQrxavU5dTI";
const OUTPUT_DIR = resolve(__dirname, "..", "public", "videos");
const TEMP_FILE = resolve(OUTPUT_DIR, "temp_full.mp4");

const CLIPS = [
  { name: "clip1.mp4", start: 42, duration: 9 }, // 42s to 51s
  { name: "clip2.mp4", start: 69, duration: 8 }, // 69s to 77s
];

async function downloadVideo() {
  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("⬇️  Downloading video from YouTube...");

  return new Promise((resolvePromise, reject) => {
    const stream = ytdl(VIDEO_URL, {
      quality: "highest",
      filter: (format) =>
        format.container === "mp4" && format.hasVideo && format.hasAudio,
    });

    stream.on("progress", (_, downloaded, total) => {
      const percent = ((downloaded / total) * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${percent}%`);
    });

    const writer = createWriteStream(TEMP_FILE);
    stream.pipe(writer);

    writer.on("finish", () => {
      console.log("\n✅ Download complete!");
      resolvePromise();
    });
    writer.on("error", reject);
    stream.on("error", reject);
  });
}

function trimClip(inputFile, clip) {
  const outputPath = resolve(OUTPUT_DIR, clip.name);
  console.log(
    `✂️  Trimming ${clip.name} (${clip.start}s, ${clip.duration}s duration)...`,
  );

  return new Promise((resolvePromise, reject) => {
    ffmpeg(inputFile)
      .setStartTime(clip.start)
      .setDuration(clip.duration)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-movflags",
        "+faststart", // Enables instant playback (metadata at start of file)
        "-preset",
        "fast",
        "-crf",
        "23", // Good quality, reasonable file size
      ])
      .output(outputPath)
      .on("end", () => {
        console.log(`✅ ${clip.name} created!`);
        resolvePromise();
      })
      .on("error", (err) => {
        console.error(`❌ Error trimming ${clip.name}:`, err.message);
        reject(err);
      })
      .run();
  });
}

async function main() {
  try {
    await downloadVideo();

    for (const clip of CLIPS) {
      await trimClip(TEMP_FILE, clip);
    }

    // Clean up temporary full video
    if (existsSync(TEMP_FILE)) {
      unlinkSync(TEMP_FILE);
      console.log("🧹 Temporary file cleaned up.");
    }

    console.log("\n🎉 All clips are ready in public/videos/");
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
}

main();
