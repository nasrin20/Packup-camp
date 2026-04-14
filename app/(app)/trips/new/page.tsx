import TopBar from '@/components/layout/TopBar'
import TripForm from '@/components/trips/TripForm'

export default function NewTripPage() {
  return (
    <div>
      <TopBar title="Post a Trip" showBack />
      <div className="px-4 py-4">
        <TripForm />
      </div>
    </div>
  )
}
