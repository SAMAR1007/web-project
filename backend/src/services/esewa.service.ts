import crypto from 'crypto';
import { ApiError } from '../exceptions/api.error';

// eSewa v2 API configuration
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_STATUS_URL = process.env.ESEWA_STATUS_URL || 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';

interface EsewaPaymentParams {
  orderId: string;
  amount: number;
  taxAmount?: number;
  serviceCharge?: number;
  deliveryCharge?: number;
  successUrl: string;
  failureUrl: string;
}

/**
 * Generate HMAC-SHA256 signature for eSewa v2 API
 */
function generateSignature(message: string): string {
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
  hmac.update(message);
  return hmac.digest('base64');
}

/**
 * Build eSewa v2 payment form data (to be submitted via HTML form POST)
 */
export function buildEsewaPaymentData(params: EsewaPaymentParams) {
  const {
    orderId,
    amount,
    taxAmount = 0,
    serviceCharge = 0,
    deliveryCharge = 0,
    successUrl,
    failureUrl,
  } = params;

  const totalAmount = amount + taxAmount + serviceCharge + deliveryCharge;
  const transactionUuid = `${orderId}-${Date.now()}`;

  const signedFieldNames = 'total_amount,transaction_uuid,product_code';
  const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
  const signature = generateSignature(signatureMessage);

  return {
    formUrl: ESEWA_PAYMENT_URL,
    formData: {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: signedFieldNames,
      signature: signature,
    },
  };
}

/**
 * Verify eSewa payment by decoding the base64-encoded response data
 */
export function verifyEsewaPaymentData(encodedData: string): {
  valid: boolean;
  transactionCode?: string;
  status?: string;
  totalAmount?: string;
  transactionUuid?: string;
  productCode?: string;
} {
  try {
    const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
    const data = JSON.parse(decodedString);

    // Verify the signature
    const signedFieldNames = data.signed_field_names;
    if (!signedFieldNames) {
      return { valid: false };
    }

    const fields = signedFieldNames.split(',');
    const signatureMessage = fields.map((field: string) => `${field}=${data[field]}`).join(',');
    const expectedSignature = generateSignature(signatureMessage);

    if (expectedSignature !== data.signature) {
      console.error('eSewa signature mismatch');
      return { valid: false };
    }

    return {
      valid: true,
      transactionCode: data.transaction_code,
      status: data.status,
      totalAmount: data.total_amount,
      transactionUuid: data.transaction_uuid,
      productCode: data.product_code,
    };
  } catch (error) {
    console.error('eSewa verification decode error:', error);
    return { valid: false };
  }
}

/**
 * Check transaction status via eSewa API (optional server-side check)
 */
export async function checkEsewaTransactionStatus(
  productCode: string,
  transactionUuid: string,
  totalAmount: number,
): Promise<boolean> {
  try {
    const url = `${ESEWA_STATUS_URL}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      return data.status === 'COMPLETE';
    }
    return false;
  } catch (error) {
    console.error('eSewa status check error:', error);
    return false;
  }
}
