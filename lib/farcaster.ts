import { z } from "zod";

// Validation schemas
export const FrameButtonSchema = z.object({
  label: z.string().min(1).max(24),
  action: z.enum(["post", "post_redirect", "link"]).optional(),
  target: z.string().url().optional(),
});

export const FrameMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  buttons: z.array(FrameButtonSchema).max(4).optional(),
  postUrl: z.string().url().optional(),
});

export type FrameButtonProps = z.infer<typeof FrameButtonSchema>;
export type FrameMetadataProps = z.infer<typeof FrameMetadataSchema> & {
  title: string;
  description?: string;
  image?: string;
  buttons?: FrameButtonProps[];
  postUrl?: string;
};

export function getFrameMetadata(props: FrameMetadataProps): string {
  // Validate inputs
  const validated = FrameMetadataSchema.parse({
    ...props,
    image: props.image ?? "/opengraph-image",
    buttons: props.buttons ?? [],
    postUrl: props.postUrl ?? "/api/frame",
  });

  const { title, description, image, buttons, postUrl } = validated;
  const metadata = [
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="${image}" />`,
    `<meta property="fc:frame:post_url" content="${postUrl}" />`,
  ];

  if (description) {
    metadata.push(
      `<meta property="fc:frame:description" content="${description}" />`
    );
  }

  buttons.forEach((button, index) => {
    metadata.push(
      `<meta property="fc:frame:button:${index + 1}" content="${button.label}" />`
    );
    if (button.action) {
      metadata.push(
        `<meta property="fc:frame:button:${index + 1}:action" content="${
          button.action
        }" />`
      );
    }
    if (button.target) {
      metadata.push(
        `<meta property="fc:frame:button:${index + 1}:target" content="${
          button.target
        }" />`
      );
    }
  });

  return metadata.join("\n");
}
