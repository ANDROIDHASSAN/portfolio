// OG images are rendered by satori, which can't decode WebP and shouldn't depend on the live site
// being up, so the avatar is a small bundled JPG passed in as a data URI.
export async function getOgAvatar(): Promise<string | undefined> {
  try {
    const buf = await fetch(new URL("../../public/me-og.jpg", import.meta.url)).then((res) => res.arrayBuffer());
    let binary = "";
    for (const byte of new Uint8Array(buf)) binary += String.fromCharCode(byte);
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } catch {
    return undefined;
  }
}
