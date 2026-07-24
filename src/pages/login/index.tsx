import piggyImage from "@/assets/images/8.png";
import logo from "@/assets/images/ENERGYASSET-LOGO_con_slogan.png";
import { loginAsync, selectAuthOptions } from "@/pages/auth/features/authSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import {
  FiChevronRight,
  FiEye,
  FiHeadphones,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openEmail, openPhone } from "@/utils/portalActions";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthOptions);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const requestPasswordHelp = () => {
    openEmail(
      "clientes@energyasset.es",
      "Recuperación de acceso al portal ENERGYASSET",
    );
  };

  const requestPortalAccess = (provider?: "Google" | "Apple") => {
    openEmail(
      "clientes@energyasset.es",
      provider
        ? `Solicitud de acceso al portal con ${provider}`
        : "Solicitud de alta en portal cliente ENERGYASSET",
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await dispatch(
      loginAsync({ email: username.trim(), password }),
    );

    if (!loginAsync.fulfilled.match(result)) return;

    const nextRoute = result.payload.user.passwordChangeRequired
      ? "/change-password"
      : "/area-clientes";
    navigate(nextRoute);
  };

  return (
    <main className="bg-white">
      <section className="relative min-h-screen overflow-hidden bg-white px-6 pb-10 pt-8 md:hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-t-[60%] bg-[#e7f4ff]" />

        <img src={logo} alt="ENERGYASSET" className="relative mt-10 h-16 w-auto object-contain" />

        <div className="relative mt-8 grid grid-cols-[1fr_12rem] items-center gap-1">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-[#07133d]">
              Bienvenido a tu <span className="text-[#45a9e8]">área de clientes</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-gray-600">
              Accede para gestionar tu energía de forma fácil y rápida.
            </p>
          </div>
          <img src={piggyImage} alt="" className="h-48 w-48 object-contain" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative mt-8 rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,38,71,0.10)]"
        >
          <h2 className="text-2xl font-bold text-[#07133d]">Inicia sesión</h2>

          <label className="mt-7 block">
            <span className="text-base font-bold text-[#07133d]">Email</span>
            <span className="mt-3 flex h-16 items-center gap-4 rounded-xl border border-gray-200 px-5 transition focus-within:border-[#0b82df] focus-within:ring-4 focus-within:ring-[#0b82df]/15">
              <FiMail className="h-6 w-6 text-[#0b82df]" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="ejemplo@correo.com"
                autoComplete="username"
                required
                className="min-w-0 flex-1 text-lg outline-none placeholder:text-gray-400"
              />
            </span>
          </label>

          <label className="mt-6 block">
            <span className="text-base font-bold text-[#07133d]">Contraseña</span>
            <span className="mt-3 flex h-16 items-center gap-4 rounded-xl border border-gray-200 px-5 transition focus-within:border-[#0b82df] focus-within:ring-4 focus-within:ring-[#0b82df]/15">
              <FiLock className="h-6 w-6 text-[#0b82df]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                autoComplete="current-password"
                required
                className="min-w-0 flex-1 text-lg outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-gray-500"
                aria-label="Mostrar contraseña"
              >
                <FiEye className="h-6 w-6" />
              </button>
            </span>
          </label>

          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-3 font-semibold text-gray-500">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-5 w-5 accent-[#0b82df]"
              />
              Recordarme
            </label>
            <button
              type="button"
              onClick={requestPasswordHelp}
              className="font-bold text-[#0b82df]"
            >
              ¿Has olvidado tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={auth.loading}
            className="mt-8 h-16 w-full rounded-xl bg-[#0b82df] text-lg font-bold text-white shadow-[0_18px_34px_rgba(11,130,223,0.28)] transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {auth.loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <div className="my-7 flex items-center gap-4 text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>O continúa con</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => requestPortalAccess("Google")}
            className="flex h-14 w-full items-center justify-center gap-4 rounded-xl border border-gray-200 text-lg font-bold text-[#07133d]"
          >
            <FcGoogle className="h-7 w-7" /> Continuar con Google
          </button>
          <button
            type="button"
            onClick={() => requestPortalAccess("Apple")}
            className="mt-4 flex h-14 w-full items-center justify-center gap-4 rounded-xl border border-gray-200 text-lg font-bold text-[#07133d]"
          >
            <FaApple className="h-7 w-7" /> Continuar con Apple
          </button>
          <p className="mt-7 text-center text-gray-500">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => requestPortalAccess()}
              className="font-bold text-[#0b82df]"
            >
              Regístrate
            </button>
          </p>
        </form>

        <button
          type="button"
          onClick={() => openPhone("900 103 254")}
          className="relative mt-8 flex w-full items-center gap-5 rounded-2xl bg-[#eef7ff] p-5 text-left"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dff0ff] text-[#0b82df]">
            <FiHeadphones className="h-8 w-8" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-[#07133d]">¿Necesitas ayuda?</span>
            <span className="text-gray-500">Estamos aquí para ayudarte.</span>
          </span>
          <span className="font-bold text-[#0b82df]">Contactar</span>
          <FiChevronRight className="h-5 w-5 text-[#0b82df]" />
        </button>
      </section>

      <section className="hidden min-h-[calc(100vh-6rem-96px)] grid-cols-1 overflow-hidden md:grid lg:grid-cols-2">
        <div className="relative hidden items-center justify-center bg-[#eef7ff] lg:flex">
          <div className="absolute left-0 top-16 h-[36rem] w-[52rem] rounded-r-full bg-white/70" />
          <div className="relative flex flex-col items-center">
            <img
              src={piggyImage}
              alt=""
              className="h-[24rem] w-[24rem] object-contain"
            />
            <div className="mt-4 text-center font-['Comic_Sans_MS',cursive] text-4xl leading-tight text-[#0b82df]">
              <p>Tú los conectas,</p>
              <p>nosotros hacemos el resto.</p>
              <div className="mx-auto mt-3 h-1 w-96 rounded-full bg-[#0b82df]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16">
          <form className="w-full max-w-[34rem]" onSubmit={handleSubmit}>
            <h1 className="text-5xl font-bold text-[#07133d]">Bienvenido</h1>
            <p className="mt-3 text-2xl text-gray-500">Inicia sesión para continuar</p>

            <label className="mt-12 flex items-center gap-6">
              <FiUser className="h-12 w-12 shrink-0 text-[#0b82df]" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-20 w-full rounded-[2rem] border border-[#0b82df] px-10 text-xl font-medium uppercase tracking-wide text-[#07133d] outline-none transition placeholder:text-gray-400 hover:bg-[#f8fbff] focus:ring-4 focus:ring-[#0b82df]/15"
                placeholder="Usuario"
                autoComplete="username"
                required
              />
            </label>

            <label className="mt-8 flex items-center gap-6">
              <FiLock className="h-12 w-12 shrink-0 text-[#0b82df]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-20 w-full rounded-[2rem] border border-[#0b82df] px-10 text-xl font-medium uppercase tracking-wide text-[#07133d] outline-none transition placeholder:text-gray-400 hover:bg-[#f8fbff] focus:ring-4 focus:ring-[#0b82df]/15"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </label>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="submit"
                  disabled={auth.loading}
                  className="ml-16 mt-12 flex h-20 w-[28rem] max-w-[calc(100%-4rem)] items-center overflow-hidden rounded-[2rem] bg-[#0b82df] text-2xl font-bold text-white shadow-[0_16px_30px_rgba(11,130,223,0.25)] transition hover:-translate-y-0.5 hover:bg-[#076fc0] hover:shadow-[0_22px_42px_rgba(11,130,223,0.32)] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/20"
                >
                  <span className="ml-2 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0b82df]">
                    <FiUser className="h-9 w-9" />
                  </span>
                  <span className="flex-1 text-center">
                    {auth.loading ? "ENTRANDO..." : "LOG IN"}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Entrar al área de clientes demo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={requestPasswordHelp}
                  className="ml-16 mt-8 rounded-md px-3 py-2 text-lg font-medium text-[#0b82df] transition hover:bg-[#eef6ff] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </TooltipTrigger>
              <TooltipContent>Solicitar recuperación de contraseña</TooltipContent>
            </Tooltip>
          </form>
        </div>
      </section>

      <section className="grid border-t border-gray-200 bg-white px-6 py-8 md:grid-cols-3 md:px-24">
        {[
          { icon: FiShield, title: "Seguridad", text: "Protegemos tu información" },
          { icon: FiHeadphones, title: "Soporte", text: "Estamos para ayudarte" },
          { icon: FiLock, title: "Transparencia", text: "Comprometidos con la confianza" },
        ].map((item) => (
          <div key={item.title} className="flex items-center justify-center gap-5 py-4">
            <item.icon className="h-10 w-10 text-[#07133d]" />
            <div>
              <h2 className="text-xl font-bold text-[#07133d]">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.text}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default LoginPage;
