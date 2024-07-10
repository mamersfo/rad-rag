'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Tabs() {
  const pathname = usePathname()

  const sections = [
    ['Completion', '/protected/completion'],
    ['Documents', '/protected/documents'],
    ['Search', '/protected/search'],
    ['Generate', '/protected/generate'],
  ]

  return (
    <div role='tablist' className='tabs tabs-bordered w-96'>
      {sections.map(([section, path]) => (
        <Link
          key={`tab-${section}`}
          href={path}
          role='tab'
          className={clsx('tab', { 'tab-active': pathname === path })}
        >
          {section}
        </Link>
      ))}
    </div>
  )
}
