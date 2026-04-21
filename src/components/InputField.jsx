function InputField({
  id,
  label,
  type = "text",
  placeholder,
  register,
  rules,
  error,
}) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`field__input ${error ? "field__input--error" : ""}`}
        {...register(id, rules)}
      />
      {error ? <p className="field__error">{error.message}</p> : null}
    </div>
  );
}

export default InputField;
