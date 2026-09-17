import { describe, expect, it } from "vitest";
import { generateTypeScript } from "./generateTypes";

describe("generateTypeScript", () => {
  it("generates an interface from a basic object", () => {
    const input = {
      name: "John",
      age: 25,
    };

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {
  name: string;
  age: number;
}`);
  });

  it("generates a merged interface from a root array of uniform objects", () => {
    const input = [
      {
        id: 1,
        name: "John",
      },
      {
        id: 2,
        name: "Jane",
      },
    ];

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  id: number;\n  name: string;\n}`);
  });

  it("marks a property optional when it's missing from at least one object in a root array", () => {
    const input = [
      {
        id: 1,
        name: "John",
      },
      {
        id: 2,
      },
    ];

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  id: number;\n  name?: string;\n}`);
  });

  it("generates a separate interface for a nested object", () => {
    const input = {
      name: "John",
      address: {
        city: "San Fernando",
        zip: 2000,
      },
    };

    const result = generateTypeScript(input);

    expect(result).toBe(
      `interface Root {\n  name: string;\n  address: Address;\n}\n\ninterface Address {\n  city: string;\n  zip: number;\n}`,
    );
  });

  it("combines differing types for the same property into a union", () => {
    const input = [
      {
        value: 123,
      },
      {
        value: "hello",
      },
    ];

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  value: number | string;\n}`);
  });

  it("deduplicates repeated types so a union never contains the same type twice", () => {
    const input = [
      {
        value: 123,
      },
      {
        value: 456,
      },
      {
        value: 789,
      },
    ];

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  value: number;\n}`);
  });

  it("quotes property keys that aren't valid TypeScript identifiers", () => {
    const input = {
      "first-name": "John",
      "user id": 123,
    };

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  "first-name": string;\n  "user id": number;\n}`);
  });

  it("marks a nested array's merged property optional when missing from some elements", () => {
    const input = {
      users: [
        {
          id: 1,
          name: "John",
        },
        {
          id: 2,
        },
      ],
    };

    const result = generateTypeScript(input);

    expect(result).toBe(
      `interface Root {\n  users: User[];\n}\n\ninterface User {\n  id: number;\n  name?: string;\n}`,
    );
  });

  it("unions a property's type with null when it's explicitly null in some objects", () => {
    const input = [
      {
        value: 123,
      },
      {
        value: null,
      },
    ];

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  value: number | null;\n}`);
  });

  it("falls back to unknown[] for an empty array", () => {
    const input = {
      users: [],
    };

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  users: unknown[];\n}`);
  });

  it("infers a primitive array type from uniform elements", () => {
    const input = {
      scores: [10, 20, 30],
    };

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  scores: number[];\n}`);
  });

  it("wraps a mixed-primitive array type in parentheses", () => {
    const input = {
      values: [1, "hello", true],
    };

    const result = generateTypeScript(input);

    expect(result).toBe(`interface Root {\n  values: (number | string | boolean)[];\n}`);
  });

  it("generates a nested array-of-objects interface alongside a sibling primitive property", () => {
    const input = {
      users: [
        {
          id: 1,
          name: "John",
          active: true,
        },
        {
          id: 2,
          name: "Jane",
          active: false,
        },
      ],
      total: 2,
    };

    const result = generateTypeScript(input);

    expect(result).toBe(
      `interface Root {\n  users: User[];\n  total: number;\n}\n\ninterface User {\n  id: number;\n  name: string;\n  active: boolean;\n}`,
    );
  });

  it("singularizes common plural array property names", () => {
    const input = {
      addresses: [
        {
          city: "San Fernando",
        },
      ],
    };

    const result = generateTypeScript(input);

    expect(result).toBe(
      `interface Root {
  addresses: Address[];
}

interface Address {
  city: string;
}`,
    );
  });

  it("throws when a root array mixes objects with primitive values", () => {
    const input = [
      {
        id: 1,
      },
      "hello",
    ];

    expect(() => generateTypeScript(input)).toThrow();
  });

  it("throws for an empty root array", () => {
    expect(() => generateTypeScript([])).toThrow();
  });

  it("throws for a primitive root value", () => {
    expect(() => generateTypeScript("hello")).toThrow();
  });

  it("leaves a key already ending in 'ss' unchanged when singularizing", () => {
    const input = { class: [{ id: 1 }] };
    const result = generateTypeScript(input);
    expect(result).toBe(`interface Root {\n  class: Class[];\n}\n\ninterface Class {\n  id: number;\n}`);
  });
});
