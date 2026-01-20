(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~home-components-widget-lib-canvas-digital-gauge~home-components-widget-lib-digital-gauge"],{

/***/ "QR2c":
/*!****************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/canvas-digital-gauge.ts ***!
  \****************************************************************************/
/*! exports provided: Drawings, CanvasDigitalGauge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Drawings", function() { return Drawings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanvasDigitalGauge", function() { return CanvasDigitalGauge; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-gauges */ "rxPF");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_gauges__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinycolor2 */ "Zss7");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinycolor2__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @core/utils */ "//Q6");
///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///




var GenericOptions = canvas_gauges__WEBPACK_IMPORTED_MODULE_1__["GenericOptions"];
var BaseGauge = canvas_gauges__WEBPACK_IMPORTED_MODULE_1__["BaseGauge"];
var tinycolor = tinycolor2__WEBPACK_IMPORTED_MODULE_2__;
var defaultDigitalGaugeOptions = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, GenericOptions), {
    gaugeType: 'arc',
    gaugeWithScale: 0.75,
    dashThickness: 0,
    roundedLineCap: false,
    gaugeColor: '#777',
    levelColors: ['blue'],
    symbol: '',
    label: '',
    hideValue: false,
    hideMinMax: false,
    fontTitle: 'Roboto',
    fontValue: 'Roboto',
    fontMinMaxSize: 10,
    fontMinMaxStyle: 'normal',
    fontMinMaxWeight: '500',
    colorMinMax: '#eee',
    fontMinMax: 'Roboto',
    fontLabelSize: 8,
    fontLabelStyle: 'normal',
    fontLabelWeight: '500',
    colorLabel: '#eee',
    fontLabel: 'Roboto',
    neonGlowBrightness: 0,
    colorTicks: 'gray',
    tickWidth: 4,
    ticks: [],
    isMobile: false
});
BaseGauge.initialize('CanvasDigitalGauge', defaultDigitalGaugeOptions);
var Drawings = /** @class */ (function () {
    function Drawings() {
    }
    Drawings.font = function (options, target, baseSize) {
        return options['font' + target + 'Style'] + ' ' +
            options['font' + target + 'Weight'] + ' ' +
            options['font' + target + 'Size'] * baseSize + 'px ' +
            options['font' + target];
    };
    Drawings.normalizedValue = function (options) {
        var value = options.value;
        var min = options.minValue;
        var max = options.maxValue;
        var dt = (max - min) * 0.01;
        return {
            normal: value < min ? min : value > max ? max : value,
            indented: value < min ? min - dt : value > max ? max + dt : value
        };
    };
    Drawings.verifyError = function (err) {
        if (err instanceof DOMException && err.result === 0x8053000b) {
            return; // ignore it
        }
        throw err;
    };
    return Drawings;
}());

