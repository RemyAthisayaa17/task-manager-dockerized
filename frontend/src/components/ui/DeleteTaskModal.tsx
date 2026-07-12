import { Modal, Button } from "../ui";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteTaskModal = ({ onConfirm, onClose }: Props) => {
  return (
    <Modal title="Delete Task" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle size={16} className="text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">Are you sure?</p>
          <p className="text-sm text-slate-500 mt-0.5">
            This task will be permanently deleted. This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Delete Task
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteTaskModal;
