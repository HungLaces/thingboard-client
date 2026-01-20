(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-components-widget-lib-analogue-linear-gauge"],{

/***/ "QfAU":
/*!*****************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/analogue-linear-gauge.ts ***!
  \*****************************************************************************/
/*! exports provided: TbAnalogueLinearGauge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TbAnalogueLinearGauge", function() { return TbAnalogueLinearGauge; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-gauges */ "rxPF");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_gauges__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @home/components/widget/lib/analogue-gauge.models */ "r6Bh");
/* harmony import */ var _home_components_widget_lib_analogue_linear_gauge_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @home/components/widget/lib/analogue-linear-gauge.models */ "Zs6V");
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/utils */ "//Q6");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tinycolor2 */ "Zss7");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tinycolor2__WEBPACK_IMPORTED_MODULE_5__);
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






var LinearGauge = canvas_gauges__WEBPACK_IMPORTED_MODULE_1__["LinearGauge"];
var tinycolor = tinycolor2__WEBPACK_IMPORTED_MODULE_5__;
var analogueLinearGaugeSettingsSchemaValue = Object(_home_components_widget_lib_analogue_linear_gauge_models__WEBPACK_IMPORTED_MODULE_3__["getAnalogueLinearGaugeSettingsSchema"])();
// @dynamic
var TbAnalogueLinearGauge = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(TbAnalogueLinearGauge, _super);
    function TbAnalogueLinearGauge(ctx, canvasId) {
        return _super.call(this, ctx, canvasId) || this;
    }
    Object.defineProperty(TbAnalogueLinearGauge, "settingsSchema", {
        get: function () {
            return analogueLinearGaugeSettingsSchemaValue;
        },
        enumerable: false,
        configurable: true
    });
    TbAnalogueLinearGauge.prototype.prepareGaugeOptions = function (settings, gaugeData) {
        var dataKey = this.ctx.data[0].dataKey;
        var keyColor = settings.defaultColor || dataKey.color;
        var barStrokeColor = tinycolor(keyColor).darken().setAlpha(0.6).toRgbString();
        var progressColorStart = tinycolor(keyColor).setAlpha(0.05).toRgbString();
        var progressColorEnd = tinycolor(keyColor).darken().toRgbString();
        gaugeData.barStrokeWidth = (Object(_core_utils__WEBPACK_IMPORTED_MODULE_4__["isDefined"])(settings.barStrokeWidth) && settings.barStrokeWidth !== null) ? settings.barStrokeWidth : 2.5;
        gaugeData.colorBarStroke = settings.colorBarStroke || barStrokeColor;
        gaugeData.colorBar = settings.colorBar || '#fff';
        gaugeData.colorBarEnd = settings.colorBarEnd || '#ddd';
        gaugeData.colorBarProgress = settings.colorBarProgress || progressColorStart;
        gaugeData.colorBarProgressEnd = settings.colorBarProgressEnd || progressColorEnd;
    };
    TbAnalogueLinearGauge.prototype.createGauge = function (gaugeData) {
        return new LinearGauge(gaugeData);
    };
    return TbAnalogueLinearGauge;
}(_home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_2__["TbAnalogueGauge"]));



/***/ }),

/***/ "Zs6V":
/*!************************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/analogue-linear-gauge.models.ts ***!
  \************************************************************************************/
/*! exports provided: getAnalogueLinearGaugeSettingsSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAnalogueLinearGaugeSettingsSchema", function() { return getAnalogueLinearGaugeSettingsSchema; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @home/components/widget/lib/analogue-gauge.models */ "r6Bh");
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils */ "//Q6");
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



function getAnalogueLinearGaugeSettingsSchema() {
    var analogueLinearGaugeSettingsSchema = Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["deepClone"])(_home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_1__["analogueGaugeSettingsSchema"]);
    analogueLinearGaugeSettingsSchema.schema.properties = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, analogueLinearGaugeSettingsSchema.schema.properties), {
        barStrokeWidth: {
            title: 'Bar stroke width',
            type: 'number',
            default: 2.5
        },
        colorBarStroke: {
            title: 'Bar stroke color',
            type: 'string',
            default: null
        },
        colorBar: {
            title: 'Bar background color',
            type: 'string',
            default: '#fff'
        },
        colorBarEnd: {
            title: 'Bar background color - end gradient',
            type: 'string',
            default: '#ddd'
        },
        colorBarProgress: {
            title: 'Progress bar color',
            type: 'string',
            default: null
        },
        colorBarProgressEnd: {
            title: 'Progress bar color - end gradient',
            type: 'string',
            default: null
        }
    });
    analogueLinearGaugeSettingsSchema.form.unshift('barStrokeWidth', {
        key: 'colorBarStroke',
        type: 'color'
    }, {
        key: 'colorBar',
        type: 'color'
    }, {
        key: 'colorBarEnd',
        type: 'color'
    }, {
        key: 'colorBarProgress',
        type: 'color'
    }, {
        key: 'colorBarProgressEnd',
        type: 'color'
    });
    return analogueLinearGaugeSettingsSchema;
}


/***/ })

}]);
//# sourceMappingURL=home-components-widget-lib-analogue-linear-gauge.js.map