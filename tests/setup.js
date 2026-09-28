import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { webcrypto } from "node:crypto";

vi.stubGlobal("crypto", webcrypto);
afterEach(() => {
  cleanup();
});
