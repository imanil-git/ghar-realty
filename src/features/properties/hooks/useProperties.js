import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "../api/properties";

export const useProperties = (filters) =>
  useQuery({
    queryKey: ["properties", "list", filters],
    queryFn: () => propertyApi.list(filters),
  });
export const useProperty = (id) =>
  useQuery({
    queryKey: ["properties", "detail", id],
    queryFn: () => propertyApi.detail(id),
    enabled: !!id,
    retry: false,
  });
export const useFeaturedProperties = () =>
  useQuery({
    queryKey: ["properties", "featured"],
    queryFn: propertyApi.featured,
  });
export const useRecentProperties = () =>
  useQuery({ queryKey: ["properties", "recent"], queryFn: propertyApi.recent });
export const useCategories = () =>
  useQuery({
    queryKey: ["properties", "categories"],
    queryFn: propertyApi.categories,
  });
export const useMyProperties = (userId) =>
  useQuery({
    queryKey: ["properties", "mine", userId],
    queryFn: propertyApi.mine,
    enabled: !!userId,
  });
