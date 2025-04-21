import test from "ava";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "../src/app.js";
import { todosTable } from "../src/schema.js"; // ← TADY!
import {
  getAllTodos,
  updateTodo,
  deleteTodo,
  getTodoById
} from "../src/db.js";

test.before("run migrations", async () => {
  await migrate(db, { migrationsFolder: "drizzle" })
})

test.beforeEach(async () => {
  db.run('DELETE FROM todosTable');
  db.run('UPDATE sqlite_sequence SET seq = 0 WHERE name = "todosTable";');
});


test("getTodoById returns correct todo", async (t) => {
  const [{ id }] = await db.insert(todosTable).values({ title: "Test 1", done: false }).returning();
  const todo = await getTodoById(id);
  t.is(todo.title, "Test 1");
})

test("getAllTodos returns all todos", async (t) => {
  const before = await getAllTodos();
  console.log("Before insert:", before.length);
  t.is(before.length, 1);
  await db.insert(todosTable).values([
    { title: "Test", done: true },
    { title: "Test", done: true },
    { title: "Test", done: false },
    { title: "Test", done: true },
  ]);
  const after = await getAllTodos();
  console.log("After insert:", after.length);
  t.is(after.length, before.length + 5);
});

test("updateTodo modifies the todo", async (t) => {
  const [{ id }] = await db.insert(todosTable).values({ title: "Old Title", done: false }).returning();
  await updateTodo(id, { title: "New Title", done: true });
  const updated = await getTodoById(id);
  t.is(updated.title, "New Title");
  t.true(updated.done);
});

test("deleteTodo removes the todo", async (t) => {
  const [{ id }] = await db.insert(todosTable).values({ title: "To delete", done: false }).returning();
  await deleteTodo(id);
  const deleted = await getTodoById(id);
  t.falsy(deleted);
});
