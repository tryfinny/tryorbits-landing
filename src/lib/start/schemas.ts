import { z } from "zod";

export const FieldTypeEnum = z.enum(["text", "number", "date", "select", "location"]);

export const QuestionFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: FieldTypeEnum,
  placeholder: z.string().nullable(),
  options: z.array(z.string()).nullable(),
  // Pre-filled value inferred from the user's prompt (null if not stated).
  value: z.string().nullable(),
});

export const QuestionsSchema = z.object({
  title: z.string(),
  fields: z.array(QuestionFieldSchema),
});

export const GuestListCardSchema = z.object({
  type: z.literal("guest_list"),
  title: z.string(),
  guests: z.array(z.object({ name: z.string() })),
});

export const LocationCardSchema = z.object({
  type: z.literal("location"),
  title: z.string(),
  placeName: z.string(),
});

export const ShoppingListCardSchema = z.object({
  type: z.literal("shopping_list"),
  title: z.string(),
  items: z.array(z.object({ name: z.string(), qty: z.string().nullable() })),
});

export const ScheduleCardSchema = z.object({
  type: z.literal("schedule"),
  title: z.string(),
  events: z.array(z.object({ time: z.string(), label: z.string() })),
});

export const CardSchema = z.discriminatedUnion("type", [
  GuestListCardSchema,
  LocationCardSchema,
  ShoppingListCardSchema,
  ScheduleCardSchema,
]);

export const CardsSchema = z.object({
  cards: z.array(CardSchema),
});

export type QuestionField = z.infer<typeof QuestionFieldSchema>;
export type Questions = z.infer<typeof QuestionsSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Cards = z.infer<typeof CardsSchema>;
export type ActionType = "text_guest" | "call_reserve" | "order_instacart";
