import { AddExperience } from "../../../src/screens/AddExperience/AddExperience"

export async function generateStaticParams() {
  return [
    { jobId: '1' },
    { jobId: '2' },
    { jobId: '3' },
    { jobId: '4' },
    { jobId: '5' },
  ]
}

export default function AddExperiencePage({ params }: { params: { jobId: string } }) {
  return <AddExperience jobId={params.jobId} />
}
