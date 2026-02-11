import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertSetting } from "@shared/schema";

export function useSettings(novelId: number) {
  return useQuery({
    queryKey: [api.settings.list.path, novelId],
    queryFn: async () => {
      const url = buildUrl(api.settings.list.path, { novelId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("فشل في تحميل الإعدادات");
      return api.settings.list.responses[200].parse(await res.json());
    },
    enabled: !!novelId,
  });
}

export function useCreateSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSetting) => {
      const res = await fetch(api.settings.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في إنشاء المكان");
      return api.settings.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path, data.novelId] });
      toast({ title: "تم بنجاح", description: "تم إضافة مكان/إعداد جديد" });
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertSetting>) => {
      const url = buildUrl(api.settings.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في تحديث المكان");
      return api.settings.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path, data.novelId] });
      toast({ title: "تم الحفظ", description: "تم تحديث بيانات المكان" });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, novelId }: { id: number; novelId: number }) => {
      const url = buildUrl(api.settings.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل في حذف المكان");
      return { novelId };
    },
    onSuccess: ({ novelId }) => {
      queryClient.invalidateQueries({ queryKey: [api.settings.list.path, novelId] });
      toast({ title: "تم الحذف", description: "تم حذف المكان" });
    },
  });
}
