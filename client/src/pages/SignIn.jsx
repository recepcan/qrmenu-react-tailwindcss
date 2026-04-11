import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../store/userSlice'
import { toast } from 'react-toastify'
import Oauth from '../Components/Oauth'

function SignIn() {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.user)
  const navigate = useNavigate()

  // formdata'yı ref ile de takip ediyoruz — autofill onChange'i tetiklemediğinde
  // input'ların gerçek değerini ref üzerinden okuyoruz
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const [formdata, setformData] = useState({ email: '', password: '' })

  // Tarayıcı autofill'i bazen onChange'i geciktirerek tetikler.
  // useEffect ile kısa bir süre sonra ref'ten okuyarak state'i senkronize ediyoruz.
  useEffect(() => {
    const timer = setTimeout(() => {
      const email = emailRef.current?.value ?? ''
      const password = passwordRef.current?.value ?? ''
      if (email || password) {
        setformData({ email, password })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    setformData(prev => ({ ...prev, [e.target.id]: e.target.value.trim() }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Submit anında ref'ten de oku — autofill state'e yansımamış olabilir
    const email = formdata.email || emailRef.current?.value?.trim() || ''
    const password = formdata.password || passwordRef.current?.value?.trim() || ''

    if (!email || !password) {
      return toast.error('Lütfen bütün alanları doldurun')
    }

    try {
      dispatch(signInStart())
      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return toast.error(data.message)
      }
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/panel')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
      toast.error(error?.message ?? 'Giriş yapılamadı.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12
                    bg-white dark:bg-[#0d1117]
                    transition-colors duration-300">

      {/* Ambient glow — sadece dark modda görünür */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full
                        dark:bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full
                        dark:bg-teal-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Kart */}
        <div className="rounded-2xl border p-8 shadow-xl
                        bg-white border-stone-200 shadow-stone-100
                        dark:bg-white/[0.04] dark:border-white/[0.08] dark:shadow-black/40
                        dark:backdrop-blur-md">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="bg-gradient-to-br from-emerald-400 to-teal-600
                             text-white font-extrabold text-lg px-3 py-1.5 rounded-xl
                             shadow-lg shadow-emerald-500/30">
              qr
            </span>
            <span className="font-bold text-2xl tracking-tight
                             text-stone-900 dark:text-stone-100">
              menu
            </span>
          </div>

          <p className="text-center text-sm mb-8 mt-1
                        text-stone-400 dark:text-stone-500">
            Hesabınıza giriş yapın
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* E-posta */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-bold tracking-widest uppercase
                           text-stone-400 dark:text-stone-500"
              >
                E-posta
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="ornek@email.com"
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none
                           transition-all duration-200
                           bg-stone-50 border border-stone-200 text-stone-800
                           placeholder:text-stone-300
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                           dark:bg-white/5 dark:border-white/10 dark:text-stone-100
                           dark:placeholder:text-stone-600
                           dark:focus:border-emerald-400/60 dark:focus:ring-emerald-400/10"
              />
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold tracking-widest uppercase
                           text-stone-400 dark:text-stone-500"
              >
                Şifre
              </label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none
                           transition-all duration-200
                           bg-stone-50 border border-stone-200 text-stone-800
                           placeholder:text-stone-300
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                           dark:bg-white/5 dark:border-white/10 dark:text-stone-100
                           dark:placeholder:text-stone-600
                           dark:focus:border-emerald-400/60 dark:focus:ring-emerald-400/10"
              />
            </div>

            {/* Giriş Yap butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide
                         text-white transition-all duration-200
                         bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600
                         shadow-lg shadow-emerald-500/40
                         hover:shadow-xl hover:shadow-emerald-500/50 hover:brightness-110 hover:-translate-y-0.5
                         active:translate-y-0 active:brightness-95
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         dark:shadow-emerald-500/20 dark:hover:shadow-emerald-500/40"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {/* Ayraç */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200 dark:bg-white/10" />
            <span className="text-[10px] font-bold tracking-widest uppercase
                             text-stone-300 dark:text-stone-600">
              ya da
            </span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-white/10" />
          </div>

          {/* Google OAuth */}
          <Oauth />

          {/* Footer */}
          <p className="text-center text-xs mt-6
                        text-stone-400 dark:text-stone-500">
            Hesabınız yok mu?{' '}
            <Link
              to="/sign-up"
              className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Kayıt ol
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignIn