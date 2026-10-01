import { useRef, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Camera, Pencil } from "lucide-react"
import type { AccountType } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type FieldErrors = Partial<Record<keyof AccountType, string>>

const dummyInitialAccount: AccountType = {
	email: "ben@example.com",
	username: "ben_travels",
	avatarUrl: "",
	bio: "",
	homeCountry: "Australia",
}

// Dummy "API call" — swap for a real request later.
// Simulates server-side conflicts so you can see the error states.
const saveAccount = async (data: AccountType): Promise<{ success: true } | { success: false; errors: FieldErrors }> => {
	await new Promise((resolve) => setTimeout(resolve, 600))

	const errors: FieldErrors = {}
	if (data.email === "taken@example.com") errors.email = "Email already in use."
	if (data.username === "admin") errors.username = "Username taken."

	if (Object.keys(errors).length > 0) return { success: false, errors }
	return { success: true }
}

const Account = () => {
	const [isEdit, setIsEdit] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [accountInfo, setAccountInfo] = useState<AccountType>(dummyInitialAccount)
	const [draft, setDraft] = useState<AccountType>(dummyInitialAccount)
	const [errors, setErrors] = useState<FieldErrors>({})
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleEdit = () => {
		setDraft(accountInfo)
		setErrors({})
		setIsEdit(true)
	}

	const handleCancel = () => {
		setDraft(accountInfo)
		setErrors({})
		setIsEdit(false)
	}

	const handleFieldChange = (field: keyof AccountType, value: string) => {
		setDraft((prev) => ({ ...prev, [field]: value }))
	}

	const handleAvatarClick = () => {
		if (isEdit) fileInputRef.current?.click()
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Dummy preview only — swap for a real upload (S3 presigned URL, etc.)
		// once the backend endpoint exists. This just shows the picked image
		// locally; it is not actually uploaded anywhere yet.
		const previewUrl = URL.createObjectURL(file)
		handleFieldChange("avatarUrl", previewUrl)
	}

	const handleSave = async () => {
		setIsSaving(true)
		setErrors({})

		const result = await saveAccount(draft)

		if (result.success) {
			setAccountInfo(draft)
			setIsEdit(false)
		} else {
			setErrors(result.errors)
		}

		setIsSaving(false)
	}

	const initials = draft.username
		? draft.username.slice(0, 2).toUpperCase()
		: "?"

	return (
		<Card>
			<CardHeader>
				<CardTitle>Account</CardTitle>
				<CardDescription>Personal account details.</CardDescription>
				<CardAction>
					{!isEdit && (
						<Button variant="ghost" size="icon" className="size-8" onClick={handleEdit}>
							<Pencil className="size-4" />
						</Button>
					)}
				</CardAction>
			</CardHeader>

			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-2">
					<button
						type="button"
						onClick={handleAvatarClick}
						disabled={!isEdit}
						className="group relative"
					>
						<Avatar className="size-20">
							<AvatarImage src={draft.avatarUrl} alt={draft.username} />
							<AvatarFallback className="text-lg">{initials}</AvatarFallback>
						</Avatar>
						{isEdit && (
							<span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
								<Camera className="size-5 text-white" />
							</span>
						)}
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						className="hidden"
					/>
					{isEdit && (
						<p className="text-xs text-muted-foreground">Click the photo to change it</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						disabled={!isEdit}
						value={draft.email}
						onChange={(e) => handleFieldChange("email", e.target.value)}
					/>
					{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						type="text"
						disabled={!isEdit}
						value={draft.username}
						onChange={(e) => handleFieldChange("username", e.target.value)}
					/>
					{errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="home-country">Home Country</Label>
					<Input
						id="home-country"
						type="text"
						disabled={!isEdit}
						value={draft.homeCountry}
						onChange={(e) => handleFieldChange("homeCountry", e.target.value)}
					/>
					{errors.homeCountry && <p className="text-sm text-destructive">{errors.homeCountry}</p>}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="bio">Bio</Label>
					<Textarea
						id="bio"
						disabled={!isEdit}
						value={draft.bio}
						onChange={(e) => handleFieldChange("bio", e.target.value)}
					/>
					{errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
				</div>
			</CardContent>

			{isEdit && (
				<CardFooter className="justify-end gap-2 border-t">
					<Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? "Saving..." : "Save"}
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}
export default Account