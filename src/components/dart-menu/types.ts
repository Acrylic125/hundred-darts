export type Tag = {
  id: string;
  name: string;
  color: string;
  active?: boolean;
};
export type PartialTag = Partial<Tag> & Pick<Tag, "id">;
