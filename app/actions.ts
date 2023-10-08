"use server";

import { revalidatePath } from "next/cache";
import path from "path";
import { ZodError, z } from "zod";
import {v4 as uuidv4} from 'uuid';

const fs = require("fs");
const ytdl = require("ytdl-core");

const schema = z.object({
  videoLink: z
    .string()
    .url({ message: "Invalid URL" })
    .includes("youtube.com", { message: "Invalid Youtube URL" }),
});

// Youtube video formats info
export async function youtubeVideoFormatsAction(
  prevState: any,
  formData: FormData
) {
  try {
    const { videoLink } = schema.parse({
      videoLink: formData.get("videoLink"),
    });

    let info = await ytdl.getBasicInfo(videoLink);
    const {
      videoDetails: { embed, title },
      formats,
    } = info;

    // Extract available video formats with specific resolutions
    const targetResolutions = [
      "360p",
      "480p",
      "720p",
      "1080p",
      "2160p",
      "4320p",
    ]; // Resolutions to target
    const uniqueFormats: any = {};

    formats.forEach((format: any) => {
      const qualityLabel = format.qualityLabel || "";
      const resolution = qualityLabel.split(" ")[0]; // Extract resolution from qualityLabel
      if (
        targetResolutions.includes(resolution) &&
        format.url.includes("mp4")
      ) {
        if (!uniqueFormats["qualityLabel"]) {
          uniqueFormats[format.qualityLabel] = format;
        } else if (format.bitrate > uniqueFormats["qualityLabel"].bitrate) {
          uniqueFormats[format.qualityLabel] = format;
        }
      }
    });

    return {
      title: title || "",
      embed,
      formats: Object.values(uniqueFormats).sort(
        (a: any, b: any) => b.itag - a.itag
      ),
      videoLink,
    };
  } catch (error: unknown) {

    if (Object(error).hasOwnProperty("errors")) {
      return {
        message: (error as ZodError)?.errors[0]?.message ?? "Failed to create",
      };
    }

    return {
      message: (error as Error)?.message ?? "Something went wrong",
    };
  }
}

const downloadVideoSchema = z.object({
  itag: z.string(),
  // .url({ message: "Invalid URL" })
  // .includes("youtube.com", { message: "Invalid Youtube URL" }),
});
// Youtube video download
export async function youtubeVideoDownloadAction(
  prevState: any,
  formData: FormData
) {
  const { videoLink } = schema.parse({
    videoLink: formData.get("videoLink"),
  });
  const { itag } = downloadVideoSchema.parse({
    itag: formData.get("itag"),
  });
  console.log(itag, videoLink);

  const videoFileName = uuidv4();
  const outputPath = path.join(process.cwd(), `public/videos/${videoFileName}-video.mp4`);
  
  try {
    await new Promise((resolve, reject) => {
      ytdl(videoLink, {
        itag,
        format: "mp4",
      })
        .pipe(fs.createWriteStream(outputPath))
        .on("finish", () => {
          resolve("Video downloaded successfully!");
        })
        .on("error", (err: unknown) => {
          reject(`Error downloading video: ${err}`);
        });
    });
        
    return {
      videoDownloadPath: `/videos/${videoFileName}-video.mp4`
    }
    
  } catch (error) {
    return {
      message: (error as Error)?.message ?? "Something went wrong",
      error
    };
  }
}
