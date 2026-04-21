function Button({ children, type = "button", disabled = false }) {
  return (
    <button type={type} disabled={disabled} className="btn-primary">
      {children}
    </button>
  );
}

export default Button;
