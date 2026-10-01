import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { SettingsRowProps } from "@/types/settings"

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

export default SettingsRow;