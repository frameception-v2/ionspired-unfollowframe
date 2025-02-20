import { type NextRequest } from "next/server";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "@/lib/constants";
import { getFrameMetadata } from "@/lib/farcaster";

export const runtime = "edge";

export async function GET(req: NextRequest) {
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
      },
    }
  );
}
