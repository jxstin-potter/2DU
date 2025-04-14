import { t } from './i18n';

// Accessibility utility functions - Streamlined version
// Only keeping functions that are actually used in the application

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
  onClick: (e: React.MouseEvent) => void,
  description?: string
) => {
  const props: any = {
    id,
    onClick,
    role: 'button',
    'aria-label': label,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e as unknown as React.MouseEvent);
      }
    },
  };

  if (description) {
    const descriptionProps = createAccessibleDescription(id, description);
    props['aria-describedby'] = descriptionProps.description.id;
    props.descriptionProps = descriptionProps;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  description?: string
) => {
  const props: any = {
    id,
    type: 'checkbox',
    checked,
    onChange,
    'aria-checked': checked,
    'aria-label': label,
  };

  if (description) {
    const descriptionProps = createAccessibleDescription(id, description);
    props['aria-describedby'] = descriptionProps.description.id;
    props.descriptionProps = descriptionProps;
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
  const props: any = {
    id,
    value,
    onChange,
    'aria-label': label,
  };

  if (description) {
    const descriptionProps = createAccessibleDescription(id, description);
    props['aria-describedby'] = descriptionProps.description.id;
    props.descriptionProps = descriptionProps;
  }

  return {
    selectProps: props,
    options: options.map(option => ({
      value: option.value,
      label: option.label,
    })),
  };
}; 