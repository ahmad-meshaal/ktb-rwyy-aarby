import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GeneratePlotRequest, type GeneratePlotResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertNovel, Novel } from "@shared/schema";

export function useNovels() {
  return useQuery({
    queryKey: [api.novels.list.path],
    queryFn: async () => {
      const res = await fetch(api.novels.list.path);
      if (!res.ok) throw new Error("فشل في تحميل الروايات");
      return api.novels.list.responses[200].parse(await res.json());
    },
  });
}

export function useNovel(id: number) {
  return useQuery({
    queryKey: [api.novels.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.novels.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("فشل في تحميل الرواية");
      return api.novels.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateNovel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNovel) => {
      const res = await fetch(api.novels.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في إنشاء الرواية");
      return api.novels.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.novels.list.path] });
      toast({ title: "تم بنجاح", description: "تم إنشاء الرواية الجديدة" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "تعذر إنشاء الرواية", variant: "destructive" });
    },
  });
}

export function useUpdateNovel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertNovel>) => {
      const url = buildUrl(api.novels.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في تحديث الرواية");
      return api.novels.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.novels.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.novels.get.path, data.id] });
      toast({ title: "تم الحفظ", description: "تم تحديث بيانات الرواية" });
    },
  });
}

export function useDeleteNovel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.novels.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل في حذف الرواية");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.novels.list.path] });
      toast({ title: "تم الحذف", description: "تم حذف الرواية بنجاح" });
    },
  });
}

export function useGeneratePlot() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: GeneratePlotRequest) => {
      const res = await fetch(api.novels.generatePlot.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في توليد الحبكة");
      return await res.json() as GeneratePlotResponse;
    },
    onError: () => {
      toast({ title: "خطأ", description: "تعذر توليد الحبكة بالذكاء الاصطناعي", variant: "destructive" });
    },
  });
}
