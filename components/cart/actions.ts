'use server';

import { addToCart, removeFromCart, updateCart } from 'lib/bigcommerce';
import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(
  prevState: any,
  {
    selectedProductId,
    selectedVariantId
  }: {
    selectedProductId: string | undefined;
    selectedVariantId: string | undefined;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    const { id } = await addToCart(cartId ?? '', [
      { merchandiseId: selectedVariantId, quantity: 1, productId: selectedProductId }
    ]);
    revalidateTag(TAGS.cart);
    cookies().set('cartId', id);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const response = await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);

    if (!response && cartId) {
      cookies().delete('cartId');
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    productSlug: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, productSlug, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      const response = await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);

      if (!response && cartId) {
        cookies().delete('cartId');
      }

      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
        productSlug
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
