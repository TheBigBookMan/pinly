import type { SettingsType } from "@/types/settings"
// real commented out for dev
// export const settings: SettingsType[] = [
//   {
//     settingId: 'manual-location-confirm',
//     category: 'account',
//     label: 'Confirm pin location',
//     description: 'Turn this off to place pins automatically at our best guess.',
//     type: 'switch',
//     defaultValue: false,
//     hidden: false
//   },
//   {
//     settingId: 'notification-distance-preference',
//     category: 'notifications',
//     label: 'Notifications for proximity detector',
//     description: 'Set up notifications to alert if you are within a specific proximity to a pin you have created.',
//     type: 'number',
//     defaultValue: 100,
//     unit: 'km',
//     min: 1,
//     max: 500,
//     hidden: false
//   }
// ];

// add to the settings array in @/utils/settings
export const settings = [{
  settingId: 'far-alert-distance',
  label: 'Region heads-up distance',
  description: 'Get a heads-up when you are within this distance of a saved pin.',
  type: 'number',
  defaultValue: 100,
  unit: 'km',
  min: 20,
  max: 300,
  category: ''
},
{
  settingId: 'max-notifications-per-day',
  label: 'Daily notification limit',
  description: 'The most proximity notifications you will get in one day.',
  type: 'number',
  defaultValue: 5,
  min: 1,
  max: 20,
  category: ''
},
{
  settingId: 'quiet-hours-start',
  label: 'Quiet hours start',
  description: 'No notifications after this hour (24h clock).',
  type: 'number',
  defaultValue: 22,
  unit: 'h',
  min: 0,
  max: 23,
  category: ''
},
{
  settingId: 'show-done-pins',
  label: 'Show completed pins on map',
  description: 'Keep pins you have already visited visible on the map.',
  type: 'switch',
  defaultValue: true,
  category: ''
},
{
  settingId: 'auto-mark-done',
  label: 'Auto-mark pins as done',
  description: 'Mark a pin as done when you spend time at its location.',
  type: 'switch',
  defaultValue: false,
  category: ''
},
{
  settingId: 'home-country',
  label: 'Home country',
  description: 'Used to skip alerts for pins near where you live.',
  type: 'text',
  defaultValue: '',
  category: ''
},
{
  settingId: 'default-pin-note',
  label: 'Default pin note',
  description: 'Text pre-filled in the note field on every new pin.',
  type: 'text',
  defaultValue: '',
  category: ''
},
{
  settingId: 'beta-share-cards',
  label: 'Share cards',
  description: 'Experimental. This should not appear on the page.',
  type: 'switch',
  defaultValue: false,
  hidden: true,
  category: ''
}]