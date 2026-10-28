import memes from "./memes.json";
describe("local meme data", () => {
  test("records contain required fields", () => {
    expect(memes.length).toBeGreaterThan(0);
    memes.forEach(m => expect(m).toEqual(expect.objectContaining({
      id: expect.any(String), title: expect.any(String), category: expect.any(String),
      source: expect.any(String), image: expect.any(String), description: expect.any(String)
    })));
  });
  test("IDs are unique", () => expect(new Set(memes.map(m => m.id)).size).toBe(memes.length));
});
