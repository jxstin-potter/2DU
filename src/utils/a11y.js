// Accessibility utility functions - Streamlined version
// Only keeping functions that are actually used in the application
/**
 * Creates an accessible label for an element
 */
export var createAccessibleLabel = function (id, label) {
    return {
        'aria-label': label,
        id: "".concat(id, "-label"),
    };
};
/**
 * Creates an accessible description for an element
 */
export var createAccessibleDescription = function (id, description) {
    return {
        'aria-describedby': "".concat(id, "-description"),
        id: "".concat(id, "-description-container"),
        description: {
            id: "".concat(id, "-description"),
            text: description,
        },
    };
};
/**
 * Creates accessible props for a button
 */
export var createAccessibleButton = function (id, label, onClick, description) {
    var props = {
        id: id,
        onClick: onClick,
        role: 'button',
        'aria-label': label,
        tabIndex: 0,
        onKeyDown: function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
            }
        },
    };
    if (description) {
        var descriptionProps = createAccessibleDescription(id, description);
        props['aria-describedby'] = descriptionProps.description.id;
        props.descriptionProps = descriptionProps;
    }
    return props;
};
/**
 * Creates accessible props for a checkbox
 */
export var createAccessibleCheckbox = function (id, label, checked, onChange, description) {
    var props = {
        id: id,
        type: 'checkbox',
        checked: checked,
        onChange: onChange,
        'aria-checked': checked,
        'aria-label': label,
    };
    if (description) {
        var descriptionProps = createAccessibleDescription(id, description);
        props['aria-describedby'] = descriptionProps.description.id;
        props.descriptionProps = descriptionProps;
    }
    return props;
};
/**
 * Creates accessible props for a select element
 */
export var createAccessibleSelect = function (id, label, value, onChange, options, description) {
    var props = {
        id: id,
        value: value,
        onChange: onChange,
        'aria-label': label,
    };
    if (description) {
        var descriptionProps = createAccessibleDescription(id, description);
        props['aria-describedby'] = descriptionProps.description.id;
        props.descriptionProps = descriptionProps;
    }
    return {
        selectProps: props,
        options: options.map(function (option) { return ({
            value: option.value,
            label: option.label,
        }); }),
    };
};
