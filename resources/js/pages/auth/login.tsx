import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Connexion" />
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block">
                            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1a1a1a]">
                                Lyla
                                <span className="text-[#091E79]">Mobility</span>
                            </h1>
                        </Link>
                        <p className="mt-2 text-sm text-[#666]">
                            Connectez-vous à votre compte
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="bg-white rounded-2xl border border-black/10 shadow-lg p-8">
                        <form onSubmit={submit} className="space-y-6">
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
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
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
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                        className="rounded border-black/10 text-[#091E79] focus:ring-[#091E79]"
                                    />
                                    <span className="ml-2 text-sm text-[#666]">
                                        Se souvenir de moi
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-[#091E79] hover:opacity-70 transition"
                                    >
                                        Mot de passe oublié?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-[#091E79] py-3.5 text-sm font-medium text-white transition hover:bg-[#071660] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-[#666]">
                                Pas encore de compte?{' '}
                                <Link
                                    href="/register"
                                    className="font-medium text-[#091E79] hover:opacity-70 transition"
                                >
                                    Créer un compte
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
