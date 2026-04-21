import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ReactCountryFlag from "react-country-flag";
import InputField from "./InputField";
import Button from "./Button";
import { countries } from "../data/countries";
import { submitOrder } from "../services/api";

function CheckoutForm({
  pricing,
  selectedPlanId,
  onSelectPlan,
  selectedPlan,
  totalPrice,
}) {
  const [submitState, setSubmitState] = useState({ loading: false, message: "" });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "US",
      planId: selectedPlanId ?? "",
    },
  });

  const countryList = useMemo(() => countries, []);
  const selectedCountryCode = watch("country") || "US";

  useEffect(() => {
    if (selectedPlanId !== null && selectedPlanId !== undefined) {
      setValue("planId", Number(selectedPlanId));
    }
  }, [selectedPlanId, setValue]);

  const onSubmit = async (formValues) => {
    try {
      setSubmitState({ loading: true, message: "" });
      await submitOrder({
        ...formValues,
        planId: Number(formValues.planId),
        totalPrice,
      });
      setSubmitState({
        loading: false,
        message: "Order submitted successfully. We will contact you shortly.",
      });
      reset({
        fullName: "",
        email: "",
        phone: "",
        country: formValues.country,
        planId: formValues.planId,
      });
    } catch (error) {
      setSubmitState({
        loading: false,
        message: "Submission failed. Please try again.",
      });
    }
  };

  return (
    <section className="card">
      <h2>Student details</h2>
      <p className="card__subtitle">Fill in your details to reserve your sessions.</p>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          id="fullName"
          label="Full name"
          placeholder="John Doe"
          register={register}
          rules={{ required: "Full name is required" }}
          error={errors.fullName}
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          register={register}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
          error={errors.email}
        />

        <InputField
          id="phone"
          label="Phone"
          placeholder="+971 50 000 0000"
          register={register}
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^\+?[0-9\s\-()]{8,20}$/,
              message: "Enter a valid phone number",
            },
          }}
          error={errors.phone}
        />

        <div className="field">
          <label htmlFor="country" className="field__label">
            Country
          </label>
          <div className="country-select-wrap">
            <span className="country-select-flag" aria-hidden="true">
              <ReactCountryFlag countryCode={selectedCountryCode} svg />
            </span>
            <select id="country" className="field__input" {...register("country", { required: true })}>
              {countryList.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="planId" className="field__label">
            Plan
          </label>
          <select
            id="planId"
            className="field__input"
            value={selectedPlanId ?? ""}
            {...register("planId", { required: "Please choose a plan" })}
            onChange={(event) => {
              const planId = Number(event.target.value);
              setValue("planId", planId, { shouldValidate: true });
              onSelectPlan(planId);
            }}
          >
            {pricing.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {(plan.durationMonths ?? plan.months)} months - {plan.sessionsPerMonth} sessions/month
              </option>
            ))}
          </select>
          {errors.planId ? <p className="field__error">{errors.planId.message}</p> : null}
        </div>

        <Button type="submit" disabled={submitState.loading || !selectedPlan}>
          {submitState.loading ? "Submitting..." : `Pay $${totalPrice}`}
        </Button>

        {submitState.message ? <p className="submit-message">{submitState.message}</p> : null}
      </form>
    </section>
  );
}

export default CheckoutForm;
