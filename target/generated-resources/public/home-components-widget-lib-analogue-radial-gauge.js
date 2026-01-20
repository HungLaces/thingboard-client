(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-components-widget-lib-analogue-radial-gauge"],{

/***/ "0mCz":
/*!*****************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/analogue-radial-gauge.ts ***!
  \*****************************************************************************/
/*! exports provided: TbAnalogueRadialGauge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TbAnalogueRadialGauge", function() { return TbAnalogueRadialGauge; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-gauges */ "rxPF");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_gauges__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_components_widget_lib_analogue_radial_gauge_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @home/components/widget/lib/analogue-radial-gauge.models */ "axLB");
/* harmony import */ var _home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @home/components/widget/lib/analogue-gauge.models */ "r6Bh");
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




var RadialGauge = canvas_gauges__WEBPACK_IMPORTED_MODULE_1__["RadialGauge"];
var analogueRadialGaugeSettingsSchemaValue = Object(_home_components_widget_lib_analogue_radial_gauge_models__WEBPACK_IMPORTED_MODULE_2__["getAnalogueRadialGaugeSettingsSchema"])();
// @dynamic
var TbAnalogueRadialGauge = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(TbAnalogueRadialGauge, _super);
    function TbAnalogueRadialGauge(ctx, canvasId) {
        return _super.call(this, ctx, canvasId) || this;
    }
    Object.defineProperty(TbAnalogueRadialGauge, "settingsSchema", {
        get: function () {
            return analogueRadialGaugeSettingsSchemaValue;
        },
        enumerable: false,
        configurable: true
    });
    TbAnalogueRadialGauge.prototype.prepareGaugeOptions = function (settings, gaugeData) {
        gaugeData.ticksAngle = settings.ticksAngle || 270;
        gaugeData.startAngle = settings.startAngle || 45;
        // colors
        gaugeData.colorNeedleCircleOuter = '#f0f0f0';
        gaugeData.colorNeedleCircleOuterEnd = '#ccc';
        gaugeData.colorNeedleCircleInner = '#e8e8e8'; // tinycolor(keyColor).lighten(30).toRgbString(),//'#e8e8e8',
        gaugeData.colorNeedleCircleInnerEnd = '#f5f5f5';
        // needle
        gaugeData.needleCircleSize = settings.needleCircleSize || 10;
        gaugeData.needleCircleInner = true;
        gaugeData.needleCircleOuter = true;
        // custom animations
        gaugeData.animationTarget = 'needle'; // 'needle' or 'plate'
    };
    TbAnalogueRadialGauge.prototype.createGauge = function (gaugeData) {
        return new RadialGauge(gaugeData);
    };
    return TbAnalogueRadialGauge;
}(_home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_3__["TbAnalogueGauge"]));



/***/ }),

/***/ "axLB":
/*!************************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/analogue-radial-gauge.models.ts ***!
  \************************************************************************************/
/*! exports provided: getAnalogueRadialGaugeSettingsSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAnalogueRadialGaugeSettingsSchema", function() { return getAnalogueRadialGaugeSettingsSchema; });
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



function getAnalogueRadialGaugeSettingsSchema() {
    var analogueRadialGaugeSettingsSchema = Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["deepClone"])(_home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_1__["analogueGaugeSettingsSchema"]);
    analogueRadialGaugeSettingsSchema.schema.properties = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, analogueRadialGaugeSettingsSchema.schema.properties), {
        startAngle: {
            title: 'Start ticks angle',
            type: 'number',
            default: 45
        },
        ticksAngle: {
            title: 'Ticks angle',
            type: 'number',
            default: 270
        },
        needleCircleSize: {
            title: 'Needle circle size',
            type: 'number',
            default: 10
        }
    });
    analogueRadialGaugeSettingsSchema.form.unshift('startAngle', 'ticksAngle', 'needleCircleSize');
    return analogueRadialGaugeSettingsSchema;
}


/***/ })

}]);
//# sourceMappingURL=home-components-widget-lib-analogue-radial-gauge.js.map