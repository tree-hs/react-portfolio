export type DemoStatus = "done" | "wip" | "planned";
export interface DemoMeta {
  /** URL slug — /lab/:id */
  id: string;
  no: string;
  title: string;
  summary: string;
  status: DemoStatus,
}
export const demos: DemoMeta[] = [
  {
    id: "test-id",
    no: "01",
    title: "test title",
    summary:
      "test summary test summary test summary test summary test summary test summary test summary test summary",
    status: "planned"
  }
];

export const getDemo = (id: string): DemoMeta | undefined =>
  demos.find((d) => d.id === id);