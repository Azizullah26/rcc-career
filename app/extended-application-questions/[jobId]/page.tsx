import { ExtendedApplicationQuestions } from "../../../src/screens/ExtendedApplicationQuestions/ExtendedApplicationQuestions"

export async function generateStaticParams() {
  return [
    { jobId: '1' },
    { jobId: '2' },
    { jobId: '3' },
    { jobId: '4' },
    { jobId: '5' },
  ]
}

export default function ExtendedApplicationQuestionsPage({ params }: { params: { jobId: string } }) {
  return <ExtendedApplicationQuestions jobId={params.jobId} />
}
