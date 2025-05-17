import React, { type Dispatch, type ReactNode, type SetStateAction } from 'react';

type ModalProps = {
    isOpen?: boolean;
    children?: ReactNode;
    setOpenModal?: Dispatch<SetStateAction<boolean>>;
    mainClass?: string;
};

const ResuableModal = ({ isOpen, setOpenModal, mainClass, children }: ModalProps) => {
    const closeModal = () => {
        setOpenModal?.(false);
    };

    return (
        <>
            {isOpen && (
                <div className={`fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto overflow-x-hidden `} onClick={closeModal}>
                    <div className="fixed inset-0 bg-black opacity-70  "></div>

                    <div
                        className={`${mainClass} max-h-[70vh] my-8 inline-block w-full max-w-md transform overflow-hidden overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default ResuableModal;
