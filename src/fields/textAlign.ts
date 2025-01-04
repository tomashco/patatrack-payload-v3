import { SelectField } from 'payload'

export const TEXT_ALIGN: SelectField = {
  type: 'select',
  name: 'textAlign',
  defaultValue: 'text-left',
  options: [
    {
      label: 'Left',
      value: 'text-left',
    },
    {
      label: 'Center',
      value: 'text-center',
    },
    {
      label: 'Right',
      value: 'text-right',
    },
    {
      label: 'Justify',
      value: 'text-justify',
    },
  ],
}
