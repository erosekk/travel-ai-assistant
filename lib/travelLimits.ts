import { TravelFormData } from "@/types";

export const MAX_DESTINATIONS = 4;

export const parseDestinations = (value: string) =>
  value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const getDestinations = (data: TravelFormData) =>
  data.destinations?.length ? data.destinations : parseDestinations(data.destination);
