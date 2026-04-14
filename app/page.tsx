import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-forest-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-sm mx-auto">
        <div className="text-6xl mb-4">⛺</div>
        <h1 className="text-4xl font-bold font-serif text-ember-400 mb-2">PackUp</h1>
        <p className="text-forest-400 text-lg mb-2">Find your camping crew.</p>
        <p className="text-forest-500 text-sm mb-10">
          Connect with Australians who love the outdoors. Post a trip, find your people, camp together.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/signup"
            className="w-full py-4 bg-ember-400 text-forest-900 rounded-xl font-bold text-base text-center">
            Get Started — It's Free
          </Link>
          <Link href="/login"
            className="w-full py-4 bg-forest-800 border border-forest-700 text-forest-300 rounded-xl text-base text-center">
            I already have an account
          </Link>
        </div>
        <p className="text-forest-600 text-xs mt-8">🇦🇺 Made for Australians, by Australians</p>
      </div>
    </main>
  )
}
