import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const imageTable = sqliteTable("image_table", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull().unique(),
  pattern: text("pattern").notNull(),
  festiveMode: integer("festive_mode", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
