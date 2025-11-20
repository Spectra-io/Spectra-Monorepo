import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      {/* Logo Image - Clickable, returns to home */}
      <div className="relative w-50 h-50 lg:w-60 lg:h-60   flex-shrink-0">
        <Image
          src="/logo final - negro.png"
          alt="Spectra Logo"
          width={112}
          height={112}
          className="w-full h-full object-contain transition-opacity group-hover:opacity-80"
          priority
        />
      </div>
    </Link>
  )
}

