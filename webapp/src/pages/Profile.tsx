
/*
This page will have stuff like account (profile pic, email, username), bio, travel stats (pins completed, countries visited, since joined date)
*/

const Profile = () => {
  return (
    <div className=" flex h-full max-w-2xl flex-col px-6 py-8">
			<h1 className="text-2xl font-semibold text-foreground">Profile</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Personalise Pinly for you.
			</p>

      <div className="mt-8 flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-secondary/40 p-6">
      </div>
    </div>
  )
}

export default Profile;