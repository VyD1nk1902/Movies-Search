import type { TMDBConfigResponse } from "@/Types";

export const buildTMDBImageUrl = (
  config: TMDBConfigResponse | undefined,
  path: string | null,
  size: "original",
) => {
  if (!config || !path) return;
  const baseUrl = config.images.secure_base_url;
  return `${baseUrl}${size}${path}`;
};
