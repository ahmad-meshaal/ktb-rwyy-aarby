import { Link } from "wouter";
import { Book, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Novel } from "@shared/schema";
import { useDeleteNovel } from "@/hooks/use-novels";

interface NovelCardProps {
  novel: Novel;
}

export function NovelCard({ novel }: NovelCardProps) {
  const deleteNovel = useDeleteNovel();

  return (
    <div className="group relative bg-card hover:bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Decorative book spine effect */}
      <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />

      <div>
        <div className="flex justify-between items-start mb-4 pl-2">
          <div className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/10">
            {novel.genre}
          </div>
          <div className="text-muted-foreground text-xs font-medium">
            {new Date(novel.createdAt!).toLocaleDateString("ar-EG")}
          </div>
        </div>

        <Link href={`/novels/${novel.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="text-xl font-bold font-serif mb-2 leading-relaxed">{novel.title}</h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {novel.summary || "لا يوجد ملخص..."}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t pt-4">
        <Link href={`/novels/${novel.id}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground border-primary/20">
            <Edit2 className="w-4 h-4" />
            <span>متابعة الكتابة</span>
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="font-sans" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف الرواية "{novel.title}" وجميع الفصول والشخصيات المرتبطة بها نهائياً.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteNovel.mutate(novel.id)}
                className="bg-destructive hover:bg-destructive/90"
              >
                حذف نهائي
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
