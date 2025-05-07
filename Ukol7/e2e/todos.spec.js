import { test, expect } from "@playwright/test"

test("index page has title", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByText("MY TODO APP")).toBeDefined()
})

test("form on index page creates new todos", async ({
  page,
}) => {
  await page.goto("/")

  await page.getByLabel("Název todo").fill("E2E todo")
  await page.getByText("Přidat todo").click()

  await expect(page.getByText("E2E todo")).toBeDefined()
})

test("should add a new todo item", async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByLabel('Název todo').fill('test Ukol')
  await page.getByText("Přidat todo").click();
  await expect(page.getByText("Název todo")).toBeVisible();
  await expect(page.getByText("Přidat todo")).toBeVisible();
  await expect(page.locator('li', { hasText: 'test Ukol' })).toBeVisible();
});

test("should toggle a todo", async ({ page }) => {
  const todoTitle = "Toggle Test"

  await page.goto("http://localhost:3000")

  await page.waitForSelector('input[name="title"]')
  await page.fill('input[name="title"]', todoTitle)
  await page.click('button[type="submit"]')


  const todoItem = page.locator("li", { hasText: todoTitle })
  await expect(todoItem).toBeVisible()

  const toggleLink = todoItem.getByRole("link", { name: "nedokončeno" })
  await toggleLink.click()

  const updatedToggleLink = todoItem.getByRole("link", { name: "dokončeno" })
  await expect(updatedToggleLink).toBeVisible()
})


test("should update a todo title and priority", async ({ page }) => {
  const todoTitle = "Edit Test"
  const updatedTitle = "Upravený titulek"
  const updatedPriority = "high"

  await page.goto("http://localhost:3000")

  await page.waitForSelector('input[name="title"]')
  await page.fill('input[name="title"]', todoTitle)
  await page.click('button[type="submit"]')

  const todoLink = page.getByRole("link", { name: todoTitle })
  await todoLink.click()

  await expect(page.locator("h2")).toHaveText("Upravit todočko")

  await page.fill('input[name="title"]', updatedTitle)
  await page.selectOption('select[name="priority"]', updatedPriority)
  await page.click('button[type="submit"]')

  await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle)
  await expect(page.locator('select[name="priority"]')).toHaveValue(updatedPriority)
})

test("should delete a completed todo", async ({ page }) => {
  const todoTitle = "Delete Test"

  await page.goto("http://localhost:3000")
  await page.waitForSelector('input[name="title"]')
  await page.fill('input[name="title"]', todoTitle)
  await page.click('button[type="submit"]')

  const todoLink = page.getByRole("link", { name: todoTitle })
  await todoLink.click()

  await page.click('a[href$="/toggle"]')

  await page.click('a[href$="/remove"]')
  await page.waitForURL("http://localhost:3000")
  await expect(page.locator("ul")).not.toContainText(todoTitle)
})