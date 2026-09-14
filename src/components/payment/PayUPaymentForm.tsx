'use client';

import { useEffect, useRef } from 'react';

interface PayUFormFields {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  service_provider?: string;
}

interface PayUPaymentFormProps {
  action: string;
  fields: PayUFormFields;
  autoSubmit?: boolean;
}

/**
 * Renders a hidden form and (optionally) auto-submits it to PayU.
 * This redirects the user to PayU's hosted payment page.
 */
export const PayUPaymentForm: React.FC<PayUPaymentFormProps> = ({
  action,
  fields,
  autoSubmit = true,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (autoSubmit && formRef.current && !submittedRef.current) {
      submittedRef.current = true;
      formRef.current.submit();
    }
  }, [autoSubmit]);

  return (
    <form
      ref={formRef}
      action={action}
      method="POST"
      style={{ display: 'none' }}
    >
      {Object.entries(fields).map(([key, value]) => (
        <input
          key={key}
          type="hidden"
          name={key}
          value={value ?? ''}
        />
      ))}
    </form>
  );
};

export default PayUPaymentForm;