import { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
    >
        <path
            fill="currentColor"
            d="m5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8z"
        />
    </svg>
);

const TruckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
    >
        <path
            fill="currentColor"
            d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5z"
        />
    </svg>
);

const SubscriptionIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22px"
        height="22px"
        viewBox="0 0 14 14"
    >
        <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
        >
            <path d="M8.351 5.307a1.17 1.17 0 0 0-1.1-.778h-.903a1.041 1.041 0 0 0-.223 2.059l1.375.3a1.167 1.167 0 0 1-.25 2.307h-.777c-.508 0-.94-.324-1.1-.777m1.489-3.889V3.362m0 7V9.196m-4.864 4.303v-2.5h2.5" />
            <path d="M13.388 5.804a6.5 6.5 0 0 1-11.39 5.35M.612 8.196a6.5 6.5 0 0 1 11.39-5.35" />
            <path d="M12.002.502v2.5h-2.5" />
        </g>
    </svg>
);

const LilyIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22px"
        height="22px"
        viewBox="0 0 24 24"
    >
        <path
            fill="currentColor"
            d="M4.5 17.27q-.213 0-.356-.145T4 16.768t.144-.356t.356-.143h15q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h15q.213 0 .356.144t.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.143Q4 7.443 4 7.23t.144-.356t.356-.143h15q.213 0 .356.144T20 7.23t-.144.356t-.356.144z"
        />
    </svg>
);