var CanvasDigitalGauge = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(CanvasDigitalGauge, _super);
    function CanvasDigitalGauge(options) {
        var _this = this;
        options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, defaultDigitalGaugeOptions), (options || {}));
        _this = _super.call(this, CanvasDigitalGauge.configure(options)) || this;
        _this.initValueClone();
        return _this;
    }
    CanvasDigitalGauge.configure = function (options) {
        if (options.value > options.maxValue) {
            options.value = options.maxValue;
        }
        if (options.value < options.minValue) {
            options.value = options.minValue;
        }
        if (options.gaugeType === 'donut') {
            if (!Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isDefinedAndNotNull"])(options.donutStartAngle)) {
                options.donutStartAngle = 1.5 * Math.PI;
            }
            if (!Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isDefinedAndNotNull"])(options.donutEndAngle)) {
                options.donutEndAngle = options.donutStartAngle + 2 * Math.PI;
            }
        }
        var colorsCount = options.levelColors.length;
        var isColorProperty = Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isString"])(options.levelColors[0]);
        var inc = colorsCount > 1 ? (1 / (colorsCount - 1)) : 1;
        options.colorsRange = [];
        if (options.neonGlowBrightness) {
            options.neonColorsRange = [];
        }
        for (var i = 0; i < options.levelColors.length; i++) {
            var levelColor = options.levelColors[i];
            if (levelColor !== null) {
                var percentage = void 0;
                if (isColorProperty) {
                    percentage = inc * i;
                }
                else {
                    percentage = CanvasDigitalGauge.normalizeValue(levelColor.value, options.minValue, options.maxValue);
                }
                var tColor = tinycolor(isColorProperty ? levelColor : levelColor.color);
                options.colorsRange.push({
                    pct: percentage,
                    color: tColor.toRgb(),
                    rgbString: tColor.toRgbString()
                });
                if (options.neonGlowBrightness) {
                    tColor = tinycolor(isColorProperty ? levelColor : levelColor.color).brighten(options.neonGlowBrightness);
                    options.neonColorsRange.push({
                        pct: percentage,
                        color: tColor.toRgb(),
                        rgbString: tColor.toRgbString()
                    });
                }
            }
        }
        options.ticksValue = [];
        for (var _i = 0, _a = options.ticks; _i < _a.length; _i++) {
            var tick = _a[_i];
            if (tick !== null) {
                options.ticksValue.push(CanvasDigitalGauge.normalizeValue(tick, options.minValue, options.maxValue));
            }
        }
        if (options.neonGlowBrightness) {
            options.neonColorTitle = tinycolor(options.colorTitle).brighten(options.neonGlowBrightness).toHexString();
            options.neonColorLabel = tinycolor(options.colorLabel).brighten(options.neonGlowBrightness).toHexString();
            options.neonColorValue = tinycolor(options.colorValue).brighten(options.neonGlowBrightness).toHexString();
            options.neonColorMinMax = tinycolor(options.colorMinMax).brighten(options.neonGlowBrightness).toHexString();
        }
        return options;
    };
    CanvasDigitalGauge.normalizeValue = function (value, min, max) {
        var normalValue = (value - min) / (max - min);
        if (normalValue <= 0) {
            return 0;
        }
        if (normalValue >= 1) {
            return 1;
        }
        return normalValue;
    };
    CanvasDigitalGauge.prototype.initValueClone = function () {
        var canvas = this.canvas;
        this.elementValueClone = canvas.element.cloneNode(true);
        this.contextValueClone = this.elementValueClone.getContext('2d');
        this.elementValueClone.initialized = false;
        this.contextValueClone.translate(canvas.drawX, canvas.drawY);
        this.contextValueClone.save();
        this.elementProgressClone = canvas.element.cloneNode(true);
        this.contextProgressClone = this.elementProgressClone.getContext('2d');
        this.elementProgressClone.initialized = false;
        this.contextProgressClone.translate(canvas.drawX, canvas.drawY);
        this.contextProgressClone.save();
    };
    CanvasDigitalGauge.prototype.destroy = function () {
        this.contextValueClone = null;
        this.elementValueClone = null;
        this.contextProgressClone = null;
        this.elementProgressClone = null;
        _super.prototype.destroy.call(this);
    };
    CanvasDigitalGauge.prototype.update = function (options) {
        this.canvas.onRedraw = null;
        var result = _super.prototype.update.call(this, options);
        this.initValueClone();
        this.canvas.onRedraw = this.draw.bind(this);
        this.draw();
        return result;
    };
    Object.defineProperty(CanvasDigitalGauge.prototype, "timestamp", {
        get: function () {
            return this.options.timestamp;
        },
        set: function (timestamp) {
            this.options.timestamp = timestamp;
            this.draw();
        },
        enumerable: false,
        configurable: true
    });
    CanvasDigitalGauge.prototype.draw = function () {
        try {
            var canvas = this.canvas;
            if (!canvas.drawWidth || !canvas.drawHeight) {
                return this;
            }
            var _a = [
                -canvas.drawX,
                -canvas.drawY,
                canvas.drawWidth,
                canvas.drawHeight
            ], x = _a[0], y = _a[1], w = _a[2], h = _a[3];
            var options = this.options;
            var elementClone = canvas.elementClone;
            if (!elementClone.initialized) {
                var context = canvas.contextClone;
                // clear the cache
                context.clearRect(x, y, w, h);
                context.save();
                var canvasContext = canvas.context;
                canvasContext.barDimensions = barDimensions(context, options, x, y, w, h);
                this.contextValueClone.barDimensions = canvasContext.barDimensions;
                this.contextProgressClone.barDimensions = canvasContext.barDimensions;
                drawBackground(context, options);
                drawDigitalTitle(context, options);
                if (!options.showTimestamp) {
                    drawDigitalLabel(context, options);
                }
                drawDigitalMinMax(context, options);
                elementClone.initialized = true;
            }
            var valueChanged = false;
            if (!this.elementValueClone.initialized ||
                Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isDefined"])(this._value) && this.elementValueClone.renderedValue !== this._value ||
                (options.showTimestamp && this.elementValueClone.renderedTimestamp !== this.timestamp)) {
                if (Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isDefined"])(this._value)) {
                    this.elementValueClone.renderedValue = this._value;
                }
                if (Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isUndefined"])(this.elementValueClone.renderedValue)) {
                    this.elementValueClone.renderedValue = this.value;
                }
                var context = this.contextValueClone;
                // clear the cache
                context.clearRect(x, y, w, h);
                context.save();
                context.drawImage(canvas.elementClone, x, y, w, h);
                context.save();
                drawDigitalValue(context, options, this.elementValueClone.renderedValue);
                if (options.showTimestamp) {
                    drawDigitalLabel(context, options);
                    this.elementValueClone.renderedTimestamp = this.timestamp;
                }
                this.elementValueClone.initialized = true;
                valueChanged = true;
            }
            var progress = (Drawings.normalizedValue(options).normal - options.minValue) /
                (options.maxValue - options.minValue);
            var fixedProgress = progress.toFixed(3);
            if (!this.elementProgressClone.initialized || this.elementProgressClone.renderedProgress !== fixedProgress || valueChanged) {
                var context = this.contextProgressClone;
                // clear the cache
                context.clearRect(x, y, w, h);
                context.save();
                context.drawImage(this.elementValueClone, x, y, w, h);
                context.save();
                if (Number(fixedProgress) > 0) {
                    drawProgress(context, options, progress);
                }
                this.elementProgressClone.initialized = true;
                this.elementProgressClone.renderedProgress = fixedProgress;
            }
            this.canvas.commit();
            // clear the canvas
            canvas.context.clearRect(x, y, w, h);
            canvas.context.save();
            canvas.context.drawImage(this.elementProgressClone, x, y, w, h);
            canvas.context.save();
            // @ts-ignore
            _super.prototype.draw.call(this);
        }
        catch (err) {
            Drawings.verifyError(err);
        }
        return this;
    };
    CanvasDigitalGauge.prototype.getValueColor = function () {
        if (this.contextProgressClone) {
            var color = this.contextProgressClone.currentColor;
            var options = this.options;
            if (!color) {
                var progress = (Drawings.normalizedValue(options).normal - options.minValue) /
                    (options.maxValue - options.minValue);
                if (options.neonGlowBrightness) {
                    color = getProgressColor(progress, options.neonColorsRange);
                }
                else {
                    color = getProgressColor(progress, options.colorsRange);
                }
            }
            return color;
        }
        else {
            return '#000';
        }
    };
    CanvasDigitalGauge.heightCache = {};
    return CanvasDigitalGauge;
}(BaseGauge));

