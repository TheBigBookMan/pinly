import { useState } from "react"
import { settings } from "@/utils/settings"
import type { SettingsId, SettingsRowProps } from "@/types/settings"
import { Button } from "@/components/ui/button"
import SettingsRow from "@/components/features/Settings/SettingsRow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type UserSettingType = {
	settingId: SettingsId
	value: string | number | boolean
}

const userSettings: UserSettingType[] = [
	{ settingId: 'confirm-pin-location', value: false },
	{ settingId: 'proximity-alert-distance', value: 25 },
	{ settingId: 'far-alert-distance', value: 150 },
	{ settingId: 'quiet-hours-start', value: 23 },
	{ settingId: 'show-done-pins', value: false },
	{ settingId: 'display-name', value: 'Ben' },
	{ settingId: 'home-country', value: 'Australia' },
]

const buildInitialSettings = (): SettingsRowProps["setting"][] => {
	const currentValues = new Map<SettingsId, string | number | boolean>()
	userSettings.forEach((setting) => currentValues.set(setting.settingId, setting.value))

	return settings.map((setting) => ({
		...setting,
		value: currentValues.has(setting.settingId)
			? currentValues.get(setting.settingId)!
			: setting.defaultValue,
	}))
}

const Settings = () => {
	const [settingsData, setSettingsData] = useState(buildInitialSettings)
	const [initialSettings, setInitialSettings] = useState(settingsData)
	const [isSaving, setIsSaving] = useState(false)

	const handleChange = (settingId: SettingsId, value: string | number | boolean) => {
		setSettingsData((prev) =>
			prev.map((setting) =>
				setting.settingId === settingId ? { ...setting, value } : setting
			)
		)
	}

	const hasChanges = settingsData.some(
		(setting, i) => setting.value !== initialSettings[i].value
	)

	const handleSave = async () => {
		setIsSaving(true)
		try {
			// await fetch("/api/settings", { ... })
			setInitialSettings(settingsData)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="mx-auto flex h-full max-w-2xl flex-col px-6 py-8">
			<h1 className="text-2xl font-semibold text-foreground">Settings</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Manage how Pinly behaves for you.
			</p>

			<Card className="mt-8 flex flex-1 flex-col overflow-hidden">
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
					<CardDescription>
						Changes here apply the next time you save a pin.
					</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto">
					{settingsData.map((setting) => {
						if (setting.hidden) return null
						return (
							<SettingsRow
								key={setting.settingId}
								setting={setting}
								onChange={handleChange}
							/>
						)
					})}
				</CardContent>

				<CardFooter className="justify-end border-t">
					<Button onClick={handleSave} disabled={!hasChanges || isSaving}>
						{isSaving ? "Saving..." : "Save changes"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default Settings;