import { Link } from "wouter";
import { Plus, BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNovels } from "@/hooks/use-novels";
import { NovelCard } from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: novels, isLoading } = useNovels();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <header className="bg-white border-b border-border/40 py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-6">
            <PenTool className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            روياتي
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            مساحتك الخاصة للإبداع الأدبي. خطط، اكتب، وانشر روايتك القادمة في بيئة مصممة للكتاب العرب.
          </p>
          <Link href="/novels/new">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Plus className="w-5 h-5 ml-2" />
              ابدأ رواية جديدة
            </Button>
          </Link>
        </div>
      </header>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-serif">مكتبة أعمالك</h2>
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
              {novels?.length || 0}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl border p-6 flex flex-col gap-4">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="mt-auto flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : novels?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-muted rounded-2xl bg-muted/10">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">لا توجد روايات حتى الآن</h3>
            <p className="text-muted-foreground mb-6">ابدأ رحلتك الأدبية وأنشئ روايتك الأولى</p>
            <Link href="/novels/new">
              <Button variant="outline" className="border-primary/30 hover:border-primary text-primary">
                إنشاء رواية جديدة
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in">
            {novels?.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