function barDimensions(context, options, x, y, w, h) {
    context.barDimensions = {
        baseX: x,
        baseY: y,
        width: w,
        height: h
    };
    var bd = context.barDimensions;
    var aspect = 1;
    if (options.gaugeType === 'horizontalBar') {
        aspect = options.title === '' ? 2.5 : 2;
    }
    else if (options.gaugeType === 'verticalBar') {
        aspect = options.hideMinMax ? 0.35 : 0.5;
    }
    else if (options.gaugeType === 'arc') {
        aspect = 1.5;
    }
    var currentAspect = w / h;
    if (currentAspect > aspect) {
        bd.width = (h * aspect);
        bd.height = h;
    }
    else {
        bd.width = w;
        bd.height = w / aspect;
    }
    bd.origBaseX = bd.baseX;
    bd.origBaseY = bd.baseY;
    bd.baseX += (w - bd.width) / 2;
    bd.baseY += (h - bd.height) / 2;
    if (options.gaugeType === 'donut') {
        bd.fontSizeFactor = Math.max(bd.width, bd.height) / 125;
    }
    else if (options.gaugeType === 'verticalBar' || (options.gaugeType === 'arc' && options.title === '')) {
        bd.fontSizeFactor = Math.max(bd.width, bd.height) / 150;
    }
    else {
        bd.fontSizeFactor = Math.max(bd.width, bd.height) / 200;
    }
    var gws = options.gaugeWidthScale;
    if (options.neonGlowBrightness) {
        options.fontTitleHeight = determineFontHeight(options, 'Title', bd.fontSizeFactor);
        options.fontLabelHeight = determineFontHeight(options, 'Label', bd.fontSizeFactor);
        options.fontValueHeight = determineFontHeight(options, 'Value', bd.fontSizeFactor);
        options.fontMinMaxHeight = determineFontHeight(options, 'MinMax', bd.fontSizeFactor);
    }
    if (options.gaugeType === 'donut') {
        bd.Ro = bd.width / 2 - bd.width / 20;
        bd.Cy = bd.baseY + bd.height / 2;
        if (options.title && typeof options.title === 'string' && options.title.length > 0) {
            var titleOffset = determineFontHeight(options, 'Title', bd.fontSizeFactor).height;
            titleOffset += bd.fontSizeFactor * 2;
            bd.titleY = bd.baseY + titleOffset;
            titleOffset += bd.fontSizeFactor * 2;
            bd.Cy += titleOffset / 2;
            bd.Ro -= titleOffset / 2;
        }
        bd.Ri = bd.Ro - bd.width / 6.666666666666667 * gws * 1.2;
        bd.Cx = bd.baseX + bd.width / 2;
    }
    else if (options.gaugeType === 'arc') {
        if (options.title && typeof options.title === 'string' && options.title.length > 0) {
            bd.Ro = bd.width / 2 - bd.width / 7;
            bd.Ri = bd.Ro - bd.width / 6.666666666666667 * gws;
        }
        else {
            bd.Ro = bd.width / 2 - bd.fontSizeFactor * 4;
            bd.Ri = bd.Ro - bd.width / 6.666666666666667 * gws * 1.2;
        }
        bd.Cx = bd.baseX + bd.width / 2;
        bd.Cy = bd.baseY + bd.height / 1.25;
    }
    else if (options.gaugeType === 'verticalBar') {
        bd.Ro = bd.width / 2 - bd.width / 10;
        bd.Ri = bd.Ro - bd.width / 6.666666666666667 * gws * (options.hideMinMax ? 4 : 2.5);
    }
    else { // horizontalBar
        bd.Ro = bd.width / 2 - bd.width / 10;
        bd.Ri = bd.Ro - bd.width / 6.666666666666667 * gws;
    }
    bd.strokeWidth = bd.Ro - bd.Ri;
    bd.Rm = bd.Ri + bd.strokeWidth * 0.5;
    bd.fontValueBaseline = 'alphabetic';
    bd.fontMinMaxBaseline = 'alphabetic';
    bd.fontMinMaxAlign = 'center';
    if (options.gaugeType === 'donut') {
        bd.fontValueBaseline = 'middle';
        if (options.label && options.label.length > 0) {
            var valueHeight = determineFontHeight(options, 'Value', bd.fontSizeFactor).height;
            var labelHeight = determineFontHeight(options, 'Label', bd.fontSizeFactor).height;
            var total = valueHeight + labelHeight;
            bd.labelY = bd.Cy + total / 2;
            bd.valueY = bd.Cy - total / 2 + valueHeight / 2;
        }
        else {
            bd.valueY = bd.Cy;
        }
    }
    else if (options.gaugeType === 'arc') {
        bd.titleY = bd.Cy - bd.Ro - 12 * bd.fontSizeFactor;
        bd.valueY = bd.Cy;
        bd.labelY = bd.Cy + (8 + options.fontLabelSize) * bd.fontSizeFactor;
        bd.minY = bd.maxY = bd.labelY;
        if (options.roundedLineCap) {
            bd.minY += bd.strokeWidth / 2;
            bd.maxY += bd.strokeWidth / 2;
        }
        bd.minX = bd.Cx - bd.Rm;
        bd.maxX = bd.Cx + bd.Rm;
    }
    else if (options.gaugeType === 'horizontalBar') {
        bd.titleY = bd.baseY + 4 * bd.fontSizeFactor +
            (options.title === '' ? 0 : options.fontTitleSize * bd.fontSizeFactor);
        bd.titleBottom = bd.titleY + (options.title === '' ? 0 : 4) * bd.fontSizeFactor;
        bd.valueY = bd.titleBottom +
            (options.hideValue ? 0 : options.fontValueSize * bd.fontSizeFactor);
        bd.barTop = bd.valueY + 8 * bd.fontSizeFactor;
        bd.barBottom = bd.barTop + bd.strokeWidth;
        if (options.hideMinMax && options.label === '') {
            bd.labelY = bd.barBottom;
            bd.barLeft = bd.origBaseX + options.fontMinMaxSize / 3 * bd.fontSizeFactor;
            bd.barRight = bd.origBaseX + w + /*bd.width*/ -options.fontMinMaxSize / 3 * bd.fontSizeFactor;
        }
        else {
            context.font = Drawings.font(options, 'MinMax', bd.fontSizeFactor);
            var minTextWidth = context.measureText(options.minValue + '').width;
            var maxTextWidth = context.measureText(options.maxValue + '').width;
            var maxW = Math.max(minTextWidth, maxTextWidth);
            bd.minX = bd.origBaseX + maxW / 2 + options.fontMinMaxSize / 3 * bd.fontSizeFactor;
            bd.maxX = bd.origBaseX + w + /*bd.width*/ -maxW / 2 - options.fontMinMaxSize / 3 * bd.fontSizeFactor;
            bd.barLeft = bd.minX;
            bd.barRight = bd.maxX;
            bd.labelY = bd.barBottom + (8 + options.fontLabelSize) * bd.fontSizeFactor;
            bd.minY = bd.maxY = bd.labelY;
        }
    }
    else if (options.gaugeType === 'verticalBar') {
        bd.titleY = bd.baseY + ((options.title === '' ? 0 : options.fontTitleSize) + 8) * bd.fontSizeFactor;
        bd.titleBottom = bd.titleY + (options.title === '' ? 0 : 4) * bd.fontSizeFactor;
        bd.valueY = bd.titleBottom + (options.hideValue ? 0 : options.fontValueSize * bd.fontSizeFactor);
        bd.barTop = bd.valueY + 8 * bd.fontSizeFactor;
        bd.labelY = bd.baseY + bd.height - 16;
        if (options.label === '') {
            bd.barBottom = bd.labelY;
        }
        else {
            bd.barBottom = bd.labelY - (8 + options.fontLabelSize) * bd.fontSizeFactor;
        }
        bd.minX = bd.maxX =
            bd.baseX + bd.width / 2 + bd.strokeWidth / 2 + options.fontMinMaxSize / 3 * bd.fontSizeFactor;
        bd.minY = bd.barBottom;
        bd.maxY = bd.barTop;
        bd.fontMinMaxBaseline = 'middle';
        bd.fontMinMaxAlign = 'left';
    }
    if (options.dashThickness) {
        var circumference = void 0;
        if (options.gaugeType === 'donut') {
            circumference = Math.PI * bd.Rm * 2;
        }
        else if (options.gaugeType === 'arc') {
            circumference = Math.PI * bd.Rm;
        }
        else if (options.gaugeType === 'horizontalBar') {
            circumference = bd.barRight - bd.barLeft;
        }
        else if (options.gaugeType === 'verticalBar') {
            circumference = bd.barBottom - bd.barTop;
        }
        var dashCount = Math.floor(circumference / (options.dashThickness * bd.fontSizeFactor));
        if (options.gaugeType === 'donut') {
            // tslint:disable-next-line:no-bitwise
            dashCount = (dashCount | 1) - 1;
        }
        else {
            // tslint:disable-next-line:no-bitwise
            dashCount = (dashCount - 1) | 1;
        }
        bd.dashLength = Math.ceil(circumference / dashCount);
    }
    return bd;
}
function determineFontHeight(options, target, baseSize) {
    var fontStyleStr = 'font-style:' + options['font' + target + 'Style'] + ';font-weight:' +
        options['font' + target + 'Weight'] + ';font-size:' +
        options['font' + target + 'Size'] * baseSize + 'px;font-family:' +
        options['font' + target];
    var result = CanvasDigitalGauge.heightCache[fontStyleStr];
    if (!result) {
        var fontStyle = {
            fontFamily: options['font' + target],
            fontSize: options['font' + target + 'Size'] * baseSize + 'px',
            fontWeight: options['font' + target + 'Weight'],
            fontStyle: options['font' + target + 'Style']
        };
        var text = $('<span>Hg</span>').css(fontStyle);
        var block = $('<div style="display: inline-block; width: 1px; height: 0;"></div>');
        var div = $('<div></div>');
        div.append(text, block);
        var body = $('body');
        body.append(div);
        try {
            result = {};
            block.css({ verticalAlign: 'baseline' });
            result.ascent = block.offset().top - text.offset().top;
            block.css({ verticalAlign: 'bottom' });
            result.height = block.offset().top - text.offset().top;
            result.descent = result.height - result.ascent;
        }
        finally {
            div.remove();
        }
        CanvasDigitalGauge.heightCache[fontStyleStr] = result;
    }
    return result;
}
function drawBackground(context, options) {
    var _a = context.barDimensions, barLeft = _a.barLeft, barRight = _a.barRight, barTop = _a.barTop, barBottom = _a.barBottom, width = _a.width, baseX = _a.baseX, strokeWidth = _a.strokeWidth;
    if (context.barDimensions.dashLength) {
        context.setLineDash([context.barDimensions.dashLength]);
    }
    context.beginPath();
    context.strokeStyle = options.gaugeColor;
    context.lineWidth = strokeWidth;
    if (options.roundedLineCap) {
        context.lineCap = 'round';
    }
    if (options.gaugeType === 'donut') {
        context.arc(context.barDimensions.Cx, context.barDimensions.Cy, context.barDimensions.Rm, options.donutStartAngle, options.donutEndAngle);
        context.stroke();
    }
    else if (options.gaugeType === 'arc') {
        context.arc(context.barDimensions.Cx, context.barDimensions.Cy, context.barDimensions.Rm, Math.PI, 2 * Math.PI);
        context.stroke();
    }
    else if (options.gaugeType === 'horizontalBar') {
        context.moveTo(barLeft, barTop + strokeWidth / 2);
        context.lineTo(barRight, barTop + strokeWidth / 2);
        context.stroke();
    }
    else if (options.gaugeType === 'verticalBar') {
        context.moveTo(baseX + width / 2, barBottom);
        context.lineTo(baseX + width / 2, barTop);
        context.stroke();
    }
}
function drawText(context, options, target, text, textX, textY) {
    context.fillStyle = options[(options.neonGlowBrightness ? 'neonColor' : 'color') + target];
    context.fillText(text, textX, textY);
}
function drawDigitalTitle(context, options) {
    if (!options.title || typeof options.title !== 'string') {
        return;
    }
    var _a = context.barDimensions, titleY = _a.titleY, width = _a.width, baseX = _a.baseX, fontSizeFactor = _a.fontSizeFactor;
    var textX = Math.round(baseX + width / 2);
    var textY = titleY;
    context.save();
    context.textAlign = 'center';
    context.font = Drawings.font(options, 'Title', fontSizeFactor);
    context.lineWidth = 0;
    drawText(context, options, 'Title', options.title.toUpperCase(), textX, textY);
}
function drawDigitalLabel(context, options) {
    if (!options.label || options.label === '') {
        return;
    }
    var _a = context.barDimensions, labelY = _a.labelY, baseX = _a.baseX, width = _a.width, fontSizeFactor = _a.fontSizeFactor;
    var textX = Math.round(baseX + width / 2);
    var textY = labelY;
    context.save();
    context.textAlign = 'center';
    context.font = Drawings.font(options, 'Label', fontSizeFactor);
    context.lineWidth = 0;
    drawText(context, options, 'Label', options.label, textX, textY);
}
function drawDigitalMinMax(context, options) {
    if (options.hideMinMax || options.gaugeType === 'donut') {
        return;
    }
    var _a = context.barDimensions, minY = _a.minY, maxY = _a.maxY, minX = _a.minX, maxX = _a.maxX, fontSizeFactor = _a.fontSizeFactor, fontMinMaxAlign = _a.fontMinMaxAlign, fontMinMaxBaseline = _a.fontMinMaxBaseline;
    context.save();
    context.textAlign = fontMinMaxAlign;
    context.textBaseline = fontMinMaxBaseline;
    context.font = Drawings.font(options, 'MinMax', fontSizeFactor);
    context.lineWidth = 0;
    drawText(context, options, 'MinMax', options.minValue + '', minX, minY);
    drawText(context, options, 'MinMax', options.maxValue + '', maxX, maxY);
}
function drawDigitalValue(context, options, value) {
    if (options.hideValue) {
        return;
    }
    var _a = context.barDimensions, valueY = _a.valueY, baseX = _a.baseX, width = _a.width, fontSizeFactor = _a.fontSizeFactor, fontValueBaseline = _a.fontValueBaseline;
    var textX = Math.round(baseX + width / 2);
    var textY = valueY;
    var text = options.valueText || Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["padValue"])(value, options.valueDec);
    text += options.symbol;
    context.save();
    context.textAlign = 'center';
    context.textBaseline = fontValueBaseline;
    context.font = Drawings.font(options, 'Value', fontSizeFactor);
    context.lineWidth = 0;
    drawText(context, options, 'Value', text, textX, textY);
}
function getProgressColor(progress, colorsRange) {
    if (progress === 0 || colorsRange.length === 1) {
        return colorsRange[0].rgbString;
    }
    for (var j = 0; j < colorsRange.length; j++) {
        if (progress <= colorsRange[j].pct) {
            var lower = colorsRange[j - 1];
            var upper = colorsRange[j];
            var range = upper.pct - lower.pct;
            var rangePct = (progress - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = tinycolor({
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            });
            return color.toRgbString();
        }
    }
}
function drawArcGlow(context, Cx, Cy, Ri, Rm, Ro, color, progress, isDonut, donutStartAngle, donutEndAngle) {
    context.setLineDash([]);
    var strokeWidth = Ro - Ri;
    var blur = 0.55;
    var edge = strokeWidth * blur;
    context.lineWidth = strokeWidth + edge;
    var stop = blur / (2 * blur + 2);
    var glowGradient = context.createRadialGradient(Cx, Cy, Ri - edge / 2, Cx, Cy, Ro + edge / 2);
    var color1 = tinycolor(color).setAlpha(0.5).toRgbString();
    var color2 = tinycolor(color).setAlpha(0).toRgbString();
    glowGradient.addColorStop(0, color2);
    glowGradient.addColorStop(stop, color1);
    glowGradient.addColorStop(1.0 - stop, color1);
    glowGradient.addColorStop(1, color2);
    context.strokeStyle = glowGradient;
    context.beginPath();
    var e = 0.01 * Math.PI;
    if (isDonut) {
        context.arc(Cx, Cy, Rm, donutStartAngle - e, donutStartAngle +
            (donutEndAngle - donutStartAngle) * progress + e);
    }
    else {
        context.arc(Cx, Cy, Rm, Math.PI - e, Math.PI + Math.PI * progress + e);
    }
    context.stroke();
}
function drawBarGlow(context, startX, startY, endX, endY, color, strokeWidth, isVertical) {
    context.setLineDash([]);
    var blur = 0.55;
    var edge = strokeWidth * blur;
    context.lineWidth = strokeWidth + edge;
    var stop = blur / (2 * blur + 2);
    var gradientStartX = isVertical ? startX - context.lineWidth / 2 : 0;
    var gradientStartY = isVertical ? 0 : startY - context.lineWidth / 2;
    var gradientStopX = isVertical ? startX + context.lineWidth / 2 : 0;
    var gradientStopY = isVertical ? 0 : startY + context.lineWidth / 2;
    var glowGradient = context.createLinearGradient(gradientStartX, gradientStartY, gradientStopX, gradientStopY);
    var color1 = tinycolor(color).setAlpha(0.5).toRgbString();
    var color2 = tinycolor(color).setAlpha(0).toRgbString();
    glowGradient.addColorStop(0, color2);
    glowGradient.addColorStop(stop, color1);
    glowGradient.addColorStop(1.0 - stop, color1);
    glowGradient.addColorStop(1, color2);
    context.strokeStyle = glowGradient;
    var dx = isVertical ? 0 : 0.05 * context.lineWidth;
    var dy = isVertical ? 0.05 * context.lineWidth : 0;
    context.beginPath();
    context.moveTo(startX - dx, startY + dy);
    context.lineTo(endX + dx, endY - dy);
    context.stroke();
}
function drawTickArc(context, tickValues, Cx, Cy, Ri, Rm, Ro, startAngle, endAngle, color, tickWidth) {
    if (!tickValues.length) {
        return;
    }
    var strokeWidth = Ro - Ri;
    context.beginPath();
    context.lineWidth = tickWidth;
    context.strokeStyle = color;
    for (var _i = 0, tickValues_1 = tickValues; _i < tickValues_1.length; _i++) {
        var tick = tickValues_1[_i];
        var angle = startAngle + tick * endAngle;
        var x1 = Cx + (Ri + strokeWidth) * Math.cos(angle);
        var y1 = Cy + (Ri + strokeWidth) * Math.sin(angle);
        var x2 = Cx + Ri * Math.cos(angle);
        var y2 = Cy + Ri * Math.sin(angle);
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
    }
    context.stroke();
}
function drawTickBar(context, tickValues, startX, startY, distanceBar, strokeWidth, isVertical, color, tickWidth) {
    if (!tickValues.length) {
        return;
    }
    context.beginPath();
    context.lineWidth = tickWidth;
    context.strokeStyle = color;
    for (var _i = 0, tickValues_2 = tickValues; _i < tickValues_2.length; _i++) {
        var tick = tickValues_2[_i];
        var tickValue = tick * distanceBar;
        if (isVertical) {
            context.moveTo(startX - strokeWidth / 2, startY + tickValue - distanceBar);
            context.lineTo(startX + strokeWidth / 2, startY + tickValue - distanceBar);
        }
        else {
            context.moveTo(startX + tickValue, startY);
            context.lineTo(startX + tickValue, startY + strokeWidth);
        }
    }
    context.stroke();
}
function drawProgress(context, options, progress) {
    var neonColor;
    if (options.neonGlowBrightness) {
        context.currentColor = neonColor = getProgressColor(progress, options.neonColorsRange);
    }
    else {
        context.currentColor = context.strokeStyle = getProgressColor(progress, options.colorsRange);
    }
    var _a = context.barDimensions, barLeft = _a.barLeft, barRight = _a.barRight, barTop = _a.barTop, baseX = _a.baseX, width = _a.width, barBottom = _a.barBottom, Cx = _a.Cx, Cy = _a.Cy, Rm = _a.Rm, Ro = _a.Ro, Ri = _a.Ri, strokeWidth = _a.strokeWidth;
    if (context.barDimensions.dashLength) {
        context.setLineDash([context.barDimensions.dashLength]);
    }
    context.lineWidth = strokeWidth;
    if (options.roundedLineCap) {
        context.lineCap = 'round';
    }
    else {
        context.lineCap = 'butt';
    }
    if (options.gaugeType === 'donut') {
        if (options.neonGlowBrightness) {
            context.strokeStyle = neonColor;
        }
        context.beginPath();
        context.arc(Cx, Cy, Rm, options.donutStartAngle, options.donutStartAngle +
            (options.donutEndAngle - options.donutStartAngle) * progress);
        context.stroke();
        if (options.neonGlowBrightness && !options.isMobile) {
            drawArcGlow(context, Cx, Cy, Ri, Rm, Ro, neonColor, progress, true, options.donutStartAngle, options.donutEndAngle);
        }
        drawTickArc(context, options.ticksValue, Cx, Cy, Ri, Rm, Ro, options.donutStartAngle, options.donutEndAngle - options.donutStartAngle, options.colorTicks, options.tickWidth);
    }
    else if (options.gaugeType === 'arc') {
        if (options.neonGlowBrightness) {
            context.strokeStyle = neonColor;
        }
        context.beginPath();
        context.arc(Cx, Cy, Rm, Math.PI, Math.PI + Math.PI * progress);
        context.stroke();
        if (options.neonGlowBrightness && !options.isMobile) {
            drawArcGlow(context, Cx, Cy, Ri, Rm, Ro, neonColor, progress, false);
        }
        drawTickArc(context, options.ticksValue, Cx, Cy, Ri, Rm, Ro, Math.PI, Math.PI, options.colorTicks, options.tickWidth);
    }
    else if (options.gaugeType === 'horizontalBar') {
        if (options.neonGlowBrightness) {
            context.strokeStyle = neonColor;
        }
        context.beginPath();
        context.moveTo(barLeft, barTop + strokeWidth / 2);
        context.lineTo(barLeft + (barRight - barLeft) * progress, barTop + strokeWidth / 2);
        context.stroke();
        if (options.neonGlowBrightness && !options.isMobile) {
            drawBarGlow(context, barLeft, barTop + strokeWidth / 2, barLeft + (barRight - barLeft) * progress, barTop + strokeWidth / 2, neonColor, strokeWidth, false);
        }
        drawTickBar(context, options.ticksValue, barLeft, barTop, barRight - barLeft, strokeWidth, false, options.colorTicks, options.tickWidth);
    }
    else if (options.gaugeType === 'verticalBar') {
        if (options.neonGlowBrightness) {
            context.strokeStyle = neonColor;
        }
        context.beginPath();
        context.moveTo(baseX + width / 2, barBottom);
        context.lineTo(baseX + width / 2, barBottom - (barBottom - barTop) * progress);
        context.stroke();
        if (options.neonGlowBrightness && !options.isMobile) {
            drawBarGlow(context, baseX + width / 2, barBottom, baseX + width / 2, barBottom - (barBottom - barTop) * progress, neonColor, strokeWidth, true);
        }
        drawTickBar(context, options.ticksValue, baseX + width / 2, barTop, barTop - barBottom, strokeWidth, true, options.colorTicks, options.tickWidth);
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "xexB")))

/***/ })

}]);
//# sourceMappingURL=default~home-components-widget-lib-canvas-digital-gauge~home-components-widget-lib-digital-gauge.js.map