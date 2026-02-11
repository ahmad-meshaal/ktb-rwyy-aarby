import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertChapter } from "@shared/schema";

export function useChapters(novelId: number) {
  return useQuery({
    queryKey: [api.chapters.list.path, novelId],
    queryFn: async () => {
      const url = buildUrl(api.chapters.list.path, { novelId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("فشل في تحميل الفصول");
      return api.chapters.list.responses[200].parse(await res.json());
    },
    enabled: !!novelId,
  });
}

export function useChapter(id: number) {
  return useQuery({
    queryKey: [api.chapters.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.chapters.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("فشل في تحميل الفصل");
      return api.chapters.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertChapter) => {
      const res = await fetch(api.chapters.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في إنشاء الفصل");
      return api.chapters.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.chapters.list.path, data.novelId] });
      toast({ title: "تم بنجاح", description: "تم إضافة فصل جديد" });
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertChapter>) => {
      const url = buildUrl(api.chapters.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في حفظ الفصل");
      return api.chapters.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.chapters.list.path, data.novelId] });
      queryClient.invalidateQueries({ queryKey: [api.chapters.get.path, data.id] });
      // Removed generic toast to avoid spamming during auto-save
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, novelId }: { id: number; novelId: number }) => {
      const url = buildUrl(api.chapters.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل في حذف الفصل");
      return { id, novelId };
    },
    onSuccess: ({ novelId }) => {
      queryClient.invalidateQueries({ queryKey: [api.chapters.list.path, novelId] });
      toast({ title: "تم الحذف", description: "تم حذف الفصل" });
    },
  });
}

export function useReorderChapters() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ novelId, orders }: { novelId: number; orders: { id: number; orderIndex: number }[] }) => {
      const url = buildUrl(api.chapters.reorder.path, { novelId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
      if (!res.ok) throw new Error("فشل في إعادة الترتيب");
      return { novelId };
    },
    onSuccess: ({ novelId }) => {
      queryClient.invalidateQueries({ queryKey: [api.chapters.list.path, novelId] });
    },
  });
}
