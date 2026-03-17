import type { Metadata } from 'next'
import { getOrganizationById } from '@/services/organizationService'

type OrganizationLayoutProps = {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: OrganizationLayoutProps): Promise<Metadata> {
  const { id } = await params
  const organization = await getOrganizationById(id)

  if (!organization) {
    return {
      title: 'Organization Not Found',
    }
  }

  return {
    title: `${organization.name} — Esports Organization`,
    description: `Official profile of ${organization.name} on DEFENDR.GG. Explore their tournaments, teams, and esports achievements.`,
    openGraph: {
      title: `${organization.name} | DEFENDR.GG`,
      description: `Follow ${organization.name} for the latest esports tournaments and news. Connect with them on DEFENDR.GG.`,
      images: [
        {
          url:
            organization.profileImage ||
            'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
