import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogFooter,  // not needed now
} from '@/components/ui/dialog'
import Button from '@/components/ui/Button'

interface TournamentModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  onConfirm?: () => void
  confirmLabel?: string
}

const TournamentModal = ({
  open,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = 'Confirm',
}: TournamentModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        if (!o) onClose()
      }}
    >
      <DialogContent
        className="
          bg-defendrLightBlack text-white rounded-2xl
          w-[95vw] sm:w-[92vw] max-w-[640px] max-h-[90vh]
          p-4 sm:p-6 lg:p-8 flex flex-col items-center
          overflow-hidden
        "
      >
        <DialogHeader className="w-full flex flex-col items-center mb-3 sm:mb-4">
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold leading-tight">
            {title}
          </DialogTitle>
          {description && (
            <p className="text-center text-gray-300 mt-2 sm:mt-3 leading-relaxed text-sm sm:text-base">
              {description}
            </p>
          )}
        </DialogHeader>

        {children && (
          <div className="w-full flex flex-col items-center gap-4 sm:gap-6 mb-2 flex-1 overflow-hidden">
            {children}
          </div>
        )}

        {onConfirm && (
          <div className="w-full flex justify-center mt-3 sm:mt-4 flex-shrink-0">
            <Button
              label={confirmLabel}
              variant="contained-red"
              size="l"
              onClick={onConfirm}
              className="w-full sm:w-auto"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TournamentModal
