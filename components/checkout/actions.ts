"use server";

import { TAGS } from "@/lib/constants";
import * as api from "@/lib/sfcc";
import { FormActionState } from "@/lib/sfcc/constants";
import {
  billingAddressSchema,
  informationFormSchema,
  paymentFormSchema,
  shippingMethodFormSchema,
} from "@/lib/sfcc/schemas";
import { handleFormActionError } from "@/lib/sfcc/utils";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

// Action to add/upate customer email and shipping address.
// Combines two baskets updates in a single action.
export async function updateShippingContact(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState<typeof informationFormSchema>> {
  const { success, error, data } = informationFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!success) {
    return { errors: error.flatten() };
  }

  try {
    // NOTE: Basket updates must happen sequentially.
    await api.updateCustomerInfo(data.email);

    await api.updateShippingAddress({
      firstName: data.firstName,
      lastName: data.lastName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      stateCode: data.state,
      postalCode: data.zip,
      countryCode: data.country,
      phone: data.phone ? data.phone.replace(/\D/g, "") : undefined,
    });

    revalidateTag(TAGS.cart, "max");
  } catch (error) {
    return handleFormActionError(
      error,
      "An error occurred while updating your shipping address"
    );
  }
}

// Action to add/update the shipping method for the shipment
export async function updateShippingMethod(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState<typeof shippingMethodFormSchema>> {
  const { success, error, data } = shippingMethodFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!success) {
    return { errors: error.flatten() };
  }

  try {
    await api.updateShippingMethod(data.shippingMethodId);

    revalidateTag(TAGS.cart, "max");
  } catch (error) {
    return handleFormActionError(
      error,
      "An error occurred while updating your shipping method"
    );
  }
}

// Action to add the payment method
// TODO: Need to handle edit scenario differently
export async function addPaymentMethod(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState<typeof paymentFormSchema>> {
  const paymentData = Object.fromEntries(formData.entries());
  const { success, error, data } = paymentFormSchema.safeParse(paymentData);

  if (!success) {
    return { errors: error.flatten() };
  }

  try {
    await api.addPaymentMethod({
      cardNumber: data.cardNumber,
      cardholderName: data.cardholderName,
      expirationMonth: parseInt(data.expirationMonth),
      expirationYear: parseInt(data.expirationYear),
      securityCode: data.securityCode,
    });

    revalidateTag(TAGS.cart, "max");
  } catch (error) {
    return handleFormActionError(
      error,
      "An error occurred while adding your payment method"
    );
  }
}

// Action to update billing address
export async function updateBillingAddress(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState<typeof billingAddressSchema>> {
  const { success, error, data } = billingAddressSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!success) {
    return { errors: error.flatten() };
  }

  try {
    await api.updateBillingAddress({
      firstName: data["billingAddress.firstName"],
      lastName: data["billingAddress.lastName"],
      address1: data["billingAddress.address1"],
      address2: data["billingAddress.address2"],
      city: data["billingAddress.city"],
      stateCode: data["billingAddress.state"],
      postalCode: data["billingAddress.zip"],
      countryCode: data["billingAddress.country"],
      phone: data["billingAddress.phone"]
        ? data["billingAddress.phone"].replace(/\D/g, "")
        : undefined,
    });

    revalidateTag(TAGS.cart, "max");
  } catch (error) {
    return handleFormActionError(error, "Error updating billing address");
  }
}

// Action to place the order
export async function placeOrder(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  try {
    const order = await api.placeOrder();
    // The basket will no longer exist after placing the order.
    (await cookies()).delete("cartId");

    // Set the order number in a cookie so we can get the order details on the confirmation page.
    (await cookies()).set("orderId", order.orderNumber!);

    revalidateTag(TAGS.cart, "max");
  } catch (error) {
    return handleFormActionError(
      error,
      "An error occurred while placing your order"
    );
  }
}
