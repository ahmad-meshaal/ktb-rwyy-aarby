import { useState } from "react";
import { useParams } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useNovel } from "@/hooks/use-novels";
import { useCharacters, useCreateCharacter, useDeleteCharacter } from "@/hooks/use-characters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Trash2, User } from "lucide-react";
import type { InsertCharacter } from "@shared/schema";

export default function Characters() {
  const { id } = useParams();
  const novelId = Number(id);
  const { data: novel } = useNovel(novelId);
  const { data: characters } = useCharacters(novelId);
  const createCharacter = useCreateCharacter();
  const deleteCharacter = useDeleteCharacter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertCharacter>>({
    role: "Protagonist",
    traits: [] as any
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    createCharacter.mutate({
      novelId,
      name: formData.name,
      role: formData.role || "Supporting",
      description: formData.description,
      traits: formData.traits
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ role: "Protagonist", traits: [] as any });
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar novelId={novelId} novel={novel} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">شخصيات الرواية</h1>
            <p className="text-muted-foreground text-sm">ابنِ عالماً حياً بشخصيات عميقة ومتعددة الأبعاد</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <UserPlus className="w-5 h-5 ml-2" />
                شخصية جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة شخصية جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم</label>
                  <Input 
                    required
                    value={formData.name || ""} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم الشخصية"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الدور</label>
                  <Select 
                    value={formData.role} 
                    onValueChange={v => setFormData({...formData, role: v})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="Protagonist">بطل الرواية</SelectItem>
                      <SelectItem value="Antagonist">الخصم/العدو</SelectItem>
                      <SelectItem value="Supporting">شخصية مساندة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الوصف</label>
                  <Textarea 
                    value={formData.description || ""} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="صف مظهر الشخصية، دوافعها، وتاريخها..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createCharacter.isPending}>
                  حفظ الشخصية
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {!characters || characters.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
            <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد شخصيات حتى الآن.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in">
            {characters.map((char) => (
              <Card key={char.id} className="relative group hover:shadow-md transition-all border-primary/10">
                <CardContent className="p-6">
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" size="icon" 
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      onClick={() => deleteCharacter.mutate({ id: char.id, novelId })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary mx-auto">
                    <User className="w-8 h-8" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold font-serif mb-1">{char.name}</h3>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {char.role === 'Protagonist' ? 'بطل الرواية' : char.role === 'Antagonist' ? 'الخصم' : 'مساند'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center line-clamp-3 leading-relaxed">
                    {char.description || "لا يوجد وصف..."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
