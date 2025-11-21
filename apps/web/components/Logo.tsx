import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      {/* Logo Image - Clickable, returns to home */}
      <div className="relative w-50 h-50 lg:w-65 lg:h-65 flex-shrink-0">
        <Image
          src="/logo final - negro.png"
          alt="Spectra Logo"
          width={144}
          height={144}
          className="w-full h-full object-contain transition-opacity group-hover:opacity-80"
          priority
        />
      </div>
    </Link>
  )
}

