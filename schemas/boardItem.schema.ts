import { z } from 'zod';

// Enum for ItemType to be used in schemas
const ItemTypeEnum = z.enum([
  'NOTE',
  'TODO',
  'IMAGE',
  'LINK',
  'BOARD',
  'CONTAINER',
  'KANBAN',
  'SWATCH',
]);

// Base schema for all board items
const BaseItemSchema = z.object({
  id: z.string().uuid(),
  type: ItemTypeEnum,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  width: z.number().optional(),
  height: z.number().optional(),
  content: z.string().optional(),
  color: z.string().optional(),
  style: z
    .object({
      fontSize: z.enum(['sm', 'md', 'lg', 'xl']),
      fontWeight: z.enum(['normal', 'bold']),
      textAlign: z.enum(['left', 'center']),
    })
    .optional(),
  loading: z.boolean().optional(),
});

// Specific schemas for each item type
const NoteSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.NOTE),
});

const TodoSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.TODO),
  todos: z
    .array(
      z.object({
        id: z.string().uuid(),
        text: z.string(),
        done: z.boolean(),
      })
    )
    .optional(),
});

const ImageSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.IMAGE),
  content: z.string().url(), // Should be a data URL or a web URL
});

const LinkSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.LINK),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  siteName: z.string().optional(),
});

const BoardSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.BOARD),
  linkedBoardId: z.string().uuid().optional(),
});

const ContainerSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.CONTAINER),
  collapsed: z.boolean().optional(),
});

const KanbanSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.KANBAN),
});

const SwatchSchema = BaseItemSchema.extend({
  type: z.literal(ItemTypeEnum.enum.SWATCH),
  swatchColor: z.string().optional(),
});

// Union of all item schemas
export const BoardItemSchema = z.discriminatedUnion('type', [
  NoteSchema,
  TodoSchema,
  ImageSchema,
  LinkSchema,
  BoardSchema,
  ContainerSchema,
  KanbanSchema,
  SwatchSchema,
]);

export type BoardItemInput = z.infer<typeof BoardItemSchema>;
