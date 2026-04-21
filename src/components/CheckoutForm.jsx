import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ReactCountryFlag from "react-country-flag";
import { countries } from "../data/countries";
import { submitOrder } from "../services/api";

function CheckoutForm({
  pricing,
  selectedPlanId,
  onSelectPlan,
  selectedPlan,
  payInAdvance,
  onTogglePayInAdvance,
  finalTotalPrice,
  locale,
}) {
  const [submitState, setSubmitState] = useState({ loading: false, message: "" });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      country: "US",
      paymentMethod: "SEPA",
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      acceptTerms: false,
    },
  });

  const countryList = useMemo(() => countries, []);
  const selectedCountryCode = watch("country") || "US";
  const paymentMethod = watch("paymentMethod");
  const acceptedTerms = watch("acceptTerms");
  const canSubmit = isValid && acceptedTerms && selectedPlan && !submitState.loading;
  const texts = {
    "en-GB": {
      sectionTitle: "Student details",
      subtitle: "Fill in your details to reserve your sessions.",
      months: "months",
      sessionsPerMonth: "sessions/month",
      fullName: "Full name",
      fullNamePlaceholder: "John Doe",
      email: "Email",
      phone: "Phone",
      address: "Address",
      addressPlaceholder: "Street and number",
      postalCode: "Postal code",
      city: "City",
      country: "Country",
      paymentMethod: "Payment method",
      creditCard: "Credit Card",
      cardHolderName: "Card holder name",
      cardNumber: "Card number",
      expiryDate: "Expiry date",
      payAdvance: "Pay in advance - EXTRA 5% DISCOUNT",
      terms: "I accept the Terms & Conditions",
      submitting: "Submitting...",
      pay: "Pay",
    },
    "fr-FR": {
      sectionTitle: "Détails de l'étudiant",
      subtitle: "Renseignez vos informations pour réserver vos sessions.",
      months: "mois",
      sessionsPerMonth: "sessions/mois",
      fullName: "Nom complet",
      fullNamePlaceholder: "Jean Dupont",
      email: "Email",
      phone: "Téléphone",
      address: "Adresse",
      addressPlaceholder: "Rue et numéro",
      postalCode: "Code postal",
      city: "Ville",
      country: "Pays",
      paymentMethod: "Méthode de paiement",
      creditCard: "Carte bancaire",
      cardHolderName: "Titulaire de la carte",
      cardNumber: "Numéro de carte",
      expiryDate: "Date d'expiration",
      payAdvance: "Paiement anticipé - REMISE EXTRA 5%",
      terms: "J'accepte les Conditions générales",
      submitting: "Envoi...",
      pay: "Payer",
    },
    "ar-SA": {
      sectionTitle: "بيانات الطالب",
      subtitle: "أدخل بياناتك لحجز الجلسات.",
      months: "أشهر",
      sessionsPerMonth: "جلسة/شهر",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "محمد أحمد",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      address: "العنوان",
      addressPlaceholder: "الشارع ورقم المبنى",
      postalCode: "الرمز البريدي",
      city: "المدينة",
      country: "الدولة",
      paymentMethod: "طريقة الدفع",
      creditCard: "بطاقة ائتمان",
      cardHolderName: "اسم حامل البطاقة",
      cardNumber: "رقم البطاقة",
      expiryDate: "تاريخ الانتهاء",
      payAdvance: "ادفع مقدما - خصم إضافي 5%",
      terms: "أوافق على الشروط والأحكام",
      submitting: "جار الإرسال...",
      pay: "ادفع",
    },
  };
  const t = texts[locale] ?? texts["en-GB"];

  const onSubmit = async (formValues) => {
    try {
      setSubmitState({ loading: true, message: "" });
      await submitOrder({
        ...formValues,
        selectedPlanId,
        payInAdvance,
        finalTotalPrice,
      });

      setSubmitState({
        loading: false,
        message: "Order submitted successfully. We will contact you shortly.",
      });
      reset({
        ...formValues,
        fullName: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        acceptTerms: false,
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
      <h2>{t.sectionTitle}</h2>
      <p className="card__subtitle">{t.subtitle}</p>

      <div className="plan-cards" role="radiogroup" aria-label="Select your plan">
        {pricing.map((plan) => {
          const durationMonths = plan.durationMonths ?? plan.months;
          const isActive = Number(plan.id) === Number(selectedPlanId);
          return (
            <button
              key={plan.id}
              type="button"
              className={`plan-card ${isActive ? "plan-card--active" : ""}`}
              onClick={() => onSelectPlan(Number(plan.id))}
            >
              <span className="plan-card__title">{durationMonths} {t.months}</span>
              <span className="plan-card__meta">{plan.sessionsPerMonth} {t.sessionsPerMonth}</span>
            </button>
          );
        })}
      </div>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="fullName" className="field__label">
              {t.fullName}
            </label>
            <input
              id="fullName"
              className={`field__input ${errors.fullName ? "field__input--error" : ""}`}
              placeholder={t.fullNamePlaceholder}
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName ? <p className="field__error">{errors.fullName.message}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="email" className="field__label">
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              className={`field__input ${errors.email ? "field__input--error" : ""}`}
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email ? <p className="field__error">{errors.email.message}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="phone" className="field__label">
              {t.phone}
            </label>
            <input
              id="phone"
              className={`field__input ${errors.phone ? "field__input--error" : ""}`}
              placeholder="+49 1512 345678"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[0-9\s\-()]{8,20}$/,
                  message: "Enter a valid phone number",
                },
              })}
            />
            {errors.phone ? <p className="field__error">{errors.phone.message}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="address" className="field__label">
              {t.address}
            </label>
            <input
              id="address"
              className={`field__input ${errors.address ? "field__input--error" : ""}`}
              placeholder={t.addressPlaceholder}
              {...register("address", { required: "Address is required" })}
            />
            {errors.address ? <p className="field__error">{errors.address.message}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="postalCode" className="field__label">
              {t.postalCode}
            </label>
            <input
              id="postalCode"
              className={`field__input ${errors.postalCode ? "field__input--error" : ""}`}
              placeholder="10115"
              {...register("postalCode", { required: "Postal code is required" })}
            />
            {errors.postalCode ? <p className="field__error">{errors.postalCode.message}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="city" className="field__label">
              {t.city}
            </label>
            <input
              id="city"
              className={`field__input ${errors.city ? "field__input--error" : ""}`}
              placeholder="Berlin"
              {...register("city", { required: "City is required" })}
            />
            {errors.city ? <p className="field__error">{errors.city.message}</p> : null}
          </div>
        </div>

        <div className="field">
          <label htmlFor="country" className="field__label">
            {t.country}
          </label>
          <div className="country-select-wrap">
            <span className="country-select-flag" aria-hidden="true">
              <ReactCountryFlag countryCode={selectedCountryCode} svg />
            </span>
            <select
              id="country"
              className={`field__input ${errors.country ? "field__input--error" : ""}`}
              {...register("country", { required: "Country is required" })}
            >
              {countryList.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          {errors.country ? <p className="field__error">{errors.country.message}</p> : null}
        </div>

        <div className="field">
          <label className="field__label">{t.paymentMethod}</label>
          <div className="payment-methods">
            <label className="choice-chip">
              <input type="radio" value="SEPA" {...register("paymentMethod", { required: true })} />
              <span>SEPA</span>
            </label>
            <label className="choice-chip">
              <input
                type="radio"
                value="CREDIT_CARD"
                {...register("paymentMethod", { required: true })}
              />
              <span>{t.creditCard}</span>
            </label>
          </div>
        </div>

        {paymentMethod === "CREDIT_CARD" ? (
          <div className="payment-grid">
            <div className="field">
              <label htmlFor="cardHolderName" className="field__label">
                {t.cardHolderName}
              </label>
              <input
                id="cardHolderName"
                className={`field__input ${errors.cardHolderName ? "field__input--error" : ""}`}
                {...register("cardHolderName", {
                  required: "Card holder name is required for credit card",
                })}
              />
              {errors.cardHolderName ? (
                <p className="field__error">{errors.cardHolderName.message}</p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="cardNumber" className="field__label">
                {t.cardNumber}
              </label>
              <input
                id="cardNumber"
                className={`field__input ${errors.cardNumber ? "field__input--error" : ""}`}
                placeholder="1234 5678 9012 3456"
                {...register("cardNumber", {
                  required: "Card number is required for credit card",
                  pattern: {
                    value: /^[0-9\s]{12,23}$/,
                    message: "Enter a valid card number",
                  },
                })}
              />
              {errors.cardNumber ? <p className="field__error">{errors.cardNumber.message}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="expiryDate" className="field__label">
                {t.expiryDate}
              </label>
              <input
                id="expiryDate"
                className={`field__input ${errors.expiryDate ? "field__input--error" : ""}`}
                placeholder="MM/YY"
                {...register("expiryDate", {
                  required: "Expiry date is required for credit card",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    message: "Use MM/YY format",
                  },
                })}
              />
              {errors.expiryDate ? <p className="field__error">{errors.expiryDate.message}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="cvc" className="field__label">
                CVC
              </label>
              <input
                id="cvc"
                className={`field__input ${errors.cvc ? "field__input--error" : ""}`}
                placeholder="123"
                {...register("cvc", {
                  required: "CVC is required for credit card",
                  pattern: {
                    value: /^\d{3,4}$/,
                    message: "Enter a valid CVC",
                  },
                })}
              />
              {errors.cvc ? <p className="field__error">{errors.cvc.message}</p> : null}
            </div>
          </div>
        ) : null}

        <label className="inline-check">
          <input
            type="checkbox"
            checked={payInAdvance}
            onChange={(event) => onTogglePayInAdvance(event.target.checked)}
          />
          <span>{t.payAdvance}</span>
        </label>

        <label className="inline-check">
          <input
            type="checkbox"
            {...register("acceptTerms", {
              required: "You must accept Terms & Conditions",
            })}
          />
          <span>{t.terms}</span>
        </label>
        {errors.acceptTerms ? <p className="field__error">{errors.acceptTerms.message}</p> : null}

        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {submitState.loading ? t.submitting : `${t.pay} $${finalTotalPrice.toFixed(2)}`}
        </button>

        {submitState.message ? <p className="submit-message">{submitState.message}</p> : null}
      </form>
    </section>
  );
}

export default CheckoutForm;
