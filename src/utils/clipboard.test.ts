import { describe, expect, it, vi, beforeEach } from "vitest";
import { copyToClipboard } from "./clipboard";

describe("copyToClipboard", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("calls navigator.clipboard.writeText with the given text and resolves", async () => {
    await expect(copyToClipboard("hello")).resolves.toBeUndefined();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
  });

  it("rejects when navigator.clipboard.writeText rejects", async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error("Clipboard unavailable"));

    await expect(copyToClipboard("hello")).rejects.toThrow("Clipboard unavailable");
  });
});
