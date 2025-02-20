type FrameButtonProps = {
  label: string;
  action?: "post" | "post_redirect" | "link";
  target?: string;
};

type FrameMetadataProps = {
  title: string;
  description?: string;
  image?: string;
  buttons?: FrameButtonProps[];
  postUrl?: string;
};

export function getFrameMetadata({
  title,
  description,
  image = "/opengraph-image",
  buttons = [],
  postUrl = "/api/frame",
}: FrameMetadataProps): string {
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
