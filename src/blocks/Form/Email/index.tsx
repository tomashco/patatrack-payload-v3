import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width }) => {
  return (
    <Width width={width}>
      <div className="flex gap-4">
        <Label className="mt-[13px]" htmlFor={name}>
          {label}
        </Label>
        <div className="flex flex-col flex-1">
          <Input
            defaultValue={defaultValue}
            id={name}
            type="text"
            {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: requiredFromProps })}
          />
          {requiredFromProps && errors[name] && <Error />}
        </div>
      </div>
    </Width>
  )
}
