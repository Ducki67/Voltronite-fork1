export function encodeToken(data: object) {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export function decodeToken(token: string): any | null {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch {
    return null;
  }
}
