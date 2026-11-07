"use client";

import React, { useState, useMemo } from "react";
import {
  Folder,
  Image as ImageIcon,
  Copy,
  Check,
  Search,
  ExternalLink,
  FolderOpen,
  Calendar,
  HardDrive,
  ZoomIn,
  FileText,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  PicturesManifest,
  PictureItem,
  savePictureNote,
} from "@/lib/media-actions";

interface PicturesGalleryProps {
  manifest: PicturesManifest;
}

export function PicturesGallery({ manifest }: PicturesGalleryProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<PictureItem | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [lightboxEditing, setLightboxEditing] = useState(false);

  // Picture notes state, initialized from manifest
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    manifest.items.forEach((item) => {
      initial[item.webPath] = item.note || "";
    });
    return initial;
  });

  const [saveStatus, setSaveStatus] = useState<
    Record<string, "idle" | "saving" | "saved">
  >({});

  const handleNoteChange = (webPath: string, value: string) => {
    setNotes((prev) => ({ ...prev, [webPath]: value }));
  };

  const handleNoteSave = async (webPath: string) => {
    const note = notes[webPath] ?? "";
    setSaveStatus((prev) => ({ ...prev, [webPath]: "saving" }));
    try {
      const res = await savePictureNote(webPath, note);
      if (res.success) {
        setSaveStatus((prev) => ({ ...prev, [webPath]: "saved" }));
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [webPath]: "idle" }));
        }, 2000);
      } else {
        setSaveStatus((prev) => ({ ...prev, [webPath]: "idle" }));
      }
    } catch {
      setSaveStatus((prev) => ({ ...prev, [webPath]: "idle" }));
    }
  };

  const getMarkdownTag = (item: PictureItem) => {
    const userNote = (notes[item.webPath] ?? item.note ?? "").trim();
    const cleanDefault = item.fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ");
    const altText = userNote || cleanDefault;
    return `![${altText}](${item.webPath})`;
  };

  // Filter items by selected folder and search query (including note text)
  const filteredItems = useMemo(() => {
    return manifest.items.filter((item) => {
      const matchesFolder =
        selectedFolder === "all" || item.subfolder === selectedFolder;
      const userNote = notes[item.webPath] || "";
      const matchesSearch =
        searchQuery === "" ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subfolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userNote.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [manifest.items, selectedFolder, searchQuery, notes]);

  // Compute item count per folder
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    manifest.items.forEach((item) => {
      counts[item.subfolder] = (counts[item.subfolder] || 0) + 1;
    });
    return counts;
  }, [manifest.items]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar & Subfolder Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Dynamic Subfolder Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFolder("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedFolder === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Alle Afbeeldingen</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedFolder === "all"
                  ? "bg-white/20 text-white"
                  : "bg-background text-muted-foreground"
              }`}
            >
              {manifest.items.length}
            </span>
          </button>

          {manifest.folders.map((folder) => {
            const count = folderCounts[folder] || 0;
            const isSelected = selectedFolder === folder;
            return (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>{folder}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek op naam of beschrijving..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-background border border-border/80 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Picture Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 sm:p-14 text-center bg-card/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {manifest.items.length === 0
                ? "Nog geen afbeeldingen gevonden in public/Pictures/"
                : "Geen afbeeldingen die voldoen aan de zoekopdracht"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {manifest.items.length === 0 ? (
                <>
                  Plaats je screenshots of schema&apos;s in{" "}
                  <code>public/Pictures/</code> of in een eigen submap (zoals{" "}
                  <code>public/Pictures/BlueDolphin/</code>). Ze verschijnen hier
                  direct automatisch!
                </>
              ) : (
                "Probeer een andere zoekterm of selecteer een andere map in de tabs hierboven."
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isCopiedMd = copiedId === `md-${item.id}`;
            const isCopiedUrl = copiedId === `url-${item.id}`;
            const currentNote = (notes[item.webPath] ?? item.note ?? "").trim();
            const currentStatus = saveStatus[item.webPath] || "idle";
            const isEditing = editingPath === item.webPath;

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col"
              >
                {/* Image Thumbnail */}
                <div
                  className="relative aspect-video bg-muted/30 overflow-hidden cursor-pointer flex items-center justify-center border-b border-border/40"
                  onClick={() => setLightboxItem(item)}
                >
                  <img
                    src={item.webPath}
                    alt={item.fileName}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-medium backdrop-blur-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Vergroten</span>
                    </span>
                  </div>

                  {/* Subfolder Pill */}
                  <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    <Folder className="w-2.5 h-2.5 text-emerald-400" />
                    {item.subfolder}
                  </span>

                  {/* Extension Pill */}
                  <span className="absolute top-2 right-2 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/60 text-emerald-300 backdrop-blur-xs">
                    {item.extension}
                  </span>
                </div>

                {/* Card Info, Notes & Copy Buttons */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h4
                        className="text-xs font-semibold text-foreground truncate"
                        title={item.fileName}
                      >
                        {item.fileName}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-muted-foreground/80" />
                          {item.sizeFormatted}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground/80" />
                          {item.modifiedAt}
                        </span>
                      </div>

                      <code className="block text-[10px] font-mono text-muted-foreground truncate bg-muted/40 px-1.5 py-0.5 rounded">
                        {item.webPath}
                      </code>
                    </div>

                    {/* Picture Info: Gray "About" Box OR Editable Input */}
                    <div className="pt-2 border-t border-border/50">
                      {currentNote && !isEditing ? (
                        /* Gray "About" Box */
                        <div
                          onClick={() => setEditingPath(item.webPath)}
                          className="p-2.5 rounded-xl bg-muted/70 dark:bg-zinc-800/60 border border-border/80 hover:border-emerald-500/50 hover:bg-muted/90 transition-all cursor-pointer group/about"
                          title="Klik om de About tekst aan te passen"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                              <FileText className="w-3 h-3 text-emerald-500" />
                              About
                            </span>
                            <span className="text-[10px] text-muted-foreground group-hover/about:text-emerald-500 flex items-center gap-0.5 opacity-60 group-hover/about:opacity-100 transition-opacity">
                              <Pencil className="w-2.5 h-2.5" />
                              Bewerken
                            </span>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed break-words whitespace-pre-wrap">
                            {currentNote}
                          </p>
                        </div>
                      ) : (
                        /* Edit / Input Field */
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <FileText className="w-3 h-3 text-emerald-500" />
                              About
                            </span>
                            {currentStatus === "saving" && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                Opslaan...
                              </span>
                            )}
                            {currentStatus === "saved" && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                Opgeslagen
                              </span>
                            )}
                          </div>
                          <input
                            autoFocus={isEditing}
                            type="text"
                            placeholder="Typ toelichting over deze foto..."
                            value={notes[item.webPath] ?? ""}
                            onChange={(e) =>
                              handleNoteChange(item.webPath, e.target.value)
                            }
                            onBlur={() => {
                              handleNoteSave(item.webPath);
                              setEditingPath(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleNoteSave(item.webPath);
                                setEditingPath(null);
                                (e.target as HTMLInputElement).blur();
                              }
                              if (e.key === "Escape") {
                                setEditingPath(null);
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-2xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
                    <button
                      onClick={() =>
                        copyToClipboard(getMarkdownTag(item), `md-${item.id}`)
                      }
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                      title="Kopieer ![Toelichting](/Pictures/...) voor in je blogverslag"
                    >
                      {isCopiedMd ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Markdown</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        copyToClipboard(item.webPath, `url-${item.id}`)
                      }
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                      title="Kopieer web URL"
                    >
                      {isCopiedUrl ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">URL OK!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-muted-foreground" />
                          <span>Kopieer URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => {
            setLightboxItem(null);
            setLightboxEditing(false);
          }}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground truncate max-w-md">
                  {lightboxItem.fileName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                  {lightboxItem.subfolder}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      getMarkdownTag(lightboxItem),
                      `lightbox-md-${lightboxItem.id}`
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                >
                  {copiedId === `lightbox-md-${lightboxItem.id}` ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Gekopieerd</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Kopieer Markdown</span>
                    </>
                  )}
                </button>
                <a
                  href={lightboxItem.webPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Open origineel"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-3 overflow-auto flex items-center justify-center bg-black/20 max-h-[70vh]">
              <img
                src={lightboxItem.webPath}
                alt={lightboxItem.fileName}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>

            {/* Note display / edit inside Lightbox */}
            <div className="p-3 border-t border-border bg-muted/20">
              {(notes[lightboxItem.webPath] ?? lightboxItem.note ?? "").trim() &&
              !lightboxEditing ? (
                /* Gray "About" Box in Lightbox */
                <div
                  onClick={() => setLightboxEditing(true)}
                  className="p-3 rounded-xl bg-muted/70 dark:bg-zinc-800/60 border border-border/80 hover:border-emerald-500/50 transition-all cursor-pointer group/about"
                  title="Klik om 'About' aan te passen"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      About
                    </span>
                    <span className="text-xs text-muted-foreground group-hover/about:text-emerald-500 flex items-center gap-1">
                      <Pencil className="w-3 h-3" />
                      Bewerken
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {(
                      notes[lightboxItem.webPath] ??
                      lightboxItem.note ??
                      ""
                    ).trim()}
                  </p>
                </div>
              ) : (
                /* Edit field in Lightbox */
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      About
                    </span>
                    {saveStatus[lightboxItem.webPath] === "saved" && (
                      <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Opgeslagen
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus={lightboxEditing}
                      type="text"
                      placeholder="Voeg toelichting toe..."
                      value={
                        notes[lightboxItem.webPath] ??
                        lightboxItem.note ??
                        ""
                      }
                      onChange={(e) =>
                        handleNoteChange(lightboxItem.webPath, e.target.value)
                      }
                      onBlur={() => {
                        handleNoteSave(lightboxItem.webPath);
                        setLightboxEditing(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleNoteSave(lightboxItem.webPath);
                          setLightboxEditing(false);
                        }
                        if (e.key === "Escape") {
                          setLightboxEditing(false);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => {
                        handleNoteSave(lightboxItem.webPath);
                        setLightboxEditing(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 cursor-pointer"
                    >
                      Klaar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
