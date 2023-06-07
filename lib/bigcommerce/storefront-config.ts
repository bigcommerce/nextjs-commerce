import { BIGCOMMERCE_API_URL } from './constants';

interface StorefrontTokenResponse {
  data: {
    token: string;
  };
  meta: unknown;
}

interface StorefrontCheckoutResponse {
  data?: {
    cart_url: string;
    checkout_url: string;
    embedded_checkout_url: string;
  };
  status: number;
}

type CheckoutCache = {
  activeCartId: string | null;
  data: StorefrontCheckoutResponse | null;
}

const createCartRedirectUrl = () => {
  const localCache: CheckoutCache= {
    activeCartId: null,
    data: null,
  }

  return async (cartId: string): Promise<StorefrontCheckoutResponse> => {
    if (localCache.activeCartId !== cartId || !localCache.data) {
      const response = await fetch(`${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/carts/${cartId}/redirect_urls`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-auth-token': process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        },
      });
      const data = (await response.json()) as StorefrontCheckoutResponse;

      localCache.activeCartId = cartId;
      localCache.data = data;

      return data;
    }

    return localCache.data;
  };
}

export const memoizedCartRedirectUrl = createCartRedirectUrl();

export const fetchStorefrontToken = async () => {
  const response = await fetch(
    `${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/storefront/api-token-customer-impersonation`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-auth-token': process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        'x-bc-customer-id': ''
      },
      body: JSON.stringify({
        channel_id: parseInt(process.env.BIGCOMMERCE_CHANNEL_ID!),
        expires_at: Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60 // 1 day
      })
    }
  );

  return (await response.json()) as StorefrontTokenResponse;
};
