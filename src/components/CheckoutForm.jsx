import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ReactCountryFlag from "react-country-flag";
import { countries, countriesWithDialCode } from "../data/countries";
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
  onSuccess,
  formId = "checkout-form",
}) {
  const [submitState, setSubmitState] = useState({ loading: false, error: "" });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      loginPhone: "",
      contactPhone: "",
      loginPhoneCountry: "AE",
      contactPhoneCountry: "AE",
      address: "",
      addressNumber: "",
      postalCode: "",
      city: "",
      country: "AE",
      paymentMethod: "SEPA",
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      acceptTerms: false,
    },
  });

  const countryList = useMemo(() => countries, []);
  const countryDialCodeList = useMemo(() => countriesWithDialCode, []);
  const selectedCountryCode = watch("country") || "AE";
  const loginPhoneCountry = watch("loginPhoneCountry") || "AE";
  const contactPhoneCountry = watch("contactPhoneCountry") || "AE";
  const paymentMethod = watch("paymentMethod");
  const getDialCode = (countryCode) =>
    countryDialCodeList.find((country) => country.code === countryCode)?.dialCode || "+971";

  const normalizePhoneValue = (value, dialCode) => {
    return value.replace(/\D/g, "");
  };
  
  const texts = {
    "en-GB": {
      sectionTitle: "Student details",
      subtitle: "Fill in your details to reserve your sessions.",
      loginPhone: "Login Phone Number (preferably the student's)",
      contactPhone: "Contact Phone Number (preferably the parent's)",
      contactEmail: "Contact Email Address (preferably the parent's)",
      contactName: "Contact Name",
      billingAddress: "Billing Address",
      number: "Number",
      monthlySessions: "Monthly Sessions",
      sessionsLabel: "Sessions",
      selectPaymentMethod: "Select Payment Method",
      months: "months",
      sessionsPerMonth: "sessions/month",
      fullName: "Full name",
      fullNamePlaceholder: "John Doe",
      email: "Email",
      phone: "Phone",
      phoneRequired: "Phone is required",
      phoneInvalid: "Enter a valid phone number",
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
      submitting: "Processing...",
      pay: "Pay",
      popular: "Most Popular",
      bestValue: "Best Value"
    },
    "fr-FR": {
      sectionTitle: "Détails de l'étudiant",
      subtitle: "Renseignez vos informations pour réserver vos sessions.",
      loginPhone: "Téléphone de connexion (de préférence celui de l'étudiant)",
      contactPhone: "Téléphone de contact (de préférence celui du parent)",
      contactEmail: "Email de contact (de préférence celui du parent)",
      contactName: "Nom du contact",
      billingAddress: "Adresse de facturation",
      number: "Numéro",
      monthlySessions: "Sessions mensuelles",
      sessionsLabel: "sessions",
      selectPaymentMethod: "Choisir le mode de paiement",
      months: "mois",
      sessionsPerMonth: "sessions/mois",
      fullName: "Nom complet",
      fullNamePlaceholder: "Jean Dupont",
      email: "Email",
      phone: "Téléphone",
      phoneRequired: "Le téléphone est requis",
      phoneInvalid: "Entrez un numéro de téléphone valide",
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
      submitting: "Traitement...",
      pay: "Payer",
      popular: "Plus Populaire",
      bestValue: "Meilleure Valeur"
    },
    "ar-SA": {
      sectionTitle: "بيانات الطالب",
      subtitle: "أدخل بياناتك لحجز الجلسات.",
      loginPhone: "رقم هاتف تسجيل الدخول (يفضل رقم الطالب)",
      contactPhone: "رقم هاتف التواصل (يفضل رقم ولي الأمر)",
      contactEmail: "البريد الإلكتروني للتواصل (يفضل بريد ولي الأمر)",
      contactName: "اسم جهة التواصل",
      billingAddress: "عنوان الفوترة",
      number: "رقم",
      monthlySessions: "الجلسات الشهرية",
      sessionsLabel: "جلسات",
      selectPaymentMethod: "اختر طريقة الدفع",
      months: "أشهر",
      sessionsPerMonth: "جلسة/شهر",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "محمد أحمد",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      phoneRequired: "الهاتف مطلوب",
      phoneInvalid: "أدخل رقم هاتف صحيح",
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
      submitting: "جاري المعالجة...",
      pay: "ادفع",
      popular: "الأكثر شعبية",
      bestValue: "أفضل قيمة"
    },
  };
  const t = texts[locale] ?? texts["en-GB"];

  const onSubmit = async (formValues) => {
    try {
      setSubmitState({ loading: true, error: "" });
      const payload = {
        ...formValues,
        loginPhone: formValues.loginPhone
          ? `${getDialCode(formValues.loginPhoneCountry)}${formValues.loginPhone}`
          : "",
        contactPhone: formValues.contactPhone
          ? `${getDialCode(formValues.contactPhoneCountry)}${formValues.contactPhone}`
          : "",
        // Keep legacy keys populated for existing consumers of API payload.
        fullName: formValues.fullName,
        email: formValues.email,
        phone: formValues.contactPhone
          ? `${getDialCode(formValues.contactPhoneCountry)}${formValues.contactPhone}`
          : formValues.phone,
      };
      await submitOrder({
        ...payload,
        selectedPlanId,
        payInAdvance,
        finalTotalPrice,
      });
      setSubmitState({ loading: false, error: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      setSubmitState({
        loading: false,
        error: "Submission failed. Please try again.",
      });
    }
  };

  return (
    <section className="card">
      <h2 className="card__title">{t.sectionTitle}</h2>
      <p className="card__subtitle">{t.subtitle}</p>

      <form id={formId} className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-stack">
          <div className="field">
            <label htmlFor="loginPhone" className="field__label">{t.loginPhone}</label>
            <div className="field__input-wrapper">
              <div className={`phone-field ${errors.loginPhone ? "phone-field--error" : ""}`}>
                <label className="phone-field__prefix" htmlFor="loginPhoneCountry">
                  <ReactCountryFlag countryCode={loginPhoneCountry} svg />
                  <select
                    id="loginPhoneCountry"
                    className="phone-field__country-select"
                    {...register("loginPhoneCountry")}
                  >
                    {countryDialCodeList.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.dialCode})
                      </option>
                    ))}
                  </select>
                  <span className="phone-field__dial">{getDialCode(loginPhoneCountry)}</span>
                </label>
                <input
                  id="loginPhone"
                  type="tel"
                  inputMode="numeric"
                  className={`field__input phone-field__number ${errors.loginPhone ? "field__input--error" : ""}`}
                  placeholder="1512345678"
                  {...register("loginPhone", {
                    required: t.phoneRequired,
                    pattern: { value: /^[0-9]{6,15}$/, message: t.phoneInvalid },
                    onChange: (event) => {
                      const nextValue = normalizePhoneValue(event.target.value);
                      setValue("loginPhone", nextValue, { shouldValidate: true, shouldTouch: true });
                    },
                  })}
                />
              </div>
              {touchedFields.loginPhone && !errors.loginPhone && (
                <div className="field__icon-right icon-success">✓</div>
              )}
            </div>
            {errors.loginPhone && <p className="field__error" role="alert">⚠ {errors.loginPhone.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="contactPhone" className="field__label">{t.contactPhone}</label>
            <div className="field__input-wrapper">
              <div className={`phone-field ${errors.contactPhone ? "phone-field--error" : ""}`}>
                <label className="phone-field__prefix" htmlFor="contactPhoneCountry">
                  <ReactCountryFlag countryCode={contactPhoneCountry} svg />
                  <select
                    id="contactPhoneCountry"
                    className="phone-field__country-select"
                    {...register("contactPhoneCountry")}
                  >
                    {countryDialCodeList.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.dialCode})
                      </option>
                    ))}
                  </select>
                  <span className="phone-field__dial">{getDialCode(contactPhoneCountry)}</span>
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  inputMode="numeric"
                  className={`field__input phone-field__number ${errors.contactPhone ? "field__input--error" : ""}`}
                  placeholder="1512345678"
                  {...register("contactPhone", {
                    required: t.phoneRequired,
                    pattern: { value: /^[0-9]{6,15}$/, message: t.phoneInvalid },
                    onChange: (event) => {
                      const nextValue = normalizePhoneValue(event.target.value);
                      setValue("contactPhone", nextValue, { shouldValidate: true, shouldTouch: true });
                    },
                  })}
                />
              </div>
              {touchedFields.contactPhone && !errors.contactPhone && <div className="field__icon-right icon-success">✓</div>}
            </div>
            {errors.contactPhone && <p className="field__error" role="alert">⚠ {errors.contactPhone.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="email" className="field__label">{t.contactEmail}</label>
            <div className="field__input-wrapper">
              <input
                id="email"
                type="email"
                className={`field__input ${errors.email ? "field__input--error" : ""}`}
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                  validate: (value) =>
                    value.endsWith("@04academy.com") || "Only 04academy emails are allowed"
                })}
              />
              {touchedFields.email && !errors.email && <div className="field__icon-right icon-success">✓</div>}
            </div>
            {errors.email && <p className="field__error" role="alert">⚠ {errors.email.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="fullName" className="field__label">{t.contactName}</label>
            <div className="field__input-wrapper">
              <input
                id="fullName"
                className={`field__input ${errors.fullName ? "field__input--error" : ""}`}
                placeholder={t.fullNamePlaceholder}
                {...register("fullName", { required: "Full name is required" })}
                aria-invalid={!!errors.fullName}
              />
              {touchedFields.fullName && !errors.fullName && (
                <div className="field__icon-right icon-success">✓</div>
              )}
            </div>
            {errors.fullName && <p className="field__error" role="alert">⚠ {errors.fullName.message}</p>}
          </div>

          <div className="field">
            <label htmlFor="address" className="field__label">{t.billingAddress}</label>
            <div className="row-two">
              <div className="field__input-wrapper">
                <input
                  id="address"
                  className={`field__input ${errors.address ? "field__input--error" : ""}`}
                  placeholder={t.addressPlaceholder}
                  {...register("address", { required: "Address is required" })}
                />
              </div>
              <div className="field__input-wrapper">
                <input
                  id="addressNumber"
                  className="field__input"
                  placeholder={t.number}
                  inputMode="numeric"
                  {...register("addressNumber", {
                    pattern: { value: /^[0-9]*$/, message: "Numbers only" },
                    onChange: (event) => {
                      const nextValue = event.target.value.replace(/\D/g, "");
                      setValue("addressNumber", nextValue, { shouldValidate: true, shouldTouch: true });
                    },
                  })}
                />
              </div>
            </div>
            {errors.address && <p className="field__error" role="alert">⚠ {errors.address.message}</p>}
          </div>

          <div className="row-three">
            <div className="field">
              <label htmlFor="postalCode" className="field__label">{t.postalCode}</label>
              <div className="field__input-wrapper">
                <input
                  id="postalCode"
                  className={`field__input ${errors.postalCode ? "field__input--error" : ""}`}
                  placeholder="10115"
                  inputMode="numeric"
                  {...register("postalCode", {
                    required: "Postal code is required",
                    pattern: { value: /^[0-9]+$/, message: "Numbers only" },
                    onChange: (event) => {
                      const nextValue = event.target.value.replace(/\D/g, "");
                      setValue("postalCode", nextValue, { shouldValidate: true, shouldTouch: true });
                    },
                  })}
                />
              </div>
              {errors.postalCode && <p className="field__error" role="alert">⚠ {errors.postalCode.message}</p>}
            </div>

            <div className="field">
              <label htmlFor="city" className="field__label">{t.city}</label>
              <div className="field__input-wrapper">
                <input
                  id="city"
                  className={`field__input ${errors.city ? "field__input--error" : ""}`}
                  placeholder="Berlin"
                  {...register("city", { required: "City is required" })}
                />
              </div>
              {errors.city && <p className="field__error" role="alert">⚠ {errors.city.message}</p>}
            </div>

            <div className="field">
              <label htmlFor="country" className="field__label">{t.country}</label>
              <div className="country-select-wrap">
                <div className="country-select-flag" aria-hidden="true">
                  <ReactCountryFlag countryCode={selectedCountryCode} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <select
                  id="country"
                  className={`field__input ${errors.country ? "field__input--error" : ""}`}
                  {...register("country", { required: "Country is required" })}
                >
                  {countryList.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
              {errors.country && <p className="field__error" role="alert">⚠ {errors.country.message}</p>}
            </div>
          </div>
        </div>

        <div className="field">
          <label className="field__label">{t.monthlySessions}</label>
          <div className="field__input-wrapper">
            <select
              className="field__input"
              value={selectedPlanId ?? ""}
              onChange={(event) => onSelectPlan(Number(event.target.value))}
              aria-label={t.monthlySessions}
            >
              {pricing.map((plan) => {
                const durationMonths = plan.durationMonths ?? plan.months;
                return (
                  <option key={plan.id} value={plan.id}>
                    {plan.sessionsPerMonth} {t.sessionsLabel} ({durationMonths} {t.months})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label">{t.selectPaymentMethod}</label>
          <div className="payment-methods">
            <label className="payment-method-card">
              <input type="radio" value="SEPA" {...register("paymentMethod")} />
              <div className="payment-icons">
                <svg viewBox="0 0 50 20" fill="currentColor"><path d="M10 5h5v2h-5zM20 5h5v2h-5zM30 5h5v2h-5zM40 5h5v2h-5z"/></svg>
              </div>
              <span className="payment-name">SEPA Direct Debit</span>
            </label>
            <label className="payment-method-card">
              <input type="radio" value="CREDIT_CARD" {...register("paymentMethod")} />
              <div className="payment-icons">
                <svg viewBox="0 0 32 20" fill="#1434CB"><path d="M0 0h32v20H0z"/><path fill="#fff" d="M21.5 13.7l1.3-8h-2l-1 8h2zm-9.3-8l-1.6 5.4L10 5.7h-2.1l1.8 8h2.2l2.6-8h-2.3zM25.7 5.7h-1.6c-.4 0-.7.2-.9.5l-3.1 7.5h2.1l.4-1.2h2.6l.2 1.2h2l-1.7-8zm-2 5.2l.9-2.5.5 2.5h-1.4zM15 9.1c0-1-.8-1.5-1.5-1.5-.9 0-1.6.4-1.6.4l.3 1.3s.6-.3 1.1-.3c.4 0 .7.2.7.5 0 .8-2.3.6-2.3 2.1 0 .9.8 1.4 1.5 1.4.7 0 1.3-.3 1.6-.7v.5h1.5s-.1-1 -.1-2.9c0-.4.3-.8.3-.8z"/></svg>
                <svg viewBox="0 0 32 20" fill="#EB001B"><circle cx="10" cy="10" r="10"/><circle fill="#F79E1B" cx="22" cy="10" r="10"/><path fill="#FF5F00" d="M16 10c0-2.4 1.1-4.5 2.8-5.8-1.7-1.3-3.8-2-6-2-5.5 0-10 4.5-10 10s4.5 10 10 10c2.2 0 4.3-.7 6-2-1.7-1.3-2.8-3.4-2.8-5.8z"/></svg>
              </div>
              <span className="payment-name">{t.creditCard}</span>
            </label>
          </div>
        </div>

        {paymentMethod === "CREDIT_CARD" && (
          <div className="form-grid">
            <div className="field">
              <label htmlFor="cardHolderName" className="field__label">{t.cardHolderName}</label>
              <div className="field__input-wrapper">
                <input
                  id="cardHolderName"
                  className={`field__input ${errors.cardHolderName ? "field__input--error" : ""}`}
                  {...register("cardHolderName", { required: "Name is required" })}
                />
              </div>
              {errors.cardHolderName && <p className="field__error" role="alert">⚠ {errors.cardHolderName.message}</p>}
            </div>

            <div className="field">
              <label htmlFor="cardNumber" className="field__label">{t.cardNumber}</label>
              <div className="field__input-wrapper">
                <input
                  id="cardNumber"
                  className={`field__input ${errors.cardNumber ? "field__input--error" : ""}`}
                    placeholder="12345678901234"
                    inputMode="numeric"
                    maxLength={16}
                    {...register("cardNumber", {
                      required: "Card number is required",
                      pattern: { value: /^[0-9]+$/, message: "Card number must contain digits only" },
                      minLength: { value: 14, message: "Card number must be 14-16 digits" },
                      maxLength: { value: 16, message: "Card number must be 14-16 digits" },
                      onChange: (event) => {
                        const nextValue = event.target.value.replace(/\D/g, "").slice(0, 16);
                        setValue("cardNumber", nextValue, { shouldValidate: true, shouldTouch: true });
                      },
                    })}
                />
              </div>
              {errors.cardNumber && <p className="field__error" role="alert">⚠ {errors.cardNumber.message}</p>}
            </div>

            <div className="field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", gridColumn: "1 / -1" }}>
              <div>
                <label htmlFor="expiryDate" className="field__label">{t.expiryDate}</label>
                <div className="field__input-wrapper">
                  <input
                    id="expiryDate"
                    className={`field__input ${errors.expiryDate ? "field__input--error" : ""}`}
                    placeholder="MM/YY"
                    {...register("expiryDate", { required: "Expiry required", pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "MM/YY" }})}
                  />
                </div>
                {errors.expiryDate && <p className="field__error" role="alert">⚠ {errors.expiryDate.message}</p>}
              </div>

              <div>
                <label htmlFor="cvc" className="field__label">CVC</label>
                <div className="field__input-wrapper">
                  <input
                    id="cvc"
                    className={`field__input ${errors.cvc ? "field__input--error" : ""}`}
                    placeholder="123"
                    {...register("cvc", { required: "CVC required", pattern: { value: /^\d{3,4}$/, message: "Invalid" }})}
                  />
                </div>
                {errors.cvc && <p className="field__error" role="alert">⚠ {errors.cvc.message}</p>}
              </div>
            </div>
          </div>
        )}

        <label className="checkbox-wrap" style={{ marginTop: "0.5rem" }}>
          <input
            type="checkbox"
            checked={payInAdvance}
            onChange={(e) => onTogglePayInAdvance(e.target.checked)}
          />
          <div className="checkbox-custom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="checkbox-label">
            <strong>{t.payAdvance.split(' - ')[0]}</strong> - {t.payAdvance.split(' - ')[1]}
          </span>
        </label>

        <label className="checkbox-wrap">
          <input type="checkbox" {...register("acceptTerms", { required: "Terms must be accepted" })} />
          <div className="checkbox-custom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="checkbox-label">{t.terms}</span>
        </label>
        {errors.acceptTerms && <p className="field__error" role="alert">⚠ {errors.acceptTerms.message}</p>}

        {submitState.error && (
          <div className="state state--error" style={{ padding: "0.5rem 1rem", marginTop: "1rem", borderRadius: "8px" }}>
            ⚠ {submitState.error}
          </div>
        )}

      </form>
    </section>
  );
}

export default CheckoutForm;
