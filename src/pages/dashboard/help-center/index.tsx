import { Container } from 'src/components/ui/container'
import { Center } from 'src/components/ui/center'
import PageTransition from 'src/components/animation/page-transition'
import { PageHeader } from 'src/components/ui/page-header'
import { Text } from 'src/components/ui/text'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'
import { Inline } from 'src/components/ui/inline'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'src/components/ui/accordion'
import { TextVariant } from 'src/types'
import { ReactNode, useState } from 'react'

type align = 'left' | 'center' | 'right'
type Faqs = {
  question: string
  answer: string
}[]

const faqs = [
  {
    question: 'How do I register my pond and batch?',
    answer:
      'To register a new pond and batch, navigate to the "Pond Management" section from your dashboard. Click "Add New Pond", fill in the required details including pond size, location, and water source. Then create a batch by selecting "New Batch" and entering fish species, quantity, and stocking date. Make sure all mandatory fields are completed before submitting.',
  },
  {
    question: "Why can't I submit a feeding report?",
    answer:
      "Common reasons include: incomplete required fields, invalid date selection (future dates not allowed), or network connectivity issues. Ensure you've selected the correct pond and batch, entered valid feed quantities, and your internet connection is stable. If the problem persists, try refreshing the page or contact your system administrator.",
  },
  {
    question: 'Can I edit a report after submission?',
    answer:
      'Yes, you can edit most reports within 24 hours of submission. Go to "Report History", find the report you want to modify, and click "Edit". However, reports that have been approved by supervisors or are older than 24 hours cannot be modified. For urgent changes to locked reports, contact your cluster manager.',
  },
  {
    question: 'What do I do if I forget my password?',
    answer:
      'Click "Forgot Password" on the login page and enter your registered email address. You\'ll receive a password reset link within 5-10 minutes. If you don\'t receive the email, check your spam folder or contact your system administrator. Make sure to create a strong password with at least 8 characters, including numbers and special characters.',
  },
  {
    question: 'How do I report a sampling operation?',
    answer:
      'Navigate to "Operations" → "Sampling Reports". Select the pond and batch, then enter sampling details including sample size, average weight, mortality count, and water quality parameters. Upload photos if required. The system will automatically calculate growth rates and survival percentages based on your input.',
  },
  {
    question: 'What happens when I split a pond or batch?',
    answer:
      "When you split a pond or batch, the system creates new records while maintaining the historical data of the original. You'll need to specify the split ratio, new pond assignments, and estimated fish counts. All previous reports remain linked to the original batch for tracking purposes. The new batches will have separate reporting streams going forward.",
  },
  {
    question: 'How do I view my report history?',
    answer:
      'Access "Report History" from the main dashboard. You can filter by report type, date range, pond, or batch. Use the search function to find specific reports quickly. Click on any report to view details, and use the export function to download reports in PDF or Excel format for your records.',
  },
  {
    question: 'Who can I contact for technical support?',
    answer:
      'For immediate technical issues, contact your assigned cluster manager first. For system-wide problems, reach out to the CFMS technical support team through the "Contact Support" option in your dashboard. Include your user ID, error screenshots, and a detailed description of the issue for faster resolution.',
  },
]

export default function HelpCenter() {
  const [searchedFaqs, setSearchedFaqs] = useState<Faqs | null>(faqs)
  const [value, setValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    getSearchedFaqs(newValue)
  }

  const getSearchedFaqs = (text: string) => {
    const newFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(text.toLowerCase()))
    setSearchedFaqs(newFaqs)
  }

  const title = 'Help Center'
  const actions = null
  const AccordionText = (props: { variant: TextVariant; color: string; align: align; children: ReactNode }) => {
    const { children, variant, color, align } = props
    return (
      <Inline>
        <Text variant={variant} align={align} color={color}>
          {children}
        </Text>
      </Inline>
    )
  }

  const Icon = (
    <Inline className="ml-1">
      <SolarIconSet.Magnifer size={20} />
    </Inline>
  )

  return (
    <PageTransition>
      <Container>
        <Center className="flex-col gap-10">
          <Center className="flex-col gap-2">
            <PageHeader title={title} actions={actions} className="!h-fit !py-0" />
            <Text variant="body" color="text-[#333740]" align="center" className="lg:w-[571px]" size="base">
              Find answers to common questions and watch quick tutorials to get started with the Catfish Farm Management
              System.
            </Text>
          </Center>
          <Input
            className=" py-2 lg:w-[391px]"
            placeholder="Search FAQs...."
            icon={Icon}
            value={value}
            onInput={handleInputChange}
          />
          <Center className="flex-col gap-2">
            <PageHeader title={'Frequently Asked Questions'} actions={actions} className="!h-fit !py-0" />
            <Text variant="body" color="text-[#333740]" align="center" className="lg:w-[571px]" size="base">
              Get quick answers to the most common questions about CFMS
            </Text>
          </Center>
          <Center className="mb-10 flex-col">
            <Accordion type="multiple" className="mx-auto lg:w-[673px]">
              {searchedFaqs?.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>
                    <AccordionText variant={'body'} color={''} align={'left'}>
                      {faq.question}
                    </AccordionText>
                  </AccordionTrigger>
                  <AccordionContent>
                    <AccordionText variant="body" color="text-gray-500" align="left">
                      {faq.answer}
                    </AccordionText>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Center>
        </Center>
      </Container>
    </PageTransition>
  )
}
