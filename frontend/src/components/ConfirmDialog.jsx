import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { Button } from './Form';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="" size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </>
    }
  >
    <div className="flex flex-col items-center text-center gap-4 py-2">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
