interface GeneratorContext {
  interfaces: string[];
  generatedNames: Set<string>;
}

function formatPropertyKey(key: string): string {
  const isValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
  return isValidIdentifier ? key : JSON.stringify(key);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function capitalize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function singularize(key: string): string {
  if (key.endsWith("sses")) {
    // addresses -> address, classes -> class
    return key.slice(0, -2);
  }

  if (key.endsWith("ies")) {
    // categories -> category, companies -> company
    return key.slice(0, -3) + "y";
  }

  if (key.endsWith("ss")) {
    // Words ending in "ss" remain unchanged
    return key;
  }

  if (key.endsWith("s")) {
    // users -> user, skills -> skill
    return key.slice(0, -1);
  }

  return key;
}

function formatUnion(types: string[]): string {
  const uniqueTypes = Array.from(new Set(types));
  return uniqueTypes.join(" | ");
}

// Wraps a type string in parens only if it's actually a union
// (contains " | "), since only unions are ambiguous without them
// when placed before `[]`.
function wrapForArray(type: string): string {
  return type.includes(" | ") ? `(${type})` : type;
}

// Build one interface from MULTIPLE objects, merging their keys:
// - a key present in every object is required
// - a key present in only some objects is optional
// - a key whose values differ in type across objects becomes a union
function buildMergedInterface(objects: Record<string, unknown>[], name: string, context: GeneratorContext): string {
  const allKeys = new Set<string>();
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => allKeys.add(key));
  });

  const lines = Array.from(allKeys).map((key) => {
    const valuesForKey = objects.filter((obj) => key in obj).map((obj) => obj[key]);

    const type = formatUnion(valuesForKey.map((v) => inferPropertyType(v, key, context)));
    const isOptional = valuesForKey.length < objects.length;
    const formattedKey = formatPropertyKey(key);

    return `  ${formattedKey}${isOptional ? "?" : ""}: ${type};`;
  });

  return [`interface ${name} {`, ...lines, `}`].join("\n");
}

function inferArrayType(value: unknown[], key: string, context: GeneratorContext): string {
  if (value.length === 0) {
    return "unknown[]";
  }

  const objects = value.filter(isPlainObject);
  const elementKey = singularize(key);

  if (objects.length > 0) {
    // At least one element is an object: merge all object elements into
    // one interface, rather than generating one interface per element.
    const interfaceName = capitalize(elementKey);

    if (!context.generatedNames.has(interfaceName)) {
      context.generatedNames.add(interfaceName);
      const merged = buildMergedInterface(objects, interfaceName, context);
      context.interfaces.push(merged);
    }

    const nonObjects = value.filter((v) => !isPlainObject(v));
    if (nonObjects.length === 0) {
      return `${interfaceName}[]`;
    }

    // inside inferArrayType, the mixed object/non-object branch:
    const otherTypes = nonObjects.map((v) => inferPropertyType(v, elementKey, context));
    return `${wrapForArray(formatUnion([interfaceName, ...otherTypes]))}[]`;
  }

  // inside inferArrayType, the "no objects at all" fallback:
  const elementTypes = value.map((element) => inferPropertyType(element, elementKey, context));
  return `${wrapForArray(formatUnion(elementTypes))}[]`;
}

function inferPropertyType(value: unknown, key: string, context: GeneratorContext): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  if (Array.isArray(value)) {
    return inferArrayType(value, key, context);
  }

  if (isPlainObject(value)) {
    const interfaceName = capitalize(key);

    if (!context.generatedNames.has(interfaceName)) {
      context.generatedNames.add(interfaceName);
      const nestedInterface = buildInterface(value, interfaceName, context);
      context.interfaces.push(nestedInterface);
    }

    return interfaceName;
  }

  // functions, symbols, etc. — not supported yet
  return "unknown";
}

function buildInterface(value: Record<string, unknown>, name: string, context: GeneratorContext): string {
  return buildMergedInterface([value], name, context);
}

export function generateTypeScript(value: unknown, name: string = "Root"): string {
  const context: GeneratorContext = {
    interfaces: [],
    generatedNames: new Set<string>([name]),
  };

  if (isPlainObject(value)) {
    const rootInterface = buildInterface(value, name, context);
    return [rootInterface, ...context.interfaces].join("\n\n");
  }

  if (Array.isArray(value)) {
    const objects = value.filter(isPlainObject);

    if (objects.length !== value.length) {
      throw new Error("generateTypeScript requires every element of a root array to be an object");
    }

    if (objects.length === 0) {
      throw new Error("generateTypeScript currently only supports a root object, or a root array of objects");
    }

    const rootInterface = buildMergedInterface(objects, name, context);
    return [rootInterface, ...context.interfaces].join("\n\n");
  }

  throw new Error("generateTypeScript currently only supports a root object, or a root array of objects");
}
