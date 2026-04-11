import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Oauth from '../Components/Oauth'

function SignUp() {
  const navigate = useNavigate()
  const [formdata, setformData] = useState({ username: '', email: '', password: '' })

  const handleChange = (e) => {
    setformData({ ...formdata, [e.target.id]: e.target.value.trim() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, email, password } = formdata
    if (!username || !email || !password) {
      return toast.error('Lütfen bütün alanları doldurun')
    }
    try {
      const res = await fetch('/server/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      })
      const data = await res.json()
      if (data.success === false) {
        return toast.error(data.message)
      }
      if (res.ok) {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.')
        navigate('/sign-in')
      }
    } catch (error) {
      toast.error(error?.message ?? 'Kayıt olunamadı.')
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
            Yeni hesap oluşturun
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Kullanıcı adı */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-[11px] font-bold tracking-widest uppercase
                           text-stone-400 dark:text-stone-500"
              >
                Kullanıcı adı
              </label>
              <input
                id="username"
                type="text"
                placeholder="kullanici_adi"
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

            {/* Kayıt Ol butonu */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide
                         text-white transition-all duration-200
                         bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600
                         shadow-lg shadow-emerald-500/40
                         hover:shadow-xl hover:shadow-emerald-500/50 hover:brightness-110 hover:-translate-y-0.5
                         active:translate-y-0 active:brightness-95
                         dark:shadow-emerald-500/20 dark:hover:shadow-emerald-500/40"
            >
              Kayıt Ol
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

          {/* Bilgi notu */}
          <p className="text-center text-[11px] mt-5 leading-relaxed
                        text-stone-400 dark:text-stone-600">
            Hesabınızın aktif olması için yönetici onayı gereklidir.
          </p>

          {/* Footer */}
          <p className="text-center text-xs mt-3
                        text-stone-400 dark:text-stone-500">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/sign-in"
              className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Giriş yap
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignUp