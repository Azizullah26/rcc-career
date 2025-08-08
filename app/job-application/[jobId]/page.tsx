import { JobApplication } from "../../../src/screens/JobApplication/JobApplication"

export async function generateStaticParams() {
  return [
    { jobId: '1' },
    { jobId: '2' },
    { jobId: '3' },
    { jobId: '4' },
    { jobId: '5' },
  ]
}

export default function JobApplicationPage({ params }: { params: { jobId: string } }) {
  return <JobApplication jobId={params.jobId} />
}
