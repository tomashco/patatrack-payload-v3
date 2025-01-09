'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import Image from 'next/image'
import { cn } from '@/utilities/cn'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  media?: {
    alt?: string
    url?: string
  }
  duotone?: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    media,
    duotone,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div data-theme="dark" className="bg-patatrack-purple h-[400px] flex items-center">
      {media && typeof media === 'object' && (
        <div className={cn('absolute w-full h-[400px]', duotone && 'duotone')}>
          <Image
            src={media.url || ''}
            alt={media.alt || ''}
            sizes="100vw"
            fill
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            width={0}
            height={0}
          />
        </div>
      )}
      <div className="container lg:max-w-[48rem] flex flex-col">
        {enableIntro && introContent && !hasSubmitted && (
          <RichText
            className="mb-8 lg:mb-12 relative z-10"
            data={introContent}
            enableGutter={false}
          />
        )}
        <div className="p-4 lg:p-6 relative">
          <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
              <RichText
                className="dark:text-white z-10 relative text-center"
                data={confirmationMessage}
              />
            )}
            {isLoading && !hasSubmitted && (
              <p className="dark:text-white z-10 relative text-center">Loading, please wait...</p>
            )}
            {error && (
              <div className="text-red-500 relative z-10 text-center [text-shadow:_0_0_3px_rgb(0_0_0_/_100%)] font-bold">{`${error.status || '500'}: ${error.message || ''}`}</div>
            )}
            {!hasSubmitted && (
              <form
                className="flex flex-col items-center relative z-10"
                id={formID}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="w-full mb-4 last:mb-0">
                  {formFromProps &&
                    formFromProps.fields &&
                    formFromProps.fields?.map((field, index) => {
                      const Field: React.FC<any> = fields?.[field.blockType]
                      if (Field) {
                        return (
                          <div className="mb-6 last:mb-0 text-black dark:text-white" key={index}>
                            <Field
                              form={formFromProps}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                            />
                          </div>
                        )
                      }
                      return null
                    })}
                </div>

                <Button className="w-fit" form={formID} type="submit" variant="default">
                  {submitButtonLabel}
                </Button>
              </form>
            )}
          </FormProvider>
          <div className="bg-patatrack-purple opacity-40 absolute w-full h-full top-0 left-0"></div>
        </div>
      </div>
    </div>
  )
}
