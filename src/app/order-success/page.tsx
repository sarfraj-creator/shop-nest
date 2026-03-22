import Link from "next/link";
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-5 px-4 py-32 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <FiCheckCircle className="h-10 w-10 text-emerald-500" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order Placed!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Thanks for your purchase. We&apos;ve received your order and will start
          processing it shortly. A confirmation will be sent to your email.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 w-full">
        <p className="font-medium text-slate-800">What happens next?</p>
        <ul className="mt-2 space-y-1 text-left text-xs">
          <li>📧 Confirmation email sent to you</li>
          <li>📦 Order packed within 1-2 business days</li>
          <li>🚚 Shipped and delivered in 3-5 business days</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button asChild size="lg">
          <Link href="/products">
            <FiShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            Back to Home <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
