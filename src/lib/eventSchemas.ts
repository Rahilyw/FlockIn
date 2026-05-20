import { z } from "zod";

export const EVENT_CATEGORIES = [
  "Music",
  "Art",
  "Workshop",
  "Social",
  "Sport",
  "Academic",
  "Career",
  "Food",
  "Other",
] as const;

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date and time are required"),
  location: z.string().min(2, "Location is required"),
  category: z.enum(EVENT_CATEGORIES, { required_error: "Select a category" }),
  organizerName: z.string().min(1, "Organizer name is required"),
  posterUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  tags: z.string().optional(),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
