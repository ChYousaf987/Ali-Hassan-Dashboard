import React, { type Dispatch, type ReactNode, type SetStateAction } from 'react';

type ModalProps = {
    isOpen?: boolean;
    width?: string;
    height?: string;
    children?: ReactNode;
    setOpenModal?: Dispatch<SetStateAction<boolean>>;
    name?: string;
    outerClassName?: string;
    innerClassName?: string;
    bgColor?: string;
    onClick?: () => void;
    onConfirm?: () => void;
};

const Modal = ({ isOpen, setOpenModal, name, onClick,onConfirm }: any) => {
    const closeModal = () => {
        setOpenModal?.(false);
    };
    const haddleClick = () => {
        onClick();
        // onConfirm()
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto overflow-x-hidden" onClick={closeModal}>
                    <div className="fixed inset-0 bg-black opacity-70"></div>

                    <div
                        className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1 className="text-lg font-medium leading-6 text-gray-900">Confirm Deletion ({name})</h1>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Are you sure you want to delete this item?</p>
                        </div>
                        <div className="mt-4 text-end">
                            <button
                                onClick={haddleClick}
                                type="button"
                                className="inline-flex justify-center rounded-lg border border-transparent bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
                            >
                                Delete
                            </button>
                            <button
                            
                                type="button"
                                className="ml-2 inline-flex justify-center rounded-lg border border-transparent bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
