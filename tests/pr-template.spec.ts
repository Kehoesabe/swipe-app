import { existsSync } from "fs";

describe("PR template presence", () => {
  it("has a PR template in .github/", () => {
    expect(
      existsSync(".github/PULL_REQUEST_TEMPLATE.md")
    ).toBe(true);
  });
});

