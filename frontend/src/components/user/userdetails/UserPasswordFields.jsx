/**
 * UserPasswordFields component
 *
 * Renders a password and confirm password input section for user forms.
 * Includes show/hide toggles, validation, and error display.
 *
 * Props:
 *   - password: (string) Current password value
 *   - setPassword: (function) Setter for password value
 *   - confirmPassword: (string) Current confirm password value
 *   - setConfirmPassword: (function) Setter for confirm password value
 *   - error: (string) Error message to display
 *   - showPassword: (boolean) Whether to show password as plain text
 *   - setShowPassword: (function) Setter for showPassword
 *   - showConfirmPassword: (boolean) Whether to show confirm password as plain text
 *   - setShowConfirmPassword: (function) Setter for showConfirmPassword
 *   - onSubmit: (function) Form submit handler
 */
export default function UserPasswordFields({ password, setPassword, confirmPassword, setConfirmPassword, error, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, onSubmit }) {
  const canSave = password.length > 0 || confirmPassword.length > 0;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="relative flex-1">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input w-full pr-12"
          minLength={8}
          maxLength={72}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
          data-testid="new-password-input"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-semibold"
          onClick={() => setShowPassword(v => !v)}
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        >
          {showPassword ? "Ocultar" : "Ver"}
        </button>
      </div>
      <div className="relative flex-1">
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="input w-full pr-12"
          minLength={8}
          maxLength={72}
          placeholder="Confirmar nueva contraseña"
          autoComplete="new-password"
          data-testid="confirm-password-input"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-semibold"
          onClick={() => setShowConfirmPassword(v => !v)}
          tabIndex={-1}
          aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
        >
          {showConfirmPassword ? "Ocultar" : "Ver"}
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Debe tener mayúscula, minúscula, número y uno de estos caracteres especiales: @$!%*?&</span>
        {error && <div className="text-red-500 text-xs sm:text-sm">{error}</div>}
      </div>
      <button
        type="submit"
        className="btn-primary self-end"
        disabled={!canSave}
      >
        Guardar contraseña
      </button>
    </form>
  );
}
