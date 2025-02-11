import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const validateRequest = async (
  req: Request,
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error verifying");
    return;
  }

  return evt as unknown as WebhookEvent;
};

const handleClerkWebhook = httpAction(async (ctx, request) => {
  try {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Invalid request", { status: 400 });
    }
    switch (event.type) {
      case "user.created":
        await ctx.runMutation(internal.users.createUser, {
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
          imageUrl: event.data.image_url,
          name: event.data.first_name!,
        });
        break;
      case "user.updated":
        await ctx.runMutation(internal.users.updateUser, {
          clerkId: event.data.id,
          imageUrl: event.data.image_url,
          email: event.data.email_addresses[0].email_address,
          name: event.data.first_name!,
        });
        break;
      case "user.deleted":
        await ctx.runMutation(internal.history.deleteUserHistory, {
          clerkId: event.data.id as string,
        });
        await ctx.runMutation(internal.podcasts.deleteUserPodcasts, {
          clerkId: event.data.id as string,
        });
        await ctx.runMutation(internal.users.deleteUser, {
          clerkId: event.data.id as string,
        });
        break;
    }
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Webhook error", { status: 400 });
  }
});

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

// stripe
http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature") as string;

    const result = await ctx.runAction(internal.stripe.fulfill, {
      payload: await request.text(),
      signature,
    });

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
