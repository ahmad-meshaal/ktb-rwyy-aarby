import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNovelSchema, type InsertNovel } from "@shared/schema";
import { useCreateNovel } from "@/hooks/use-novels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, ChevronLeft, Loader2 } from "lucide-react";

const GENRES = [
  "رواية تاريخية", "خيال علمي", "فانتازيا", "دراما", 
  "جريمة وغموض", "رعب", "رومانسي", "اجتماعي"
];

export default function Wizard() {
  const [, setLocation] = useLocation();
  const createNovel = useCreateNovel();
  const [step, setStep] = useState(1); // For future expansion into multi-step

  const form = useForm<InsertNovel>({
    resolver: zodResolver(insertNovelSchema),
    defaultValues: {
      title: "",
      genre: "",
      summary: "",
      targetWordCount: 50000,
      status: "planning",
    },
  });

  const onSubmit = (data: InsertNovel) => {
    createNovel.mutate(data, {
      onSuccess: (novel) => {
        setLocation(`/novels/${novel.id}`);
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-in">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <Wand2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">إعداد الرواية الجديدة</h1>
          <p className="text-muted-foreground">لنبدأ بوضع حجر الأساس لعملك الأدبي القادم</p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">عنوان الرواية</Label>
                <Input 
                  id="title" 
                  placeholder="مثال: رحلة إلى المجهول" 
                  {...form.register("title")}
                  className="h-12 text-lg"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-base font-semibold">التصنيف الأدبي</Label>
                  <Select onValueChange={(val) => form.setValue("genre", val)}>
                    <SelectTrigger id="genre" className="h-12">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.genre && (
                    <p className="text-sm text-destructive">{form.formState.errors.genre.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wordCount" className="text-base font-semibold">عدد الكلمات المستهدف</Label>
                  <Input 
                    id="wordCount" 
                    type="number" 
                    {...form.register("targetWordCount", { valueAsNumber: true })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary" className="text-base font-semibold">ملخص مبدئي (اختياري)</Label>
                <Textarea 
                  id="summary" 
                  placeholder="اكتب فكرة عامة عن الرواية..." 
                  {...form.register("summary")}
                  className="min-h-[120px] resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex-1 text-lg"
                  disabled={createNovel.isPending}
                >
                  {createNovel.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "بدء الكتابة"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setLocation("/")}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
