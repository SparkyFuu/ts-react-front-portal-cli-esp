import { changePortalPassword } from "@/pages/auth/services/authServices";
import {
  login,
  selectAuthOptions,
} from "@/pages/auth/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { FiLock, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePasswordPage = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthOptions);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePortalPassword({
        currentPassword,
        newPassword,
      });

      dispatch(
        login({
          token: auth.token,
          refreshToken: auth.refreshToken,
          user: response.user,
        }),
      );
      toast.success("Contraseña actualizada correctamente.");
      navigate("/area-clientes");
    } catch {
      toast.error("No pudimos actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center bg-[#f7fbff] px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-[0_18px_45px_rgba(15,38,71,0.10)]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5ff] text-[#0b82df]">
          <FiShield className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#07133d]">
          Cambia tu contraseña
        </h1>
        <p className="mt-3 text-gray-500">
          Usa una contraseña propia para proteger tu área de clientes.
        </p>

        <label className="mt-7 block">
          <span className="text-sm font-bold text-[#07133d]">
            Contraseña temporal
          </span>
          <span className="mt-2 flex h-14 items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#0b82df] focus-within:ring-4 focus-within:ring-[#0b82df]/15">
            <FiLock className="h-5 w-5 text-[#0b82df]" />
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="min-w-0 flex-1 outline-none"
              autoComplete="current-password"
              required
            />
          </span>
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-[#07133d]">
            Nueva contraseña
          </span>
          <span className="mt-2 flex h-14 items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#0b82df] focus-within:ring-4 focus-within:ring-[#0b82df]/15">
            <FiLock className="h-5 w-5 text-[#0b82df]" />
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="min-w-0 flex-1 outline-none"
              autoComplete="new-password"
              required
            />
          </span>
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-[#07133d]">
            Confirmar contraseña
          </span>
          <span className="mt-2 flex h-14 items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#0b82df] focus-within:ring-4 focus-within:ring-[#0b82df]/15">
            <FiLock className="h-5 w-5 text-[#0b82df]" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="min-w-0 flex-1 outline-none"
              autoComplete="new-password"
              required
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 h-14 w-full rounded-xl bg-[#0b82df] font-bold text-white shadow-[0_16px_32px_rgba(11,130,223,0.24)] transition hover:bg-[#076fc0] disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </main>
  );
};

export default ChangePasswordPage;
