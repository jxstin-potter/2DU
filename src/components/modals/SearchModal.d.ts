import React from 'react';
interface SearchModalProps {
    open: boolean;
    onClose: () => void;
}
declare const SearchModal: React.FC<SearchModalProps>;
export default SearchModal;
