import { describe, expect, it } from "vitest";
import { createLatestValueRef, updateLatestValueRef } from "./WikiGraphController.js";

describe("WikiGraphController", () => {
  it("keeps graph click handlers current without replacing the ref object", () => {
    const firstHandler = () => "first";
    const nextHandler = () => "next";
    const ref = createLatestValueRef(firstHandler);

    const updatedRef = updateLatestValueRef(ref, nextHandler);

    expect(updatedRef).toBe(ref);
    expect(ref.current()).toBe("next");
  });
});
