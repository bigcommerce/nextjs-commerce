import { isVercelCommerceError } from "lib/type-guards";
import { BIGCOMMERCE_GRAPHQL_API_ENDPOINT } from "./constants";
import { fetchStorefrontToken } from "./storefront-config";

// NOTE: updated env variables on BC
const domain = `https://store-${process.env.BIGCOMMERCE_STORE_HASH!}${process.env.BIGCOMMERCE_CHANNEL_ID!}`;
const endpoint = `${domain}.${BIGCOMMERCE_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function bigcommerceFetch<T>({
    query,
    variables,
    headers,
    cache = 'force-cache'
  }: {
    query: string;
    variables?: ExtractVariables<T>;
    headers?: HeadersInit;
    cache?: RequestCache;
  }): Promise<{ status: number; body: T } | never> {
    try {
      const {
        data: { token },
      } = await fetchStorefrontToken();
  
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          ...(query && { query }),
          ...(variables && { variables })
        }),
        cache,
        next: { revalidate: 900 } // 15 minutes
      });
  
      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }
  
      return {
        status: result.status,
        body
      };
    } catch (e) {
      if (isVercelCommerceError(e)) {
        throw {
          status: e.status || 500,
          message: e.message,
          query
        };
      }
  
      throw {
        error: e,
        query
      };
    }
  }
