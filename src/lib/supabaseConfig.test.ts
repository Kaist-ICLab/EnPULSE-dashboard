import { beforeEach, describe, expect, it, vi } from "vitest";

const load = (url: string, key: string) => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY", key);
  return import("./supabaseConfig");
};

const URL_VAR = "NEXT_PUBLIC_SUPABASE_URL";
const KEY_VAR = "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY";

describe("supabaseConfig", () => {
  beforeEach(() => vi.resetModules());

  it("accepts a real URL and key", async () => {
    const config = await load("http://localhost:8000", "real-key");
    expect(config.missingSupabaseConfig).toEqual([]);
    expect(config.supabaseUrl).toBe("http://localhost:8000");
    expect(config.supabaseServiceKey).toBe("real-key");
  });

  it("reports both settings when they are empty", async () => {
    const config = await load("", "");
    expect(config.missingSupabaseConfig).toEqual([URL_VAR, KEY_VAR]);
  });

  it("treats the unedited .example.env values as missing", async () => {
    const config = await load("YOUR_LOCAL_SUPABASE_CONTAINER_URL", "YOUR_SUPABASE_SERVICE_ROLE_KEY");
    expect(config.missingSupabaseConfig).toEqual([URL_VAR, KEY_VAR]);
  });

  it("rejects a URL that is not http or https", async () => {
    const config = await load("ftp://localhost", "real-key");
    expect(config.missingSupabaseConfig).toEqual([URL_VAR]);
  });

  it("always provides a URL the Supabase client accepts", async () => {
    const config = await load("not a url", "");
    expect(() => new URL(config.supabaseUrl)).not.toThrow();
    expect(config.supabaseServiceKey).not.toBe("");
  });
});
