"use node";
import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import UnrealSpeech from "unrealspeech";

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

    const speechData = await unrealSpeech.speech(input, voice);

    console.log(speechData);

    const audioUrl: string = speechData.OutputUri;

    if (!audioUrl) throw new ConvexError("Error generating audio");
    const mp3Response = await fetch(audioUrl);

    const buffer = await mp3Response.arrayBuffer();

    return buffer;
  },
});
