import { JobDetails } from "../../../src/screens/JobDetails/JobDetails"

export async function generateStaticParams() {
  return [
    { jobId: '1' },
    { jobId: '2' },
    { jobId: '3' },
    { jobId: '4' },
    { jobId: '5' },
  ]
}

export default function JobDetailsPage({ params }: { params: { jobId: string } }) {
  return <JobDetails jobId={params.jobId} />
}
