import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useChapter, useUpdateChapter } from "@/hooks/use-chapters";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Save, Loader2, Check } from "lucide-react";

export default function Editor() {
  const { novelId, chapterId } = useParams();
  const id = Number(chapterId);
  const { data: chapter, isLoading } = useChapter(id);
  const updateChapter = useUpdateChapter();
  
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize state when data loads
  useEffect(() => {
    if (chapter) {
      setContent(chapter.content || "");
      setTitle(chapter.title);
    }
  }, [chapter]);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chapter && (content !== chapter.content || title !== chapter.title)) {
        handleSave();
      }
    }, 3000); // Auto-save every 3s of inactivity

    return () => clearTimeout(timer);
  }, [content, title]);

  const handleSave = () => {
    updateChapter.mutate(
      { id, title, content },
      { onSuccess: () => setLastSaved(new Date()) }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Editor Navbar */}
      <header className="h-16 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-20 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/novels/${novelId}/planner`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronRight className="w-4 h-4" />
              العودة
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none shadow-none text-lg font-bold font-serif w-64 focus-visible:ring-0 bg-transparent px-0"
            placeholder="عنوان الفصل"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {updateChapter.isPending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                جاري الحفظ...
              </>
            ) : lastSaved ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                تم الحفظ {lastSaved.toLocaleTimeString("ar-EG")}
              </>
            ) : null}
          </div>
          <Button onClick={handleSave} size="sm" disabled={updateChapter.isPending}>
            <Save className="w-4 h-4 ml-2" />
            حفظ يدوي
          </Button>
        </div>
      </header>

      {/* Editor Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 md:p-12 animate-in">
        <RichTextEditor 
          content={content} 
          onChange={setContent}
          placeholder="اكتب فصلاً جديداً من الإبداع..."
        />
      </main>
    </div>
  );
}
