import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold font-serif text-foreground">عذراً، الصفحة غير موجودة</h1>
          </div>

          <p className="mt-4 text-muted-foreground">
            يبدو أنك حاولت الوصول إلى صفحة غير موجودة أو تم نقلها.
          </p>
          
          <div className="mt-8">
            <Link href="/">
              <Button className="w-full">العودة للرئيسية</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
