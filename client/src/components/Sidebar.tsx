import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BookOpen, Users, MapPin, Settings as SettingsIcon, 
  ChevronLeft, LayoutDashboard, FileText 
} from "lucide-react";
import type { Novel } from "@shared/schema";

interface SidebarProps {
  novelId: number;
  novel?: Novel;
}

export function Sidebar({ novelId, novel }: SidebarProps) {
  const [location] = useLocation();

  const links = [
    { href: `/novels/${novelId}`, label: "نظرة عامة", icon: LayoutDashboard },
    { href: `/novels/${novelId}/planner`, label: "التخطيط والفصول", icon: FileText },
    { href: `/novels/${novelId}/characters`, label: "الشخصيات", icon: Users },
    { href: `/novels/${novelId}/settings`, label: "الأماكن", icon: MapPin },
    { href: `/novels/${novelId}/export`, label: "تصدير", icon: BookOpen },
  ];

  return (
    <div className="w-64 border-l bg-card flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
        <h2 className="font-serif font-bold text-xl line-clamp-2 text-primary">
          {novel?.title || "جاري التحميل..."}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{novel?.genre}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <p className="text-xs text-amber-800 font-medium mb-1">الكلمات المستهدفة</p>
          <div className="w-full bg-amber-200 rounded-full h-1.5 mb-2">
            <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-[10px] text-amber-600 flex justify-between">
            <span>0 كلمة</span>
            <span>{novel?.targetWordCount || 50000}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
