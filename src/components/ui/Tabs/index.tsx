import React, { useState, ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TabItem {
  key: string
  label: string
  href?: string
  content?: ReactNode
}

interface TabsProps {
  items: TabItem[]
  activeKey?: string
  className?: string
  onChange?: (key: string) => void
  tabClassName?: string
  activeTabClassName?: string
  contentClassName?: string
  tabsContainerClassName?: string
  useRouting?: boolean
  baseUrl?: string
}

const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  className,
  onChange,
  tabClassName,
  activeTabClassName,
  contentClassName,
  tabsContainerClassName,
  useRouting = false,
  baseUrl = '',
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<string>(activeKey || items[0]?.key || '')

  // If using routes and no active key is provided, determine from pathname
  useEffect(() => {
    if (useRouting) {
      // Find the most specific match for the current path
      const currentPath = pathname

      // Check for exact matches first
      const exactMatch = items.find(item => item.href && currentPath === item.href)

      if (exactMatch) {
        setActiveTab(exactMatch.key)
        if (onChange && activeTab !== exactMatch.key) {
          onChange(exactMatch.key)
        }
        return
      }

      // If no exact match, find based on path segments
      // Extract the last segment of the path for matching
      const pathSegments = currentPath.split('/')
      const lastSegment = pathSegments[pathSegments.length - 1]
      const secondLastSegment = pathSegments[pathSegments.length - 2]

      // Try to match the tab based on path structure
      const matchingTab = items.find(item => {
        if (!item.href) {
          return false
        }

        // For tournament routes, match based on the last segment of the path
        // e.g., /tournament/[id]/prizes should match the tab with href ending in /prizes
        const itemSegments = item.href.split('/')
        const itemLastSegment = itemSegments[itemSegments.length - 1]

        return (
          lastSegment === itemLastSegment ||
          (lastSegment === secondLastSegment && itemLastSegment === '') // For root path
        )
      })

      if (matchingTab) {
        setActiveTab(matchingTab.key)
        if (onChange && activeTab !== matchingTab.key) {
          onChange(matchingTab.key)
        }
      } else if (items.length > 0) {
        // If no match found, use the overview tab as default for tournament pages
        const defaultTab = items.find(item => item.key === 'overview') || items[0]
        setActiveTab(defaultTab.key)
      }
    } else if (activeKey) {
      setActiveTab(activeKey)
    }
  }, [activeKey, items, pathname, useRouting, baseUrl, onChange, activeTab])

  const handleTabClick = (key: string, href?: string) => {
    if (useRouting && href) {
      router.push(`${baseUrl}${href}`)
    }

    if (activeTab !== key) {
      setActiveTab(key)
      if (onChange) {
        onChange(key)
      }
    }
  }

  const renderTabContent = () => {
    const activeItem = items.find(item => item.key === activeTab)
    return <div className={cn('mt-4', contentClassName)}>{activeItem?.content}</div>
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('flex border-b border-[#343A40] overflow-x-auto', tabsContainerClassName)}>
        {items.map(item => {
          const isActive = activeTab === item.key
          const tabElement = (
            <Button
              key={item.key}
              className={cn(
                'px-4 py-2 font-medium focus:outline-none',
                isActive
                  ? cn('text-white font-semibold border-b-2 border-[#D62555]', activeTabClassName)
                  : 'hover:text-[#D62555] border-transparent text-gray-500',
                tabClassName,
              )}
              fontFamily={'poppins'}
              label={item.label}
              style={{
                borderRadius: '145.937px',
                border: isActive ? '2.5px solid #D62555' : 'none',
                backgroundColor: isActive ? 'rgba(214, 39, 85, 0.38)' : '#343A40',
                width: '100%',
                height: 'auto',
                minWidth: 'fit-content',
              }}
              onClick={() => handleTabClick(item.key, item.href)}
            />
          )

          return useRouting && item.href ? (
            <Link key={item.key} className="focus:outline-none" href={`${baseUrl}${item.href}`}>
              {tabElement}
            </Link>
          ) : (
            tabElement
          )
        })}
      </div>
      {!useRouting && renderTabContent()}
    </div>
  )
}

export default Tabs
