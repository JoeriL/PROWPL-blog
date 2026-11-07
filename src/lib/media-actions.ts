"use server";

import fs from "fs";
import path from "path";
import { db, ensureDbInitialized } from "@/db";
import { pictureNotes } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface PictureItem {
  id: string;
  fileName: string;
  subfolder: string;
  relativePath: string;
  webPath: string;
  markdownTag: string;
  sizeFormatted: string;
  modifiedAt: string;
  extension: string;
  note?: string;
}

export interface PicturesManifest {
  folders: string[];
  items: PictureItem[];
}

const SUPPORTED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".bmp",
]);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Recursively scans the public/Pictures folder for user-defined subdirectories and images,
 * and attaches stored notes from the database.
 */
export async function getCascadingPictures(): Promise<PicturesManifest> {
  const picturesDir = path.join(process.cwd(), "public", "Pictures");

  if (!fs.existsSync(picturesDir)) {
    try {
      fs.mkdirSync(picturesDir, { recursive: true });
    } catch (err) {
      console.error("Could not create public/Pictures directory:", err);
      return { folders: [], items: [] };
    }
  }

  // Load existing notes from database
  const notesMap = new Map<string, string>();
  try {
    await ensureDbInitialized();
    const rows = await db.select().from(pictureNotes);
    for (const r of rows) {
      notesMap.set(r.webPath, r.note);
    }
  } catch (err) {
    console.error("Error loading picture notes:", err);
  }

  const items: PictureItem[] = [];
  const discoveredFolders = new Set<string>();

  function walkDirectory(currentDir: string, relativeFolder = "") {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue; // skip hidden files like .gitkeep

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          const folderRel = relativeFolder
            ? `${relativeFolder}/${entry.name}`
            : entry.name;
          discoveredFolders.add(folderRel);
          walkDirectory(fullPath, folderRel);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (SUPPORTED_EXTENSIONS.has(ext)) {
            const folderName = relativeFolder || "Hoofdmap";
            discoveredFolders.add(folderName);

            const fileRel = relativeFolder
              ? `${relativeFolder}/${entry.name}`
              : entry.name;

            // URL path accessible in browser via Next.js static public hosting
            const normalizedWebPath = `/Pictures/${fileRel.replace(/\\/g, "/")}`;

            let size = 0;
            let modifiedAt = "";
            try {
              const stats = fs.statSync(fullPath);
              size = stats.size;
              modifiedAt = stats.mtime.toISOString().split("T")[0];
            } catch {
              modifiedAt = "";
            }

            // Clean title fallback for markdown description
            const cleanTitle = path
              .basename(entry.name, ext)
              .replace(/[-_]/g, " ")
              .trim();

            const note = notesMap.get(normalizedWebPath) || "";
            const displayTitle = note.trim() || cleanTitle;

            items.push({
              id: `${folderName}-${entry.name}`,
              fileName: entry.name,
              subfolder: folderName,
              relativePath: fileRel,
              webPath: normalizedWebPath,
              markdownTag: `![${displayTitle}](${normalizedWebPath})`,
              sizeFormatted: formatBytes(size),
              modifiedAt,
              extension: ext.replace(".", "").toUpperCase(),
              note,
            });
          }
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${currentDir}:`, err);
    }
  }

  walkDirectory(picturesDir);

  // Sort folders alphabetically
  const sortedFolders = Array.from(discoveredFolders).sort((a, b) => {
    if (a === "Hoofdmap") return -1;
    if (b === "Hoofdmap") return 1;
    return a.localeCompare(b);
  });

  // Sort items newest first, then filename
  items.sort((a, b) => {
    if (a.modifiedAt !== b.modifiedAt) {
      return b.modifiedAt.localeCompare(a.modifiedAt);
    }
    return a.fileName.localeCompare(b.fileName);
  });

  return {
    folders: sortedFolders,
    items,
  };
}

/**
 * Save or update custom description / notes for a specific picture.
 */
export async function savePictureNote(
  webPath: string,
  note: string
): Promise<{ success: boolean; note: string; error?: string }> {
  try {
    await ensureDbInitialized();
    const cleanNote = note.trim();

    const existing = await db
      .select()
      .from(pictureNotes)
      .where(eq(pictureNotes.webPath, webPath))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(pictureNotes)
        .set({
          note: cleanNote,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(pictureNotes.webPath, webPath));
    } else {
      await db.insert(pictureNotes).values({
        webPath,
        note: cleanNote,
        updatedAt: new Date().toISOString(),
      });
    }

    return { success: true, note: cleanNote };
  } catch (error) {
    console.error("Error saving picture note:", error);
    return {
      success: false,
      note,
      error: error instanceof Error ? error.message : "Fout bij opslaan",
    };
  }
}
