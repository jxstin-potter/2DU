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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SvgIcon } from '@mui/material';
var SidebarToggleIcon = function (_a) {
    var _b = _a.isCollapsed, isCollapsed = _b === void 0 ? false : _b, props = __rest(_a, ["isCollapsed"]);
    return (_jsx(SvgIcon, __assign({}, props, { viewBox: "0 0 24 24", sx: { fontSize: '1.25rem' }, children: isCollapsed ? (
        // Collapsed state: Show only main content area (simplified)
        _jsxs("g", { children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("line", { x1: "7", y1: "7", x2: "17", y2: "7", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }), _jsx("line", { x1: "7", y1: "10", x2: "17", y2: "10", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }), _jsx("line", { x1: "7", y1: "13", x2: "17", y2: "13", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }), _jsx("line", { x1: "7", y1: "16", x2: "17", y2: "16", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })] })) : (
        // Expanded state: Show sidebar on left and main content on right
        _jsxs("g", { children: [_jsx("rect", { x: "3", y: "4", width: "7", height: "16", rx: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("circle", { cx: "6.5", cy: "7.5", r: "1", fill: "currentColor" }), _jsx("circle", { cx: "6.5", cy: "10.5", r: "1", fill: "currentColor" }), _jsx("circle", { cx: "6.5", cy: "13.5", r: "1", fill: "currentColor" }), _jsx("circle", { cx: "6.5", cy: "16.5", r: "1", fill: "currentColor" }), _jsx("rect", { x: "12", y: "4", width: "9", height: "16", rx: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("line", { x1: "14", y1: "7", x2: "19", y2: "7", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }), _jsx("line", { x1: "14", y1: "10", x2: "19", y2: "10", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }), _jsx("line", { x1: "14", y1: "13", x2: "19", y2: "13", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }), _jsx("line", { x1: "14", y1: "16", x2: "19", y2: "16", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })] })) })));
};
export default SidebarToggleIcon;
