import { ApplicationQuestions } from "../../../src/screens/ApplicationQuestions/ApplicationQuestions"

export async function generateStaticParams() {
  return [
    { jobId: '1' },
    { jobId: '2' },
    { jobId: '3' },
    { jobId: '4' },
    { jobId: '5' },
  ]
}

export default function ApplicationQuestionsPage({ params }: { params: { jobId: string } }) {
  return <ApplicationQuestions jobId={params.jobId} />
}
