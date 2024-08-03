"use node";
import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import UnrealSpeech from "unrealspeech";
// import * as PlayHT from "playht";

// PlayHT.init({
//   apiKey: process.env.PLAYHT_API_KEY!,
//   userId: process.env.PLAYHT_USER_ID!,
// });

// import OpenAI from "openai";
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

const unrealSpeech = new UnrealSpeech(process.env.UNREALSPEECH_API_KEY!);

export const generateAudioAction = action({
  args: {
    input: v.string(),
    voice: v.string(),
  },
  handler: async (ctx, { voice, input }) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    // const mp3 = await openai.audio.speech.create({
    //   model: "tts-1",
    //   voice: voice as SpeechCreateParams["voice"],
    //   input,
    //   response_format: "mp3",
    // });

    const speechData = await unrealSpeech.speech(input, voice);

    console.log(speechData);

    const audioUrl: string = speechData.OutputUri;

    if (!audioUrl) throw new ConvexError("Error generating audio");
    const mp3Response = await fetch(audioUrl);

    const buffer = await mp3Response.arrayBuffer();

    return buffer;
  },
});

// export const generateThumbnailAction = action({
//   args: { prompt: v.string() },
//   handler: async (ctx, { prompt }) => {
//     const identity = ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new ConvexError("User not authenticated");
//     }

//     const response = await openai.images.generate({
//       model: "dall-e-3",
//       prompt,
//       size: "1024x1024",
//       quality: "standard",
//       n: 1,
//     });

//     const url = response.data[0].url;

//     if (!url) {
//       throw new ConvexError("Error generating thumbnail");
//     }

//     const imageResponse = await fetch(url);
//     const buffer = await imageResponse.arrayBuffer();
//     return buffer;
//   },
// });
