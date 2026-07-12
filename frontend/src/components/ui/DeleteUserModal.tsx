import { Modal, Button } from "../ui";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  userName: string;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteUserModal = ({ userName, onConfirm, onClose }: Props) => {
  return (
    <Modal title="Remove User" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle size={16} className="text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">
            Remove <span className="text-slate-900">{userName}</span>?
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            This will permanently delete the user and all their tasks.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Remove User
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
