import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Inscription" />
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block">
                            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1a1a1a]">
                                Lyla<span className="text-[#091E79]">Mobility</span>
                            </h1>
                        </Link>
                        <p className="mt-2 text-sm text-[#666]">Créez votre compte</p>
                    </div>

                    {/* Register Form */}
                    <div className="bg-white rounded-2xl border border-black/10 shadow-lg p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                                >
                                    Nom complet
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#999] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    autoComplete="name"
                                    placeholder="Jean Dupont"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#999] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    autoComplete="username"
                                    placeholder="votre@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                                >
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#999] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-[#1a1a1a] mb-2"
                                >
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#999] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-[#091E79] py-3.5 text-sm font-medium text-white transition hover:bg-[#071660] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Création...' : 'Créer mon compte'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-[#666]">
                                Déjà un compte?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-[#091E79] hover:opacity-70 transition"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-[#666] hover:text-[#091E79] transition"
                        >
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
