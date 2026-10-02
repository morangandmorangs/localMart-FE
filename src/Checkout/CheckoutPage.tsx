import { type FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Footer } from "../Home/components/Footer";
import { Header } from "../Home/components/Header";
import { SupportBot } from "../Home/components/SupportBot";
import {
  useAddAddressMutation,
  useListAddressesQuery,
} from "../redux-store/Services/CustomerApi";
import { selectIsAuthenticated } from "../redux-store/Slices/authSlice";
import { clearCart } from "../redux-store/Slices/cartSlice";

type Step = "address" | "payment" | "done";

const EMPTY_FORM = { label: "", line1: "", city: "", state: "", pincode: "" };

const PAYMENT_METHODS = [
  { id: "gpay", label: "Google Pay", mark: "G", markClass: "lm-checkout__mark--gpay" },
  { id: "phonepe", label: "PhonePe", mark: "Pe", markClass: "lm-checkout__mark--phonepe" },
] as const;
type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

/** Checkout as a single page with internal steps, so there's no route that
 *  can be deep-linked into the payment step without an address first. */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [step, setStep] = useState<Step>("address");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("gpay");
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: addresses, isLoading: loadingAddresses } =
    useListAddressesQuery(undefined, { skip: !isAuthenticated });
  const [addAddress, { isLoading: savingAddress }] = useAddAddressMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin?redirect=/checkout", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const selected = addresses?.find((a) => a.id === selectedAddressId) ?? null;

  const onAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (
      !form.label ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      setFormError("Fill in every field.");
      return;
    }
    try {
      const saved = await addAddress(form).unwrap();
      setSelectedAddressId(saved.id);
      setStep("payment");
    } catch {
      setFormError("Couldn't save that address. Try again.");
    }
  };

  const onChooseAddress = (id: string) => {
    setSelectedAddressId(id);
    setStep("payment");
  };

  const onPay = () => {
    setPaying(true);
    // Mock payment — no real gateway. Simulated delay so the "Processing…"
    // state is actually visible rather than an instant flash.
    setTimeout(() => {
      dispatch(clearCart());
      setPaying(false);
      setStep("done");
    }, 900);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="lm-home">
      <Header />

      <main className="lm-main">
        <header className="lm-catpage__head">
          <div>
            <h1 className="lm-catpage__title">Checkout</h1>
          </div>
        </header>

        <section className="lm-catpage__section">
          {step === "address" && (
            <div className="lm-checkout__panel">
              {loadingAddresses ? (
                <p className="lm-catpage__subnote">
                  Loading your addresses…
                </p>
              ) : (
                <>
                  {addresses && addresses.length > 0 && (
                    <ul className="lm-checkout__addresses">
                      {addresses.map((a) => (
                        <li key={a.id}>
                          <button
                            type="button"
                            className="lm-checkout__address"
                            onClick={() => onChooseAddress(a.id)}
                          >
                            <strong>{a.label}</strong>
                            <span>
                              {a.line1}, {a.city}, {a.state} {a.pincode}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <h2 className="lm-catpage__subtitle">Add a new address</h2>
                  <form className="lm-checkout__form" onSubmit={onAddAddress}>
                    <input
                      className="lm-auth__input"
                      placeholder="Label (Home, Work…)"
                      value={form.label}
                      onChange={(e) =>
                        setForm({ ...form, label: e.target.value })
                      }
                    />
                    <input
                      className="lm-auth__input"
                      placeholder="Address line"
                      value={form.line1}
                      onChange={(e) =>
                        setForm({ ...form, line1: e.target.value })
                      }
                    />
                    <input
                      className="lm-auth__input"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                    />
                    <input
                      className="lm-auth__input"
                      placeholder="State"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                    />
                    <input
                      className="lm-auth__input"
                      placeholder="Pincode"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({ ...form, pincode: e.target.value })
                      }
                    />
                    {formError && (
                      <p className="lm-auth__error">{formError}</p>
                    )}
                    <button
                      className="lm-btn lm-btn--primary"
                      type="submit"
                      disabled={savingAddress}
                    >
                      {savingAddress ? "Saving…" : "Save and continue"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {step === "payment" && selected && (
            <div className="lm-checkout__panel">
              <h2 className="lm-catpage__subtitle">Delivering to</h2>
              <p className="lm-catpage__subnote">
                {selected.label} — {selected.line1}, {selected.city},{" "}
                {selected.state} {selected.pincode}
              </p>

              <h2 className="lm-catpage__subtitle lm-checkout__pay-title">
                Pay with
              </h2>
              <div
                className="lm-checkout__methods"
                role="radiogroup"
                aria-label="Payment method"
              >
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === method.id}
                    className={`lm-checkout__method${
                      paymentMethod === method.id
                        ? " lm-checkout__method--active"
                        : ""
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <span className={`lm-checkout__mark ${method.markClass}`}>
                      {method.mark}
                    </span>
                    {method.label}
                  </button>
                ))}
              </div>

              <button
                className="lm-btn lm-btn--primary"
                type="button"
                onClick={onPay}
                disabled={paying}
              >
                {paying
                  ? "Processing…"
                  : `Pay with ${PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label} (Mock)`}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="lm-checkout__panel">
              <h2 className="lm-catpage__subtitle">Order placed</h2>
              <p className="lm-catpage__subnote">
                Paid via{" "}
                {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}{" "}
                — this was a mock payment, nothing was actually charged.{" "}
                <a href="/">Back to shopping</a>.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <SupportBot />
    </div>
  );
}
