import { Container } from 'src/components/ui/container'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Text } from 'src/components/ui/text'

type PrivacyData = {
  subheading: string
  body: string
  list?: string[]
}[]

const Data: PrivacyData = [
  {
    subheading: 'Introduction',
    body: 'This Privacy Policy describes how the Catfish Farm Management System (CFMS) collects, uses, and protects the personal information of our users, including farmers, cluster managers, and system administrators. We are committed to protecting your privacy and ensuring the security of your data while providing you with the best possible farming management experience.',
  },
  {
    subheading: 'What Data We Collect',
    body: 'We collect the following types of information to provide our services:',
    list: [
      'Personal Information: Name, email address, phone number, and profile details',
      'Farm and Pond Data: Pond specifications, stocking records, feeding schedules, water quality measurements, and harvest data',
      'Location Data: GPS coordinates for pond locations to enable mapping and location-based features',
      'System Activity: Usage logs, feature interactions, and system performance data',
      'Communication Records: Support requests, feedback, and correspondence with our team',
    ],
  },
  {
    subheading: 'How We Use Your Data',
    body: 'Your data is used exclusively for the following purposes:',
    list: [
      'Farm Management: To support comprehensive tracking of your aquaculture activities, including pond management, feeding schedules, and harvest planning',
      'Reporting and Analytics: To generate detailed reports and insights for farmers, cluster managers, and project stakeholders',
      'System Improvement: To analyze usage patterns and improve user experience and system performance',
      'Communication: To send important updates, notifications, and support communications',
      'Compliance: To meet regulatory requirements and maintain proper records for agricultural programs',
    ],
  },
  {
    subheading: 'Data Sharing and Disclosure',
    body: 'We maintain strict control over your data:',
    list: [
      'Authorized Access: Data is shared only with authorized parties including cluster managers, project coordinators, and relevant stakeholders within the aquaculture program',
      'No Sale of Personal Data: We never sell, rent, or trade your personal information to third parties',
      'Anonymized Research: Only aggregated, anonymized data may be used for research purposes or program reporting',
      'Legal Requirements: We may disclose information when required by law or to protect the rights and safety of users',
      'Service Providers: Trusted third-party service providers may access data solely to provide technical services under strict confidentiality agreements',
    ],
  },
  {
    subheading: 'Data Security',
    body: 'We maintain strict control over your data:',
    list: [
      'Encryption: All data transmissions use SSL/TLS encryption to protect information in transit',
      'Access Controls: Role-based access control ensures only authorized personnel can access specific data',
      'Regular Audits: We conduct regular security audits and vulnerability assessments',
      'Data Backups: Regular automated backups ensure data integrity and availability',
      'Server Security: Our servers are hosted in secure facilities with physical and digital access controls',
      'Staff Training: All team members receive regular training on data protection and privacy best practices',
    ],
  },
  {
    subheading: 'Your Rights and Controls',
    body: 'You have the following rights regarding your data:',
    list: [
      'Profile Updates: Farmers and cluster managers can update their profile information at any time through the system',
      'Data Access: You can request access to all personal data we hold about you',
      'Data Correction: You can request corrections to inaccurate or incomplete data',
      'Account Deactivation: Administrators can deactivate or remove accounts upon request',
      'Data Deletion: You can request deletion of your personal data, subject to legal and operational requirements',
      'Data Portability: You can request a copy of your data in a machine-readable format',
      'Withdrawal of Consent: You can withdraw consent for data processing where applicable',
    ],
  },
]

export default function PrivacyPolicy() {
  const title = 'Privacy Policy'
  const actions = null
  return (
    <PageTransition>
      <Container className="mb-[70px]">
        <div className="mb-[30px]">
          <PageHeader className="mb-2 !h-fit !pb-0 !pt-0 font-bold" title={title} actions={actions} />
          {/* <Center>
          <SolarIconSet.Database color="#1C274C" size={24} iconStyle="Outline" />
        </Center> */}
          <Text weight="normal" size="base" color="#333740">
            Your data is important to us. Here&apos;s how we collect, use, and protect it.
          </Text>
        </div>
        <div className="">
          {Data.map((data) => (
            <>
              <div className="mb-2 ">
                <Text variant="subtitle" size="xl" color="#22252B">
                  {data.subheading}
                </Text>
                <Text variant="body" size="base" weight="normal" color="#333740">
                  {data.body}
                </Text>
              </div>

              <ul className="mb-[30px] list-disc">
                {data.list &&
                  data.list.map((list, index) => (
                    <li key={index} className="ml-[20px] text-[12px] text-[#333740]">
                      <Text variant="body" size="base" className="m-0 inline" color="#333740">
                        {list}
                      </Text>
                    </li>
                  ))}
              </ul>
            </>
          ))}
        </div>
      </Container>
    </PageTransition>
  )
}
