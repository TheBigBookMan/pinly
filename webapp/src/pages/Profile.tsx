import Account from "@/components/features/Profile/Account"
import Travel from "@/components/features/Profile/Travel"

const Profile = () => {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-4">
      <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Personalise Pinly for you.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <Account />
        <Travel />
      </div>
    </div>
  )
}

export default Profile