import { type NextRequest } from "next/server";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";
import { getFrameMetadata } from "~/lib/farcaster";
import { z } from "zod";

export const runtime = "edge";

// Validate request parameters
const RequestSchema = z.object({
  next: z.string().optional(),
  error: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Validate URL parameters
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { next, error } = RequestSchema.parse(searchParams);
  // Get frame metadata
  const metadata = getFrameMetadata({
    title: PROJECT_TITLE,
    description: PROJECT_DESCRIPTION,
    buttons: [
      {
        label: "Continue",
      },
    ],
  });

    // Return HTML page with frame metadata
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          ${metadata}
          <meta property="og:title" content="${PROJECT_TITLE}" />
          <meta property="og:description" content="${PROJECT_DESCRIPTION}" />
        </head>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Frame API Error:", error);
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          ${getFrameMetadata({
            title: "Error",
            description: "Something went wrong. Please try again.",
            buttons: [{ label: "Retry" }],
          })}
        </head>
      </html>`,
      {
        status: error instanceof z.ZodError ? 400 : 500,
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
