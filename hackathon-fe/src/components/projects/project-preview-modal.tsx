import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

import { ProjectPreview } from "@/types/project-form";
import { ProjectIcon, SaveIcon } from "@/components/icons";

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  preview: ProjectPreview;
}

export const ProjectPreviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  preview,
}: ProjectPreviewModalProps) => {
  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="bg-primary text-white">
          <h5 className="mb-0">
            <ProjectIcon className="w-5 h-5 inline mr-2" />
            Project Preview
          </h5>
        </ModalHeader>
        <ModalBody>
          <div className="card border-0">
            <div className="card-header bg-gray-100">
              <h5 className="mb-0">
                <ProjectIcon className="w-4 h-4 text-primary inline mr-2" />
                {preview.name}
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mb-0">
                  {preview.description || "No description provided"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      preview.isActive
                        ? "bg-success text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {preview.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <strong>Created by:</strong>
                  <span className="ml-2">{preview.createdBy}</span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onClick={onClose}>
            Close
          </Button>
          <Button color="primary" onClick={onConfirm}>
            <SaveIcon className="w-4 h-4 mr-1" />
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
