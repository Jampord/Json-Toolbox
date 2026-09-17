import { describe, expect, it } from "vitest";
import { formatJson, minifyJson, parseJson, validateJson } from "./json";

describe("parseJson", () => {
  it("returns success: true and the parsed value for valid JSON", () => {
    const input = '{"name":"John","age":25}';

    const result = parseJson(input);

    expect(result.success).toBe(true);
    expect(result).toEqual({
      success: true,
      value: {
        name: "John",
        age: 25,
      },
    });
  });

  it("returns success: false with a meaningful error message for invalid JSON", () => {
    const input = '{"name":"John",}';

    const result = parseJson(input);

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    });

    if (!result.success) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});

describe("formatJson", () => {
  it("formats a compact JSON string with 2-space indentation", () => {
    const input = '{"name":"John","age":25}';

    const result = formatJson(input);

    expect(result).toBe(`{\n  "name": "John",\n  "age": 25\n}`);
  });
});

describe("minifyJson", () => {
  it("collapses formatted JSON into a single compact line", () => {
    const input = `{
  "name": "John",
  "age": 25
}`;

    const result = minifyJson(input);

    expect(result).toBe('{"name":"John","age":25}');
  });
});

describe("validateJson", () => {
  it("returns true for valid JSON", () => {
    const input = '{"name":"John","age":25}';

    const result = validateJson(input);

    expect(result).toBe(true);
  });

  it("returns false for invalid JSON", () => {
    const input = '{"name":"John",}';

    const result = validateJson(input);

    expect(result).toBe(false);
  });
});
