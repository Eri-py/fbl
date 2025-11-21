import { createFileRoute } from '@tanstack/react-router'
import TeamPicker from '@/components/TeamPicker'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return <TeamPicker />
}
