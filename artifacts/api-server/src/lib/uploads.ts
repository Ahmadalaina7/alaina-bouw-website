export interface LeadUpload {
  filename: string;
  content: Buffer;
  contentType: string;
}

const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

const extensionForType: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "image/heic": ["heic", "heif"],
  "application/pdf": ["pdf"],
};

export function parseMultipart(
  body: Buffer,
  contentType: string,
): { fields: Record<string, string>; files: { filename: string; data: Buffer }[] } {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i);
  const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2];
  if (!boundary) {
    throw new Error("Ontbrekende uploadgrens.");
  }

  const separator = Buffer.from(`--${boundary}`);
  const fields: Record<string, string> = {};
  const files: { filename: string; data: Buffer }[] = [];
  let cursor = body.indexOf(separator);
  if (cursor === -1) return { fields, files };
  cursor += separator.length;

  while (cursor < body.length) {
    if (body.subarray(cursor, cursor + 2).toString() === "--") break;
    if (body.subarray(cursor, cursor + 2).toString() === "\r\n") cursor += 2;

    const headerEnd = body.indexOf("\r\n\r\n", cursor);
    if (headerEnd === -1) break;
    const header = body.subarray(cursor, headerEnd).toString("utf8");
    const contentStart = headerEnd + 4;
    const nextSeparator = body.indexOf(separator, contentStart);
    if (nextSeparator === -1) break;

    let contentEnd = nextSeparator;
    if (body.subarray(contentEnd - 2, contentEnd).toString() === "\r\n") contentEnd -= 2;
    const content = body.subarray(contentStart, contentEnd);
    const name = header.match(/name="([^"]+)"/i)?.[1]?.replace(/\[\]$/, "");
    const filename = header.match(/filename="([^"]*)"/i)?.[1];

    if (name && filename) {
      files.push({ filename, data: Buffer.from(content) });
    } else if (name) {
      fields[name] = content.toString("utf8");
    }

    cursor = nextSeparator + separator.length;
  }

  return { fields, files };
}

function sniffType(data: Buffer): string | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "image/jpeg";
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (data.length >= 6 && (data.subarray(0, 6).toString("ascii") === "GIF87a" || data.subarray(0, 6).toString("ascii") === "GIF89a")) return "image/gif";
  if (data.length >= 12 && data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (data.length >= 5 && data.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  if (data.length >= 12 && data.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = data.subarray(8, 12).toString("ascii");
    if (["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"].includes(brand)) return "image/heic";
  }
  return null;
}

function safeFilename(name: string, extension: string, index: number): string {
  const baseName = name.split(/[/\\]/).pop() ?? "";
  const stem = baseName.replace(/\.[^.]+$/, "");
  const cleaned = stem.replace(/[^\p{L}\p{N}._ -]+/gu, "").replace(/^\.+/, "").trim().slice(0, 60);
  return `${cleaned || `bestand-${index + 1}`}.${extension}`;
}

export function acceptUploads(
  files: { filename: string; data: Buffer }[],
): { ok: true; uploads: LeadUpload[] } | { ok: false; status: number; error: string } {
  if (files.length > MAX_FILES) {
    return { ok: false, status: 400, error: "U kunt maximaal 5 bestanden meesturen." };
  }

  let total = 0;
  const used = new Map<string, number>();
  const uploads: LeadUpload[] = [];

  for (const [index, file] of files.entries()) {
    if (file.data.length > MAX_FILE_BYTES) {
      return { ok: false, status: 413, error: "Een bestand is te groot. Maximaal 8 MB per bestand." };
    }
    total += file.data.length;
    if (total > MAX_TOTAL_BYTES) {
      return { ok: false, status: 413, error: "De bestanden zijn samen te groot. Maximaal 20 MB in totaal." };
    }

    const extension = file.filename.split(".").pop()?.toLowerCase() ?? "";
    const detected = sniffType(file.data);
    if (!detected || !extensionForType[detected]?.includes(extension)) {
      return { ok: false, status: 400, error: "Gebruik een foto (JPG, PNG, WEBP, HEIC) of een PDF." };
    }

    let filename = safeFilename(file.filename, extension, index);
    const count = used.get(filename) ?? 0;
    if (count > 0) filename = filename.replace(/(\.[^.]+)$/, `-${count + 1}$1`);
    used.set(filename.replace(/-\d+(\.[^.]+)$/, "$1"), count + 1);
    used.set(filename, 1);

    uploads.push({ filename, content: file.data, contentType: detected });
  }

  return { ok: true, uploads };
}
