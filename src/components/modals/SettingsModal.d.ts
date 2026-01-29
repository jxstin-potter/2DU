import React from 'react';
interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}
declare const SettingsModal: React.FC<SettingsModalProps>;
export default SettingsModal;
