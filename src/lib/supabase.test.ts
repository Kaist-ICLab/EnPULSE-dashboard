import { beforeEach, describe, expect, it, vi } from "vitest";

const load = (url: string, key: string) => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY", key);
  return import("./supabase");
};

describe("supabase client", () => {
  const fetchMock = vi.fn(async () => new Response("[]", { headers: { "content-type": "application/json" } }));

  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("makes no network request when it is not configured", async () => {
    const { supabase } = await load("", "");
    const { error } = await supabase.from("campaigns").select("id");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(error?.message).toContain("Supabase is not configured");
    expect(error?.message).toContain("NEXT_PUBLIC_SUPABASE_URL");
  });

  it("sends requests to the configured URL", async () => {
    const { supabase } = await load("http://localhost:8000", "real-key");
    const { error } = await supabase.from("campaigns").select("id");

    expect(error).toBeNull();
    expect(String((fetchMock.mock.calls[0] as unknown[])[0])).toContain("http://localhost:8000/rest/v1/campaigns");
  });
});
