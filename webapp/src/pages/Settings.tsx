import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { settings } from "@/utils/settings"
import type { SettingsId, SettingsType } from "@/types/settings"
import { Button } from "@/components/ui/button"

type SettingsRowProps = {
	setting: SettingsType & { value: string | number | boolean }
	onChange: (settingId: SettingsId, value: string | number | boolean) => void
}

const SettingsRow = ({ setting, onChange }: SettingsRowProps) => {
	const checkSettingType = () => {
		switch (setting.type) {
			case 'switch':
				return (
					<Switch
						id={setting.settingId}
						checked={setting.value as boolean}
						onCheckedChange={(checked) => onChange(setting.settingId, checked)}
					/>
				)

			case 'number':
				return (
					<div className="flex items-center gap-2">
						<Input
							type="number"
							min={setting.min}
							max={setting.max}
							value={setting.value as number}
							onChange={(e) => onChange(setting.settingId, Number(e.target.value))}
							className="w-20 text-right"
						/>
						{setting.unit && (
							<span className="text-sm text-muted-foreground">{setting.unit}</span>
						)}
					</div>
				)

			case 'text':
				return (
					<Input
						type="text"
						value={setting.value as string}
						onChange={(e) => onChange(setting.settingId, e.target.value)}
						className="w-48"
					/>
				)
		}
	}

	return (
		<div className="flex items-start justify-between gap-4">
			<div className="space-y-1">
				<Label htmlFor={setting.settingId} className="text-sm font-medium text-foreground">
					{setting.label}
				</Label>
				<p className="text-sm text-muted-foreground">
					{setting.description}
				</p>
			</div>

			{checkSettingType()}
		</div>
	)
}

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
			// await fetch("/api/settings", {
			//   method: "PATCH",
			//   body: JSON.stringify(
			//     settingsData.map(({ settingId, value }) => ({ settingId, value }))
			//   ),
			// })
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

			<div className="mt-8 flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-secondary/40 p-6">
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
			</div>

			<div className="mt-6 flex justify-end">
				<Button onClick={handleSave} disabled={!hasChanges || isSaving}>
					{isSaving ? "Saving..." : "Save changes"}
				</Button>
			</div>
		</div>
	)
}

export default Settings