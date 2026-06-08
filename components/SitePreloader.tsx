'use client'

import { usePathname } from 'next/navigation'
import {
  PixelWipePreloader,
  type PixelWipePreloaderProps,
} from '@/components/PixelWipePreloader'

export function SitePreloader(props: PixelWipePreloaderProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return <PixelWipePreloader {...props} disabled={!isHome} />
}
