import { ErrorPageShell } from '@/components/errors/ErrorPageShell'

export default function NotFound() {
  return (
    <ErrorPageShell
      code="404"
      label="// ROUTE_NOT_FOUND"
      title="THIS PAGE DOESN'T EXIST"
      description="The URL you followed isn't wired into this portfolio yet. Check the path or return to the main experience."
      ghostText="LOST_SIGNAL_"
    />
  )
}
