import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
const http = httpRouter();

http.route({
  path: "/upload-file",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);
    return new Response(JSON.stringify(storageId), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
