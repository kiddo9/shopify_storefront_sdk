export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string | null;
}

export interface Edge<TNode> {
  node: TNode;
}

export interface Connection<TNode> {
  edges: Edge<TNode>[];
  pageInfo: PageInfo;
}

/**
 * Automatically fetches all pages of a Shopify GraphQL Connection and flattens the nodes into an array.
 * 
 * @param fetchPage A function that takes an optional cursor and returns a promise of the API response.
 * @param getConnection A selector function that extracts the Connection object from the API response.
 * @returns A flat array of all nodes across all pages.
 */
export async function autoPaginate<TResponse, TNode>(
  fetchPage: (cursor?: string) => Promise<TResponse>,
  getConnection: (response: TResponse) => Connection<TNode> | undefined | null
): Promise<TNode[]> {
  const results: TNode[] = [];
  let hasNextPage = true;
  let cursor: string | undefined = undefined;

  while (hasNextPage) {
    const response = await fetchPage(cursor);
    const connection = getConnection(response);

    if (!connection || !connection.edges || !connection.pageInfo) {
      break;
    }

    for (const edge of connection.edges) {
      if (edge && edge.node) {
        results.push(edge.node);
      }
    }

    hasNextPage = connection.pageInfo.hasNextPage;
    cursor = connection.pageInfo.endCursor || undefined;
  }

  return results;
}
