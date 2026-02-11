import { useState } from "react";
import { useParams, Link } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useNovel, useGeneratePlot } from "@/hooks/use-novels";
import { useChapters, useCreateChapter, useReorderChapters } from "@/hooks/use-chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, GripVertical, Sparkles, Loader2, FileText, ArrowLeft } from "lucide-react";
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Planner() {
  const { id } = useParams();
  const novelId = Number(id);
  const { data: novel } = useNovel(novelId);
  const { data: chapters } = useChapters(novelId);
  const createChapter = useCreateChapter();
  const generatePlot = useGeneratePlot();
  const reorderChapters = useReorderChapters();
  
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) return;
    createChapter.mutate({
      novelId,
      title: newChapterTitle,
      orderIndex: chapters ? chapters.length : 0,
      content: "",
      status: "draft"
    });
    setNewChapterTitle("");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id && chapters) {
      const oldIndex = chapters.findIndex(c => c.id === active.id);
      const newIndex = chapters.findIndex(c => c.id === over.id);
      
      const newChapters = [...chapters];
      const [movedChapter] = newChapters.splice(oldIndex, 1);
      newChapters.splice(newIndex, 0, movedChapter);

      // Create update payload
      const updates = newChapters.map((ch, index) => ({
        id: ch.id,
        orderIndex: index
      }));

      reorderChapters.mutate({ novelId, orders: updates });
    }
  };

  const handleGeneratePlot = () => {
    if (!novel) return;
    generatePlot.mutate({
      genre: novel.genre,
      theme: `A story about ${novel.title}`
    }, {
      onSuccess: (data) => {
        setIsGenerateDialogOpen(false);
        // Here you would typically show the generated plot in a modal or add it to notes
        alert(data.plot); // Placeholder for MVP
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar novelId={novelId} novel={novel} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">تخطيط الرواية</h1>
            <p className="text-muted-foreground text-sm">رتب أفكارك وفصولك لتسرد قصتك بتسلسل مثالي</p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                <Sparkles className="w-4 h-4" />
                توليد حبكة بالذكاء الاصطناعي
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>المساعد الذكي</DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center">
                {generatePlot.isPending ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p>جاري استلهام الأفكار...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">سيقوم الذكاء الاصطناعي باقتراح حبكة متكاملة بناءً على نوع روايتك.</p>
                    <Button onClick={handleGeneratePlot} className="w-full">توليد الآن</Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapter List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-2 mb-6">
                  <Input 
                    placeholder="عنوان الفصل الجديد..." 
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateChapter()}
                    className="flex-1"
                  />
                  <Button onClick={handleCreateChapter} disabled={createChapter.isPending}>
                    <Plus className="w-4 h-4 ml-2" /> إضافة
                  </Button>
                </div>

                {!chapters || chapters.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                    <p className="text-muted-foreground">لا توجد فصول بعد. ابدأ بإضافة الفصل الأول!</p>
                  </div>
                ) : (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {chapters.map((chapter) => (
                          <SortableChapterItem key={chapter.id} chapter={chapter} novelId={novelId} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Helper Panel */}
          <div className="space-y-6">
            <Card className="bg-amber-50/50 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold text-lg text-amber-900 mb-4">هيكل الرواية المقترح</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                    <div>
                      <span className="font-bold block text-amber-900">البداية (25%)</span>
                      <p className="text-amber-800/80 text-xs">تقديم الشخصيات والعالم، والحدث المحفز.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                    <div>
                      <span className="font-bold block text-amber-900">الوسط (50%)</span>
                      <p className="text-amber-800/80 text-xs">تتصاعد الأحداث والعقبات، وتتطور الشخصية.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                    <div>
                      <span className="font-bold block text-amber-900">النهاية (25%)</span>
                      <p className="text-amber-800/80 text-xs">ذروة الصراع والحل النهائي.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SortableChapterItem({ chapter, novelId }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center bg-card border rounded-lg p-3 hover:shadow-md transition-all">
      <div {...attributes} {...listeners} className="cursor-grab p-2 text-muted-foreground hover:text-primary">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 mr-2">
        <div className="flex justify-between items-center">
          <span className="font-medium font-serif text-lg">{chapter.title}</span>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-0.5 rounded ${chapter.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {chapter.status === 'final' ? 'نهائي' : 'مسودة'}
            </span>
            <Link href={`/novels/${novelId}/chapters/${chapter.id}`}>
              <Button size="sm" variant="ghost" className="h-8 gap-1 hover:bg-primary/10 hover:text-primary">
                <FileText className="w-4 h-4" />
                تحرير
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
