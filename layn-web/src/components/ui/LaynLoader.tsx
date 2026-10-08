import { useId } from 'react'

interface LaynLoaderProps {
    /** Define o tamanho do container (ex.: "h-40 w-40") */
    className?: string
    glow?: boolean
}

export function LaynLoader({
    className = 'h-52 w-52',
    glow = true,
}: LaynLoaderProps) {
    // useId gera ":r1:"; removo os ":" para o url(#id) ficar seguro
    const uid = useId().replace(/:/g, '')
    const logoGradient = `layn-logo-${uid}`
    const arcGradient = `layn-arc-${uid}`

    return (
        <div
            aria-hidden="true"
            className={`relative flex items-center justify-center ${className}`}
        >
            {glow && (
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sky-500/25 via-indigo-500/20 to-fuchsia-500/25 blur-2xl animate-layn-glow motion-reduce:animate-none motion-reduce:opacity-30" />
            )}

            <svg viewBox="400 400 2200 2200" className="relative h-full w-full" fill="none">
                <defs>
                    <linearGradient id={logoGradient} gradientUnits="userSpaceOnUse" x1="430" y1="300" x2="1600" y2="1560">
                        <stop offset="0" stopColor="#2F9BFF" />
                        <stop offset="0.5" stopColor="#4A4FFF" />
                        <stop offset="1" stopColor="#A745FF" />
                    </linearGradient>

                    <linearGradient id={arcGradient} gradientUnits="userSpaceOnUse" x1="174" y1="-985" x2="766" y2="643">
                        <stop offset="0" stopColor="#2F9BFF" stopOpacity="0" />
                        <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.7" />
                        <stop offset="1" stopColor="#A745FF" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Arco de ~120° + marcações */}
                <g transform="translate(1500 1500)">
                    <path
                        d="M173.7 -984.8 A1000 1000 0 0 1 766 642.8"
                        pathLength="1"
                        strokeDasharray="1"
                        stroke={`url(#${arcGradient})`}
                        strokeWidth="14"
                        strokeLinecap="round"
                        className="animate-layn-draw motion-reduce:animate-none"
                    />

                    {[10, 50, 90, 130].map((deg, i) => (
                        <line
                            key={deg}
                            x1="0"
                            y1={deg === 90 ? -905 : -940}
                            x2="0"
                            y2="-1000"
                            transform={`rotate(${deg})`}
                            stroke="#A5B4FC"
                            strokeWidth={deg === 90 ? 22 : 14}
                            strokeLinecap="round"
                            strokeOpacity={deg === 90 ? 0.75 : 0.4}
                            className="animate-layn-fade motion-reduce:animate-none"
                            style={{ animationDelay: `${700 + i * 150}ms` }}
                        />
                    ))}
                </g>

                {/* Logo */}
                <g transform="translate(489 572)">
                    <g className="animate-layn-logo motion-reduce:animate-none">
                        <path
                            fill={`url(#${logoGradient})`}
                            d="M822 298C836 296 850 296 850 330L850 960C850 1035 822 1100 780 1137L436 1488C426 1496 422 1494 422 1480L422 770C422 540 590 340 822 298Z"
                        />
                        <path
                            fill={`url(#${logoGradient})`}
                            d="M1040 1117L1560 1117C1590 1117 1602 1120 1600 1128C1540 1320 1330 1560 1040 1560L485 1560C455 1560 440 1550 440 1540C440 1535 445 1530 450 1527L800 1205C870 1145 940 1117 1040 1117Z"
                        />
                    </g>
                </g>
            </svg>
        </div>
    )
}