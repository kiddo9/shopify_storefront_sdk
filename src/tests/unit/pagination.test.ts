import { describe, it, expect } from "vitest";
import { autoPaginate } from "../../utils/pagination.js";

describe("Pagination Utility", () => {
  it("should extract nodes and stop when hasNextPage is false", async () => {
    // Mock a paginated API response
    const mockResponses = [
      {
        data: {
          edges: [{ node: { id: 1 } }, { node: { id: 2 } }],
          pageInfo: { hasNextPage: true, endCursor: "cursor_1" },
        },
      },
      {
        data: {
          edges: [{ node: { id: 3 } }, { node: { id: 4 } }],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    ];

    let requestCount = 0;

    const fetchPage = async (cursor?: string) => {
      if (cursor === "cursor_1") {
        requestCount++;
        return mockResponses[1];
      }
      requestCount++;
      return mockResponses[0];
    };

    const results = await autoPaginate(
      fetchPage,
      (res: any) => res?.data
    );

    expect(requestCount).toBe(2);
    expect(results).toHaveLength(4);
    expect(results).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });

  it("should return early if the connection is null or missing", async () => {
    const fetchPage = async () => ({ data: null });

    const results = await autoPaginate(
      fetchPage,
      (res: any) => res?.data
    );

    expect(results).toHaveLength(0);
  });
});
