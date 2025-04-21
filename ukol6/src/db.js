import { eq } from "drizzle-orm";
import { db } from "./app.js";
import { todosTable } from "./schema.js";

export async function getTodoById(id) {
  const result = await db.select().from(todosTable).where(eq(todosTable.id, id));
  return result[0];
}

export async function getAllTodos() {
  return await db.select().from(todosTable);
}


export async function countTodos() {
  const todos = await getAllTodos();
  return todos.length;
}

export async function updateTodo(id, updatedFields) {
  await db
    .update(todosTable)
    .set(updatedFields)
    .where(eq(todosTable.id, id));
}

export async function deleteTodo(id) {
  await db.delete(todosTable).where(eq(todosTable.id, id));
}
