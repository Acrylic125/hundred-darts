export type Tag = {
  id: string;
  name: string;
  color: number;
  active?: boolean;
};
export type PartialTag = Partial<Tag> & Pick<Tag, "id">;
export type EditablePartialTag = Omit<PartialTag, "active">;
