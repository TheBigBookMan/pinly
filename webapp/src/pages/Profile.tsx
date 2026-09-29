
/*
This page will have stuff like account (profile pic, email, username), bio, travel stats (pins completed, countries visited, since joined date)
*/

import Account from "@/components/features/Profile/Account";
import Bio from "@/components/features/Profile/Bio";
import Travel from "@/components/features/Profile/Travel";

const Profile = () => {
  return (
    <div className=" flex h-full max-w-2xl flex-col px-6 py-8">
			<h1 className="text-2xl font-semibold text-foreground">Profile</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Personalise Pinly for you.
			</p>

      <Account />
      <Bio />
      <Travel />
    </div>
  )
}

export default Profile;