import { SelectField } from 'payload'

export const BG_PATATRACK: SelectField = {
  type: 'select',
  name: 'bgColor',
  defaultValue: 'bg-patatrack-purple',
  options: [
    {
      label: 'Gold',
      value: 'bg-patatrack-gold',
    },
    {
      label: 'Purple',
      value: 'bg-patatrack-purple',
    },
  ],
}
