import { useParams, Link } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useNovel } from "@/hooks/use-novels";
import { useChapters } from "@/hooks/use-chapters";
import { useCharacters } from "@/hooks/use-characters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, Users, FileText, ArrowLeft, 
  TrendingUp, Calendar, Clock 
} from "lucide-react";

export default function Dashboard() {
  const { id } = useParams();
  const novelId = Number(id);
  const { data: novel, isLoading: loadingNovel } = useNovel(novelId);
  const { data: chapters } = useChapters(novelId);
  const { data: characters } = useCharacters(novelId);

  if (loadingNovel) return <DashboardSkeleton />;
  if (!novel) return <div className="p-8 text-center text-red-500">رواية غير موجودة</div>;

  const totalWords = 0; // Ideally calculated from chapters content
  const progress = Math.min(100, Math.round((totalWords / (novel.targetWordCount || 50000)) * 100));

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar novelId={novelId} novel={novel} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end animate-in">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">{novel.title}</h1>
            <p className="text-muted-foreground flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                تاريخ البدء: {new Date(novel.createdAt!).toLocaleDateString("ar-EG")}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {novel.genre}
              </span>
            </p>
          </div>
          <Link href={`/novels/${novelId}/planner`}>
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <FileText className="w-5 h-5 ml-2" />
              الانتقال للفصول
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in" style={{ animationDelay: "100ms" }}>
          <StatCard 
            title="الإنجاز الكلي" 
            value={`${progress}%`} 
            subtext={`${totalWords} / ${novel.targetWordCount} كلمة`}
            icon={TrendingUp}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard 
            title="عدد الفصول" 
            value={chapters?.length || 0} 
            subtext="مسودة وفصول نهائية"
            icon={BookOpen}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard 
            title="الشخصيات" 
            value={characters?.length || 0} 
            subtext="أبطال وشخصيات ثانوية"
            icon={Users}
            color="text-amber-600"
            bg="bg-amber-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in" style={{ animationDelay: "200ms" }}>
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">ملخص الرواية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-loose">
                  {novel.summary || "لا يوجد ملخص مضاف. يمكنك إضافة ملخص من صفحة الإعدادات."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-serif text-xl">أحدث الفصول</CardTitle>
                <Link href={`/novels/${novelId}/planner`} className="text-sm text-primary hover:underline flex items-center gap-1">
                  عرض الكل <ArrowLeft className="w-4 h-4" />
                </Link>
              </CardHeader>
              <CardContent>
                {chapters && chapters.length > 0 ? (
                  <div className="space-y-3">
                    {chapters.slice(0, 3).map((chapter) => (
                      <div key={chapter.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-transparent hover:border-border">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-background rounded-full text-xs font-bold border">
                            {chapter.orderIndex + 1}
                          </span>
                          <span className="font-medium">{chapter.title}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-background rounded border text-muted-foreground">
                          {chapter.status === 'draft' ? 'مسودة' : 'نهائي'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    لا توجد فصول بعد
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-primary/5 border-primary/10 h-full">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-primary">نصائح للكتابة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-primary/10">
                  <h4 className="font-bold text-sm mb-1 text-primary">ركز على الصراع</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    كل مشهد يجب أن يحتوي على صراع، سواء كان داخلياً أو خارجياً، لدفع القصة للأمام.
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/10">
                  <h4 className="font-bold text-sm mb-1 text-primary">أظهر ولا تخبر</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    بدلاً من القول أن الشخصية غاضبة، صف كيف تشد قبضتها أو يحمر وجهها.
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/10">
                  <h4 className="font-bold text-sm mb-1 text-primary">اكتب بانتظام</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    حتى لو كانت 100 كلمة يومياً، الاستمرارية هي مفتاح الانتهاء من الرواية.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, subtext, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-2xl font-bold font-sans mt-1">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 border-l bg-card p-6 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
      <main className="flex-1 p-8 space-y-8">
        <div className="flex justify-between">
          <div className="space-y-3 w-1/2">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </main>
    </div>
  );
}
