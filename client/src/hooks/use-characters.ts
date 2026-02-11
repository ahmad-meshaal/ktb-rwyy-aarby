import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertCharacter } from "@shared/schema";

export function useCharacters(novelId: number) {
  return useQuery({
    queryKey: [api.characters.list.path, novelId],
    queryFn: async () => {
      const url = buildUrl(api.characters.list.path, { novelId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("فشل في تحميل الشخصيات");
      return api.characters.list.responses[200].parse(await res.json());
    },
    enabled: !!novelId,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCharacter) => {
      const res = await fetch(api.characters.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في إنشاء الشخصية");
      return api.characters.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path, data.novelId] });
      toast({ title: "تم بنجاح", description: "تم إضافة شخصية جديدة" });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertCharacter>) => {
      const url = buildUrl(api.characters.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("فشل في تحديث الشخصية");
      return api.characters.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path, data.novelId] });
      toast({ title: "تم الحفظ", description: "تم تحديث بيانات الشخصية" });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, novelId }: { id: number; novelId: number }) => {
      const url = buildUrl(api.characters.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل في حذف الشخصية");
      return { novelId };
    },
    onSuccess: ({ novelId }) => {
      queryClient.invalidateQueries({ queryKey: [api.characters.list.path, novelId] });
      toast({ title: "تم الحذف", description: "تم حذف الشخصية" });
    },
  });
}
