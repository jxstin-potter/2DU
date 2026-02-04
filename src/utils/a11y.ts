// Accessibility utility functions - Streamlined version
// Only keeping functions that are actually used in the application

import React from 'react';

/**
 * Creates an accessible label for an element
 */
export const createAccessibleLabel = (id: string, label: string) => {
  return {
    'aria-label': label,
    id: `${id}-label`,
  };
};

/**
 * Creates an accessible description for an element
 */
export const createAccessibleDescription = (id: string, description: string) => {
  return {
    'aria-describedby': `${id}-description`,
    id: `${id}-description-container`,
    description: {
      id: `${id}-description`,
      text: description,
    },
  };
};

/**
 * Creates accessible props for a button
 */
export const createAccessibleButton = (
  id: string,
  label: string,
  onActivate: () => void,
  description?: string
) => {
  const props: {
    id: string;
    role: 'button';
    tabIndex: number;
    'aria-label': string;
    'aria-describedby'?: string;
    onClick: React.MouseEventHandler;
    onKeyDown: React.KeyboardEventHandler;
  } = {
    id,
    onClick: () => onActivate(),
    role: 'button',
    'aria-label': label,
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    },
  };

  if (description) {
    const descriptionProps = createAccessibleDescription(id, description);
    props['aria-describedby'] = descriptionProps.description.id;
  }

  return props;
};

/**
 * Creates accessible props for a checkbox
 */
export const createAccessibleCheckbox = (
  id: string,
  label: string,
  checked: boolean,
  onToggle: () => void,
  description?: string
) => {
  void onToggle; // handled by the consuming component's onChange

  const props: {
    id: string;
    inputProps: {
      'aria-checked': boolean;
      'aria-label': string;
      'aria-describedby'?: string;
    };
  } = {
    id,
    inputProps: {
      'aria-checked': checked,
      'aria-label': label,
    },
  };

  if (description) {
    const descriptionProps = createAccessibleDescription(id, description);
    props.inputProps['aria-describedby'] = descriptionProps.description.id;
  }

  return props;
};

/**
 * Creates accessible props for a select element
 */
export const createAccessibleSelect = (
  id: string,
  label: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  options: Array<{ value: string; label: string }>,
  description?: string
) => {
  const props: {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    'aria-label': string;
    'aria-describedby'?: string;
  } = {
    id,
    value,
    onChange,
    'aria-label': label,
  };

  if (description) {
    const descriptionProps = createAccessibleDescription(id, description);
    props['aria-describedby'] = descriptionProps.description.id;
  }

  return {
    selectProps: props,
    options: options.map(option => ({
      value: option.value,
      label: option.label,
    })),
  };
}; 