// Internship Topics for Defendr Jobs
// PDF URLs should be added to the pdfUrl field for each topic
export interface InternshipTopic {
  value: string
  label: string
  pdfUrl?: string // URL to the PDF ebook for this topic
}

export const DEFAULT_EBOOK_URL =
  'https://www.canva.com/design/DAG3plH_R_Y/r56DIPVXXT3vTjQcotEVUg/view?utm_content=DAG3plH_R_Y&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'

export const INTERNSHIP_TOPICS: InternshipTopic[] = [
  {
    value: 'web-development',
    label: 'Web Development for DEFENDR',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'web3-blockchain',
    label: 'Web3 Development & Blockchain Architecture',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'intelligent-chatbot-ai',
    label: 'Intelligent Chatbot (AI) Development "Guardian"',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'ai-generative',
    label: 'IA generative for images and blogs',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'admin-dashboard',
    label: 'Admin Dashboard Development',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'community-manager',
    label: 'Community Manager',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'seo',
    label: 'SEO',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'user-experience-optimization',
    label: 'UI UX Designer',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'graphic-designer',
    label: 'Graphic designer',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'business-developer',
    label: 'Business developer',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'marketing-automation',
    label: 'Implementation of a Marketing Automation System',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'cyber-security',
    label: 'Cyber Security',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: '3d-elements',
    label: '3D Elements',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
  {
    value: 'marketing-manager',
    label: 'Marketing Manager',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
]

export const getTopicLabel = (value: string): string => {
  const topic = INTERNSHIP_TOPICS.find(t => t.value === value)
  return topic
    ? topic.label
    : value
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const getTopicPdfUrl = (value: string): string | undefined => {
  const topic = INTERNSHIP_TOPICS.find(t => t.value === value)
  return topic?.pdfUrl
}
