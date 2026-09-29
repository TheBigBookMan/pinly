// temp for dev
// type SettingsId = 'manual-location-confirm' | 'notification-distance-preference';
export type SettingsId = string;

// temp for dev
// type SettingsCategory = 'notifications' | 'privacy' | 'account'; 
type SettingsCategory = string | undefined;

type BaseSetting = {
  settingId: SettingsId;
  category?: SettingsCategory;
  label: string;
  description: string;
  hidden?: boolean;
}

type SwitchSettingType = BaseSetting & {
  type: 'switch';
  defaultValue: boolean;
}

type NumberSettingType = BaseSetting & {
  type: 'number';
  defaultValue: number;
  max?: number;
  min?: number;
  unit?: string;
}

type TextSettingType = BaseSetting & {
  type: 'text';
  defaultValue: string; 
}

export type SettingsType = SwitchSettingType | NumberSettingType | TextSettingType;

export type SettingsRowProps = {
  setting: SettingsType & { value: string | number | boolean }
  onChange: (settingId: SettingsId, value: string | number | boolean) => void
}