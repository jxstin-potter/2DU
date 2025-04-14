import React, { useState, useEffect } from 'react';
import styles from './CustomCheckbox.module.css';

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, label, checked, onChange }) => {
  // Local state for immediate visual feedback
  const [localChecked, setLocalChecked] = useState(checked);
  
  // Sync with parent component
  useEffect(() => {
    setLocalChecked(checked);
  }, [checked]);
  
  // Handle direct click on the label container
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update local state immediately for visual feedback
    const newChecked = !localChecked;
    setLocalChecked(newChecked);
    
    // Notify parent component
    onChange(newChecked);
  };

  return (
    <div 
      className={styles.container}
      onClick={handleClick}
    >
      <input
        id={id}
        type="checkbox"
        checked={localChecked}
        onChange={(e) => e.stopPropagation()}
        aria-checked={localChecked}
        aria-label={label}
        className={styles.input}
      />
      <span className={`${styles.checkmark} ${localChecked ? styles.animate : ''}`}></span>
    </div>
  );
};

export default CustomCheckbox; 