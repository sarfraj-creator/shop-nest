"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutFormValues } from "@/types";

const emptyForm: CheckoutFormValues = {
  name: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

type FormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

function validate(values: CheckoutFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Full name is required";
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email";
  }
  if (!values.address.trim()) errors.address = "Address is required";
  if (!values.city.trim()) errors.city = "City is required";
  if (!values.state.trim()) errors.state = "State is required";
  if (!values.zip.trim()) errors.zip = "ZIP code is required";
  if (!values.country.trim()) errors.country = "Country is required";
  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [form, setForm] = useState<CheckoutFormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as user types
    if (errors[name as keyof CheckoutFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    // Simulate payment/order API call
    await new Promise((res) => setTimeout(res, 1500));
    clearCart();
    router.push("/order-success");
  }

  function renderField(
    name: keyof CheckoutFormValues,
    label: string,
    type = "text",
    placeholder = "",
    autoComplete = name
  ) {
    return (
      <div data-error={errors[name] ? true : undefined}>
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          error={errors[name]}
          autoComplete={autoComplete}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Contact info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-base font-semibold text-slate-900">
          Contact Information
        </h2>
        <div className="space-y-4">
          {renderField("name", "Full Name", "text", "John Doe", "name")}
          {renderField(
            "email",
            "Email Address",
            "email",
            "john@example.com",
            "email"
          )}
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-base font-semibold text-slate-900">
          Shipping Address
        </h2>
        <div className="space-y-4">
          {renderField(
            "address",
            "Street Address",
            "text",
            "123 Main Street",
            "street-address"
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {renderField("city", "City", "text", "Mumbai", "address-level2")}
            {renderField(
              "state",
              "State / Province",
              "text",
              "Maharashtra",
              "address-level1"
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {renderField(
              "zip",
              "ZIP / Postal Code",
              "text",
              "400001",
              "postal-code"
            )}
            {renderField("country", "Country", "text", "India", "country-name")}
          </div>
        </div>
      </div>

      {/* Payment placeholder — real app would integrate Stripe/Razorpay here */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Payment
        </h2>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
          <span className="text-xl">💳</span>
          <p className="text-sm text-slate-500">
            Payment gateway integration (e.g. Stripe / Razorpay) goes here.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Placing Order…
          </span>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
}
