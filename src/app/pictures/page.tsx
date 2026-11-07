import { Suspense } from "react";
import { getCascadingPictures } from "@/lib/media-actions";
import { Header } from "@/components/Header";
import { PicturesGallery } from "@/components/PicturesGallery";

export const metadata = {
  title: "Pictures & Bewijslast | Aertssen NV Stage Portfolio",
  description:
    "Overzicht van projectafbeeldingen, architectuurschema's en bewijsmateriaal voor de stageopdrachten bij Aertssen NV.",
};

export default async function PicturesPage() {
  const manifest = await getCascadingPictures();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-500">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        <Suspense
          fallback={
            <div className="p-12 text-center text-muted-foreground text-sm animate-pulse flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Laden van afbeeldingen galerij...
            </div>
          }
        >
          <PicturesGallery manifest={manifest} />
        </Suspense>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-muted/20">
        <p>Aertssen NV Stage Logboek • Joeri L. • Graduaat Programmeren WPL 2026</p>
      </footer>
    </div>
  );
}
