import { useRef } from 'react'
import { defaultListSearch } from '@/shared/libs/search-params'
import { Link } from '@tanstack/react-router'
import { paths } from '@/shared/config/host'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/shadcn/dialog'
import { useDemoForm } from '../hooks/useDemoForm'
export function DemoFormPage() {
  const { form, confirmed, setConfirmed, onSubmit } = useDemoForm()
  const errors = form.formState.errors
  const submitRef = useRef<HTMLButtonElement>(null)
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <Button asChild variant="outline">
        <Link to={paths.home} search={defaultListSearch}>
          Back to sample list
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">Keyboard and form demo</h1>
      <p className="text-muted-foreground">
        Scroll to the bottom, focus the input and open the native keyboard. Submit is a local demo,
        not an API mutation.
      </p>
      <div className="space-y-3" aria-label="Scrollable sample content">
        {Array.from({ length: 5 }, (_, i) => (
          <p key={i} className="rounded-lg border p-4">
            Sample section {i + 1}. Check native gestures, long text, safe area and scroll position.
          </p>
        ))}
      </div>
      <form noValidate onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            {...form.register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            {...form.register('note')}
            aria-invalid={!!errors.note}
            aria-describedby={errors.note ? 'note-error' : undefined}
          />
          {errors.note && (
            <p id="note-error" role="alert">
              {errors.note.message}
            </p>
          )}
        </div>
        <Button ref={submitRef} type="submit" disabled={form.formState.isSubmitting}>
          Submit demo
        </Button>
      </form>
      <Dialog open={confirmed} onOpenChange={setConfirmed}>
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            submitRef.current?.focus({ preventScroll: true })
          }}
        >
          <DialogTitle>Local form is valid</DialogTitle>
          <DialogDescription>
            Nothing was sent to a backend or native app. Closing restores focus to the form.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </section>
  )
}