export default function Welcome() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('voitures');

    // Refs pour les animations
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroTextRef = useRef<HTMLParagraphElement>(null);
    const heroBoxRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLImageElement>(null);
    const selectionSectionRef = useRef<HTMLDivElement>(null);
    const selectionTitleRef = useRef<HTMLDivElement>(null);
    const vehicleCardsRef = useRef<HTMLDivElement>(null);
    const subscriptionSectionRef = useRef<HTMLElement>(null);
    const subscriptionTitleRef = useRef<HTMLDivElement>(null);
    const pricingCardsRef = useRef<HTMLDivElement>(null);
    const contactSectionRef = useRef<HTMLElement>(null);

    const tabs = [
        { id: 'voitures', label: 'Voitures', icon: CarIcon },
        { id: 'utilitaires', label: 'Utilitaires', icon: TruckIcon },
        { id: 'abonnement', label: 'Abonnement', icon: SubscriptionIcon },
    ];

    const navItems = ['Aide', 'À propos', 'Voitures', 'Réservation'];

    // Animations GSAP
    useEffect(() => {
        // Petit délai pour s'assurer que le DOM est prêt
        const timer = setTimeout(() => {
            // Animation hero section
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            
            if (heroTitleRef.current) {
                tl.fromTo(heroTitleRef.current, 
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1 }
                );
            }

            if (heroTextRef.current) {
                tl.fromTo(heroTextRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    '-=0.6'
                );
            }

            if (heroBoxRef.current) {
                tl.fromTo(heroBoxRef.current,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    '-=0.5'
                );
            }

            if (heroImageRef.current) {
                tl.fromTo(heroImageRef.current,
                    { opacity: 0, x: 100 },
                    { opacity: 1, x: 0, duration: 1.2 },
                    '-=0.8'
                );
            }

            // Animation section "Notre sélection"
            if (selectionTitleRef.current && selectionTitleRef.current.children.length > 0) {
                gsap.fromTo(selectionTitleRef.current.children,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: selectionTitleRef.current,
                            start: 'top 80%',
                        },
                        stagger: 0.2,
                        duration: 1,
                        ease: 'power3.out',
                    }
                );
            }

            if (vehicleCardsRef.current && vehicleCardsRef.current.children.length > 0) {
                gsap.fromTo(vehicleCardsRef.current.children,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: vehicleCardsRef.current,
                            start: 'top 85%',
                        },
                        stagger: 0.15,
                        duration: 0.8,
                        ease: 'power2.out',
                    }
                );
            }

            // Animation section "Abonnement"
            if (subscriptionTitleRef.current && subscriptionTitleRef.current.children.length > 0) {
                gsap.fromTo(subscriptionTitleRef.current.children,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: subscriptionTitleRef.current,
                            start: 'top 80%',
                        },
                        stagger: 0.2,
                        duration: 1,
                        ease: 'power3.out',
                    }
                );
            }

            if (pricingCardsRef.current && pricingCardsRef.current.children.length > 0) {
                gsap.fromTo(pricingCardsRef.current.children,
                    { opacity: 0, y: 60, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        scrollTrigger: {
                            trigger: pricingCardsRef.current,
                            start: 'top 85%',
                        },
                        stagger: 0.2,
                        duration: 0.8,
                        ease: 'back.out(1.2)',
                    }
                );
            }

            // Animation section contact
            if (contactSectionRef.current && contactSectionRef.current.children[0]) {
                gsap.fromTo(contactSectionRef.current.children[0],
                    { opacity: 0, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        scrollTrigger: {
                            trigger: contactSectionRef.current,
                            start: 'top 80%',
                        },
                        duration: 1,
                        ease: 'power3.out',
                    }
                );
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const getNavLink = (item: string) => {
        if (item === 'Voitures') return '/catalogue';
        if (item === 'Réservation') return '/my-bookings';
        return '#';
    };

    // ---- Section "Notre sélection" (pills + cards) ----
    const [vehicleFilter, setVehicleFilter] = useState('Premium');
    const vehicleFilters = ['Premium', 'SUV', 'Berline', 'Coupe', 'Autres'];

    const cards = [
        {
            title: 'CLIO V',
            type: 'Berline',
            seats: '5 places',
            doors: '4 portes',
            price: '40$',
            unit: '/jour',
            img: '/clio.png',
        },
        {
            title: 'CLIO V',
            type: 'Berline',
            seats: '5 places',
            doors: '4 portes',
            price: '40$',
            unit: '/jour',
            img: '/clio.png',
        },
        {
            title: 'CLIO V',
            type: 'Berline',
            seats: '5 places',
            doors: '4 portes',
            price: '40$',
            unit: '/jour',
            img: '/clio.png',
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
            <nav className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-black/5 bg-[#FAFAF8]/90 px-6 backdrop-blur lg:px-16">
                {/* LEFT : burger + logo */}
                <div className="flex items-center gap-3">
                    <button
                        className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#091E79] hover:border-[#091E79] hover:text-[#091E79]"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        <span>
                            <LilyIcon />
                        </span>
                    </button>

                    <a
                        href="/"
                        className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a]"
                    >
                        Lyla<span className="text-[#091E79]">Mobility</span>
                    </a>
                </div>

                {/* RIGHT : navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href={getNavLink(item)}
                            className="text-sm tracking-wide text-[#555] transition-colors hover:text-[#091E79]"
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="/login"
                        className="rounded-full bg-[#1a1a1a] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#091E79]"
                    >
                        Connexion
                    </a>
                </div>
            </nav>

            {/* ── MENU DÉROULANT (mobile + desktop) ── */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col border-b border-black/5 bg-white shadow-lg">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href={getNavLink(item)}
                            className="border-b border-black/5 px-6 py-4 text-sm text-[#333] transition-colors hover:bg-[#091E79]/5 hover:text-[#091E79] lg:px-16"
                            onClick={() => setMenuOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    <div className="px-6 py-4 lg:px-16">
                        <a
                            href="#"
                            className="block rounded-full bg-[#091E79] px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#071660]"
                            onClick={() => setMenuOpen(false)}
                        >
                            Connexion
                        </a>
                    </div>
                </div>
            </div>

            {/* ── HERO ── */}
            <section className="grid min-h-[calc(100vh-70px)] flex-1 grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
                {/* LEFT — avec padding */}
                <div className="z-10 flex flex-col gap-6 px-6 py-12 lg:px-16 lg:py-0">
                    <h1 ref={heroTitleRef} className="font-serif text-5xl leading-[1.08] font-bold tracking-tight text-[#1a1a1a] lg:text-6xl">
                        Louez des voitures
                        <br />
                        carrément{' '}
                        <span className="text-[#091E79] italic">belles.</span>
                    </h1>

                    <p ref={heroTextRef} className="max-w-md text-base leading-relaxed font-light text-[#666]">
                        Des modèles d'exception disponibles en quelques clics.
                        Livraison à domicile, kilométrage illimité.
                    </p>

                    {/* BOOKING BOX */}
                    <div ref={heroBoxRef} className="flex max-w-2xl flex-col gap-5 rounded-2xl border border-[#E9E9E9] bg-[#F9F9F9] p-6 shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
                        {/* Tabs */}
                        <div className="flex flex-wrap items-center gap-2">
                            {tabs.map((t) => {
                                const IconComponent = t.icon;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTab(t.id)}
                                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                                            activeTab === t.id
                                                ? 'border-[#091E79] bg-[#091E79] text-white'
                                                : 'border-black/10 bg-transparent text-[#555] hover:border-[#091E79] hover:text-[#091E79]'
                                        }`}
                                    >
                                        <IconComponent />
                                        {t.label}
                                    </button>
                                );
                            })}
                            <a
                                href="#"
                                className="ml-auto hidden text-xs font-medium whitespace-nowrap text-[#091E79] transition-opacity hover:opacity-60 sm:block"
                            >
                                Voir / modifier ma réservation →
                            </a>
                        </div>

                        {/* Lieu */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[0.7rem] font-semibold tracking-widest text-[#999] uppercase">
                                Retrait et retour
                            </label>
                            <input
                                type="text"
                                placeholder="Lieu de prise en charge"
                                className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#bbb] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[0.7rem] font-semibold tracking-widest text-[#999] uppercase">
                                    Date de départ
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[0.7rem] font-semibold tracking-widest text-[#999] uppercase">
                                    Date de retour
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] transition outline-none focus:border-[#091E79] focus:ring-2 focus:ring-[#091E79]/10"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <a
                            href="/catalogue"
                            className="w-full rounded-xl bg-[#091E79] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#071660]"
                        >
                            Voir les véhicules
                        </a>
                    </div>
                </div>

                {/* RIGHT — flush right, 0 marge, cachée en mobile */}
                <div className="relative hidden h-full lg:block">
                    {/* Glow */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
                        <div className="-mr-20 h-[500px] w-[500px] rounded-full bg-[#091E79]/10 blur-3xl" />
                    </div>

                    {/* Image collée à droite */}
                    <img
                        ref={heroImageRef}
                        src="/mercedes.png"
                        alt="Mercedes"
                        className="absolute top-1/2 right-0 h-auto w-full max-w-[720px] -translate-y-1/2 object-contain drop-shadow-2xl"
                    />
                </div>
            </section>

            <section ref={selectionSectionRef} className="bg-[#FAFAF8] px-6 py-20 lg:px-16">
                {/* Headings */}
                <div ref={selectionTitleRef} className="mx-auto max-w-5xl text-center">
                    <p className="text-sm tracking-wide text-[#091E79]/70">
                        Nos Véhicules de location
                    </p>

                    <h2 className="mt-3 font-serif text-5xl font-bold tracking-tight text-[#0f0f0f] lg:text-6xl">
                        Notre Sélection de véhicule
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed font-light text-[#666]">
                        Des modèles d&apos;exception disponibles en quelques
                        clics. Livraison <br className="hidden sm:block" />à
                        domicile, kilométrage illimité.
                    </p>

                    {/* Pills */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        {vehicleFilters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setVehicleFilter(f)}
                                className={`h-10 rounded-full border px-8 text-sm font-semibold transition ${
                                    vehicleFilter === f
                                        ? 'border-[#091E79] bg-[#091E79] text-white'
                                        : 'border-transparent bg-[#EDEDED] text-[#111] hover:bg-[#e6e6e6]'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div ref={vehicleCardsRef} className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-3">
                    {cards.map((c, idx) => (
                        <VehicleCard key={`${c.title}-${idx}`} {...c} />
                    ))}
                </div>

                {/* Bottom link */}
                <div className="mt-16 text-center">
                    <a
                        href="/catalogue"
                        className="inline-flex items-center gap-2 text-lg font-medium text-[#091E79] transition hover:opacity-70"
                    >
                        Voir Plus <span aria-hidden>→</span>
                    </a>
                </div>
            </section>

            <section ref={subscriptionSectionRef} className="bg-[#FAFAF8] px-6 py-20 lg:px-16">
                {/* Headings */}
                <div ref={subscriptionTitleRef} className="mx-auto max-w-5xl text-center">
                    <h2 className="font-serif text-5xl font-bold tracking-tight text-[#0f0f0f] lg:text-6xl">
                        Notre Service d'Abonnement
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed font-light text-[#666]">
                        Des modèles d&apos;exception disponibles en quelques
                        clics. Livraison <br className="hidden sm:block" />à
                        domicile, kilométrage illimité.
                    </p>
                </div>

                {/*
    Données (tu modifies les textes/prix ici)
  */}
                {(() => {
                    const plans = [
                        {
                            name: 'Pack Gold',
                            desc: "Des modèles d'exception disponibles en quelques clics. Livraison à domicile, kilométrage illimité.",
                            price: '$50',
                            period: '/month',
                            features: [
                                'Fully responsive Webflow template',
                                'UX-optimized page layouts',
                                'CMS + Figma file included',
                                'SEO-ready structure',
                                'Email support included',
                            ],
                            popular: false,
                        },
                        {
                            name: 'Pack Gold',
                            desc: "Des modèles d'exception disponibles en quelques clics. Livraison à domicile, kilométrage illimité.",
                            price: '$50',
                            period: '/month',
                            features: [
                                'Fully responsive Webflow template',
                                'UX-optimized page layouts',
                                'CMS + Figma file included',
                                'SEO-ready structure',
                                'Email support included',
                            ],
                            popular: true,
                        },
                        {
                            name: 'Pack Gold',
                            desc: "Des modèles d'exception disponibles en quelques clics. Livraison à domicile, kilométrage illimité.",
                            price: '$50',
                            period: '/month',
                            features: [
                                'Fully responsive Webflow template',
                                'UX-optimized page layouts',
                                'CMS + Figma file included',
                                'SEO-ready structure',
                                'Email support included',
                            ],
                            popular: false,
                        },
                    ];

                    const CheckIcon = () => (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="shrink-0"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity="0.9"
                            />
                            <path
                                d="M8.7 12.2l2.1 2.1 4.8-5.2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    );

                    return (
                        <div ref={pricingCardsRef} className="mx-auto mt-16 grid max-w-6xl grid-cols-1 items-end gap-10 lg:grid-cols-3 lg:gap-12">
                            {plans.map((p, idx) => (
                                <div
                                    key={`${p.name}-${idx}`}
                                    className={`overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.06)] ${p.popular ? 'lg:-translate-y-4' : ''} `}
                                >
                                    {/* top gradient */}
                                    <div className="bg-gradient-to-b from-[rgba(183,196,255,0.55)] to-[rgba(255,255,255,0.0)] px-8 pt-8 pb-7">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="text-3xl leading-none">
                                                🏆
                                            </div>

                                            {p.popular ? (
                                                <span className="inline-flex h-9 items-center rounded-full bg-[#091E79] px-6 text-sm font-semibold text-white">
                                                    Populaire
                                                </span>
                                            ) : null}
                                        </div>

                                        <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-[#0b0b0b]">
                                            {p.name}
                                        </h3>
                                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#666]">
                                            {p.desc}
                                        </p>

                                        <div className="mt-6 flex items-end gap-2">
                                            <span className="text-4xl font-extrabold text-[#0b0b0b]">
                                                {p.price}
                                            </span>
                                            <span className="pb-1 text-sm font-medium text-[#9aa0b5]">
                                                {p.period}
                                            </span>
                                        </div>
                                    </div>

                                    {/* features */}
                                    <div className="px-8 pb-8">
                                        <ul className="mt-2 space-y-4 text-sm text-[#6b6f7b]">
                                            {p.features.map((f) => (
                                                <li
                                                    key={f}
                                                    className="flex items-center gap-3"
                                                >
                                                    <span className="text-[#091E79]">
                                                        <CheckIcon />
                                                    </span>
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            className={`mt-8 h-11 w-full rounded-xl text-sm font-semibold transition ${p.popular ? 'bg-[#091E79] text-white hover:bg-[#071660]' : 'bg-[#091E79] text-white hover:bg-[#071660]'} `}
                                            type="button"
                                        >
                                            Choisir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </section>

            {/* ── SECTION : Contactez-Nous ── */}
            <section ref={contactSectionRef} className="bg-[#FAFAF8] px-6 py-20 lg:px-16">
                <div className="mx-auto max-w-7xl rounded-[32px] bg-[#3B4A93] px-10 py-20 text-center text-white">
                    <h2 className="font-serif text-5xl font-bold tracking-tight lg:text-6xl">
                        Contactez-Nous
                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80 lg:text-xl">
                        Des modèles d&apos;exception disponibles en quelques
                        clics. Livraison
                        <br className="hidden sm:block" />à domicile,
                        kilométrage illimité.
                    </p>

                    <div className="mt-14 flex justify-center">
                        <button className="rounded-2xl bg-white px-16 py-4 text-lg font-semibold text-[#3B4A93] transition hover:bg-gray-100">
                            Nous contacter
                        </button>
                    </div>
                </div>
            </section>
            <Footer
                brand="VisionWeb"
                email="contact@vision-web.fr"
                phone="06 06 06 06 06"
            />
        </div>
    );
}
