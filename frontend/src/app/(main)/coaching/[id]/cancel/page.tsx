"use client";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-3xl shadow text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed ❌</h1>
        <p className="text-gray-600">
          Your payment was not completed. Please try again.
        </p>
        <a
          href="/plans"
          className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-xl"
        >
          Go Back
        </a>
      </div>
    </div>
  );
}
