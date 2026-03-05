type VehicleCardProps = {
    title: string;
    type: string;
    seats: string;
    doors: string;
    price: string;
    unit?: string;
    img: string;

    infoHref?: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
};

export default function VehicleCard({
                                        title,
                                        type,
                                        seats,
                                        doors,
                                        price,
                                        unit = "/jour",
                                        img,
                                        infoHref = "#",
                                        ctaLabel = "Reserver",
                                        onCtaClick,
                                    }: VehicleCardProps) {
    return (
        <div className="rounded-2xl overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-black/5">
            {/* Image zone */}
            <div className="bg-[#F6F6F6] p-10 flex items-center justify-center">
                <img
                    src={img}
                    alt={title}
                    className="w-[85%] max-w-[320px] h-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.12)]"
                />
            </div>

            {/* Bottom info (gradient) */}
            <div className="bg-gradient-to-b from-[#F5F5F5] to-[rgba(183,196,255,0.42)] px-7 py-6">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b0b0b]">
                            {title}
                        </h3>
                        <p className="mt-1 text-sm text-[#111]">{type}</p>
                    </div>

                    <div className="text-right">
                        <div className="flex items-end justify-end gap-1">
              <span className="text-2xl font-extrabold text-[#0b0b0b]">
                {price}
              </span>
                            <span className="text-xs font-semibold text-[#0b0b0b]/80">
                {unit}
              </span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 text-sm text-[#111]/80 leading-snug">
                    <p>
                        {seats}, {doors}
                    </p>
                    <p>kilométrage illimité disponible</p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <a
                        href={infoHref}
                        className="text-xs font-semibold text-[#091E79] hover:opacity-70 transition"
                    >
                        Plus d&apos;info →
                    </a>

                    <button
                        type="button"
                        onClick={onCtaClick}
                        className="h-9 px-6 rounded-lg bg-[#091E79] text-white text-sm font-semibold hover:bg-[#071660] transition"
                    >
                        {ctaLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
