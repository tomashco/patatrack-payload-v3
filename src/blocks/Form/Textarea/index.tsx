import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  rows = 3,
  width,
}) => {
  return (
    <Width width={width}>
      <div className="flex gap-4">
        <Label className="mt-[13px]" htmlFor={name}>
          {label}
        </Label>
        <div className="flex flex-col flex-1">
          <TextAreaComponent
            defaultValue={defaultValue}
            id={name}
            rows={rows}
            {...register(name, { required: requiredFromProps })}
          />
          {requiredFromProps && errors[name] && <Error />}
        </div>
      </div>
    </Width>
  )
}
