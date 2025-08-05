import { ApplicationQuestions } from "../../../src/screens/ApplicationQuestions"

export async function generateStaticParams() {
  return [
    { jobId: '1' },
    { jobId: '2' },
    { jobId: '3' },
    { jobId: '4' },
    { jobId: '5' },
  ]
}

export default function Page() {
  return <ApplicationQuestions />
}
