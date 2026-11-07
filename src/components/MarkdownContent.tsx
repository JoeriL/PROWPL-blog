"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, ZoomIn, X, Code2 } from "lucide-react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const displayLang = language.trim().toUpperCase() || "CODE";

  return (
    <div className="my-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-sm not-prose">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Code2 className="w-3.5 h-3.5" />
          {displayLang}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Kopieer code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Gekopieerd</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Kopieer</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-zinc-200 selection:bg-emerald-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface ImageEmbedProps {
  src: string;
  alt: string;
  onPreview: (src: string, alt: string) => void;
}

function ImageEmbed({ src, alt, onPreview }: ImageEmbedProps) {
  return (
    <figure className="my-4 rounded-xl border border-border/70 overflow-hidden bg-card shadow-sm not-prose group">
      <div
        className="relative overflow-hidden bg-muted/40 flex items-center justify-center cursor-pointer"
        onClick={() => onPreview(src, alt)}
      >
        <img
          src={src}
          alt={alt || "Afbeelding"}
          className="w-full max-h-[460px] object-contain transition-transform duration-200 group-hover:scale-[1.01]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-xs">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Klik om te vergroten</span>
          </span>
        </div>
      </div>
      {alt && (
        <figcaption className="px-3 py-1.5 text-xs text-muted-foreground text-center bg-muted/30 border-t border-border/40 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  if (!content) return null;

  // Split content into blocks: code blocks, images, and text
  const blocks: React.ReactNode[] = [];
  const lines = content.split("\n");

  let i = 0;
  let textBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (textBuffer.length === 0) return;
    const textChunk = textBuffer.join("\n").trim();
    if (textChunk) {
      blocks.push(
        <div
          key={`text-${blocks.length}`}
          className="whitespace-pre-wrap leading-relaxed text-foreground/90 font-sans"
        >
          {renderInlineFormatting(textChunk)}
        </div>
      );
    }
    textBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    // Check for start of fenced code block (```lang)
    if (line.trim().startsWith("```")) {
      flushTextBuffer();
      const language = line.trim().slice(3);
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      blocks.push(
        <CodeBlock
          key={`code-${blocks.length}`}
          language={language}
          code={codeLines.join("\n")}
        />
      );
      continue;
    }

    // Check for markdown image: ![alt](url)
    const imageMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      flushTextBuffer();
      const alt = imageMatch[1];
      const src = imageMatch[2];
      blocks.push(
        <ImageEmbed
          key={`img-${blocks.length}`}
          alt={alt}
          src={src}
          onPreview={(s, a) => setModalImage({ src: s, alt: a })}
        />
      );
      i++;
      continue;
    }

    // Standard text line
    textBuffer.push(line);
    i++;
  }

  flushTextBuffer();

  return (
    <div className={`space-y-2 text-sm ${className}`}>
      {blocks}

      {/* Lightbox Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="text-xs font-medium text-foreground truncate max-w-md">
                {modalImage.alt || "Afbeelding weergave"}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={modalImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Open in nieuw tabblad"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setModalImage(null)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center bg-black/20 max-h-[80vh]">
              <img
                src={modalImage.src}
                alt={modalImage.alt}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Handles basic inline markdown syntax: `inline code`, **bold**, [link](url)
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex to split by inline code, bold, links
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-[11px] text-emerald-600 dark:text-emerald-400 border border-border/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={`link-${match.index}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:opacity-80 font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
