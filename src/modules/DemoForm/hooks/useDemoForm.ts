import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(100),
  note: z.string().trim().max(1000),
})
type Values = z.infer<typeof schema>
export function useDemoForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', note: '' },
  })
  const [confirmed, setConfirmed] = useState(false)
  const onSubmit = form.handleSubmit(() => setConfirmed(true))
  return { form, confirmed, setConfirmed, onSubmit }
}
