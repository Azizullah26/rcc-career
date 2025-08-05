import { AddExperience } from "../../../src/screens/AddExperience"

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
  return <AddExperience />
}
