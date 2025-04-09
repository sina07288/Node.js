// src/schema.js
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const todosTable = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  priority: text("priority", {
    enum: ["low", "normal", "high"],
  }).notNull().default("normal"),
})