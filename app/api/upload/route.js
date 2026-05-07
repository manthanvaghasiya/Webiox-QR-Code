// ─────────────────────────────────────────────────────────────────────────────
// GENERIC UPLOAD — Upload a file to Vercel Blob (public access).
//
// POST /api/upload — Multipart form upload; returns public blob URL.
//   Validates MIME type (image / pdf / audio / video) and enforces a 10MB cap.
//   Filename is randomized server-side to prevent enumeration.
// (Auth required: yes  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = new Set([
  // images (used by vCard logos, gallery, generator)
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  // documents (used by PDF QR type)
  "application/pdf",
  // audio (used by MP3 QR type)
  "audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav",
  // video (used by Video QR type)
  "video/mp4", "video/webm", "video/quicktime",
]);

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    // Randomize filename so users can't enumerate or overwrite each other's files.
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().slice(0, 8);
    const randomName = `up_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const blob = await put(randomName, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}
