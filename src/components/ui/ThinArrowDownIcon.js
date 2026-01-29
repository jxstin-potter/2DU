var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import { SvgIcon } from '@mui/material';
var ThinArrowDownIcon = function (props) {
    return (_jsx(SvgIcon, __assign({}, props, { viewBox: "0 0 24 24", children: _jsx("path", { d: "M7 10l5 5 5-5", fill: "none", stroke: "currentColor", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round" }) })));
};
export default ThinArrowDownIcon;
