type FooterLink = {
    label: string;
    href?: string;
};

type FooterColumn = {
    title: string;
    links: FooterLink[];
};

type FooterProps = {
    brand?: string;
    email?: string;
    phone?: string;
    columns?: FooterColumn[];
    year?: number;
};

export default function Footer({
                                   brand = "VisionWeb",
                                   email = "contact@vision-web.fr",
                                   phone = "06 06 06 06 06",
                                   year = new Date().getFullYear(),
                                   columns = [
                                       {
                                           title: "Service",
                                           links: [
                                               { label: "Site Vitrine et e-commerce", href: "#" },
                                               { label: "Dev web sur mesure", href: "#" },
                                               { label: "Referencement naturel (SEO)", href: "#" },
                                               { label: "Création de maquette web", href: "#" },
                                           ],
                                       },
                                       {
                                           title: "Technologie",
                                           links: [
                                               { label: "Site Vitrine et e-commerce", href: "#" },
                                               { label: "Dev web sur mesure", href: "#" },
                                               { label: "Referencement naturel (SEO)", href: "#" },
                                               { label: "Création de maquette web", href: "#" },
                                           ],
                                       },
                                       {
                                           title: "A propos",
                                           links: [
                                               { label: "Site Vitrine et e-commerce", href: "#" },
                                               { label: "Dev web sur mesure", href: "#" },
                                               { label: "Referencement naturel (SEO)", href: "#" },
                                               { label: "Création de maquette web", href: "#" },
                                           ],
                                       },
                                   ],
                               }: FooterProps) {
    return (
        <footer className="bg-gradient-to-b from-[#FAFAF8] to-[rgba(183,196,255,0.42)]  px-6 lg:px-16 py-16">
            {/* top */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-14">
                {/* Left brand block */}
                <div>
                    <div className="text-4xl font-extrabold tracking-tight text-[#0b0b0b]">
                        {brand}
                    </div>

                    <div className="mt-3 text-lg font-semibold text-[#0b0b0b]">
                        {email}
                    </div>

                    <div className="mt-1 text-2xl font-bold text-[#0b0b0b]">{phone}</div>
                </div>

                {/* Columns */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {columns.map((col) => (
                        <div key={col.title}>
                            <div className="text-xl font-extrabold text-[#0b0b0b]">
                                {col.title}
                            </div>

                            <ul className="mt-6 space-y-4">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href ?? "#"}
                                            className="text-base text-[#0b0b0b]/80 hover:text-[#091E79] transition-colors"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* divider */}
            <div className="max-w-7xl mx-auto mt-14 border-t border-black/20" />

            {/* bottom */}
            <div className="max-w-7xl mx-auto mt-10 flex items-center justify-end">
                <div className="text-sm font-semibold text-[#0b0b0b]/80">
                    @{year} {brand.toUpperCase()}. Tous droits réservés
                </div>
            </div>
        </footer>
    );
}
