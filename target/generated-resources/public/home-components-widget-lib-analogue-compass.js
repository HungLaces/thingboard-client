(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-components-widget-lib-analogue-compass"],{

/***/ "IetM":
/*!*******************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/analogue-compass.models.ts ***!
  \*******************************************************************************/
/*! exports provided: analogueCompassSettingsSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "analogueCompassSettingsSchema", function() { return analogueCompassSettingsSchema; });
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
var analogueCompassSettingsSchema = {
    schema: {
        type: 'object',
        title: 'Settings',
        properties: {
            majorTicks: {
                title: 'Major ticks names',
                type: 'array',
                items: {
                    title: 'Tick name',
                    type: 'string'
                }
            },
            minorTicks: {
                title: 'Minor ticks count',
                type: 'number',
                default: 22
            },
            showStrokeTicks: {
                title: 'Show ticks stroke',
                type: 'boolean',
                default: false
            },
            needleCircleSize: {
                title: 'Needle circle size',
                type: 'number',
                default: 15
            },
            showBorder: {
                title: 'Show border',
                type: 'boolean',
                default: true
            },
            borderOuterWidth: {
                title: 'Border width',
                type: 'number',
                default: 10
            },
            colorPlate: {
                title: 'Plate color',
                type: 'string',
                default: '#222'
            },
            colorMajorTicks: {
                title: 'Major ticks color',
                type: 'string',
                default: '#f5f5f5'
            },
            colorMinorTicks: {
                title: 'Minor ticks color',
                type: 'string',
                default: '#ddd'
            },
            colorNeedle: {
                title: 'Needle color',
                type: 'string',
                default: '#f08080'
            },
            colorNeedleCircle: {
                title: 'Needle circle color',
                type: 'string',
                default: '#e8e8e8'
            },
            colorBorder: {
                title: 'Border color',
                type: 'string',
                default: '#ccc'
            },
            majorTickFont: {
                title: 'Major tick font',
                type: 'object',
                properties: {
                    family: {
                        title: 'Font family',
                        type: 'string',
                        default: 'Roboto'
                    },
                    size: {
                        title: 'Size',
                        type: 'number',
                        default: 20
                    },
                    style: {
                        title: 'Style',
                        type: 'string',
                        default: 'normal'
                    },
                    weight: {
                        title: 'Weight',
                        type: 'string',
                        default: '500'
                    },
                    color: {
                        title: 'color',
                        type: 'string',
                        default: '#ccc'
                    }
                }
            },
            animation: {
                title: 'Enable animation',
                type: 'boolean',
                default: true
            },
            animationDuration: {
                title: 'Animation duration',
                type: 'number',
                default: 500
            },
            animationRule: {
                title: 'Animation rule',
                type: 'string',
                default: 'cycle'
            },
            animationTarget: {
                title: 'Animation target',
                type: 'string',
                default: 'needle'
            }
        },
        required: []
    },
    form: [
        {
            key: 'majorTicks',
            items: [
                'majorTicks[]'
            ]
        },
        'minorTicks',
        'showStrokeTicks',
        'needleCircleSize',
        'showBorder',
        'borderOuterWidth',
        {
            key: 'colorPlate',
            type: 'color'
        },
        {
            key: 'colorMajorTicks',
            type: 'color'
        },
        {
            key: 'colorMinorTicks',
            type: 'color'
        },
        {
            key: 'colorNeedle',
            type: 'color'
        },
        {
            key: 'colorNeedleCircle',
            type: 'color'
        },
        {
            key: 'colorBorder',
            type: 'color'
        },
        {
            key: 'majorTickFont',
            items: [
                'majorTickFont.family',
                'majorTickFont.size',
                {
                    key: 'majorTickFont.style',
                    type: 'rc-select',
                    multiple: false,
                    items: [
                        {
                            value: 'normal',
                            label: 'Normal'
                        },
                        {
                            value: 'italic',
                            label: 'Italic'
                        },
                        {
                            value: 'oblique',
                            label: 'Oblique'
                        }
                    ]
                },
                {
                    key: 'majorTickFont.weight',
                    type: 'rc-select',
                    multiple: false,
                    items: [
                        {
                            value: 'normal',
                            label: 'Normal'
                        },
                        {
                            value: 'bold',
                            label: 'Bold'
                        },
                        {
                            value: 'bolder',
                            label: 'Bolder'
                        },
                        {
                            value: 'lighter',
                            label: 'Lighter'
                        },
                        {
                            value: '100',
                            label: '100'
                        },
                        {
                            value: '200',
                            label: '200'
                        },
                        {
                            value: '300',
                            label: '300'
                        },
                        {
                            value: '400',
                            label: '400'
                        },
                        {
                            value: '500',
                            label: '500'
                        },
                        {
                            value: '600',
                            label: '600'
                        },
                        {
                            value: '700',
                            label: '700'
                        },
                        {
                            value: '800',
                            label: '800'
                        },
                        {
                            value: '900',
                            label: '900'
                        }
                    ]
                },
                {
                    key: 'majorTickFont.color',
                    type: 'color'
                }
            ]
        },
        'animation',
        'animationDuration',
        {
            key: 'animationRule',
            type: 'rc-select',
            multiple: false,
            items: [
                {
                    value: 'linear',
                    label: 'Linear'
                },
                {
                    value: 'quad',
                    label: 'Quad'
                },
                {
                    value: 'quint',
                    label: 'Quint'
                },
                {
                    value: 'cycle',
                    label: 'Cycle'
                },
                {
                    value: 'bounce',
                    label: 'Bounce'
                },
                {
                    value: 'elastic',
                    label: 'Elastic'
                },
                {
                    value: 'dequad',
                    label: 'Dequad'
                },
                {
                    value: 'dequint',
                    label: 'Dequint'
                },
                {
                    value: 'decycle',
                    label: 'Decycle'
                },
                {
                    value: 'debounce',
                    label: 'Debounce'
                },
                {
                    value: 'delastic',
                    label: 'Delastic'
                }
            ]
        },
        {
            key: 'animationTarget',
            type: 'rc-select',
            multiple: false,
            items: [
                {
                    value: 'needle',
                    label: 'Needle'
                },
                {
                    value: 'plate',
                    label: 'Plate'
                }
            ]
        }
    ]
};


/***/ }),

/***/ "NZZV":
/*!************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/analogue-compass.ts ***!
  \************************************************************************/
/*! exports provided: TbAnalogueCompass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TbAnalogueCompass", function() { return TbAnalogueCompass; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-gauges */ "rxPF");
/* harmony import */ var canvas_gauges__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(canvas_gauges__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_components_widget_lib_analogue_compass_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @home/components/widget/lib/analogue-compass.models */ "IetM");
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @core/utils */ "//Q6");
/* harmony import */ var _home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @home/components/widget/lib/settings.models */ "yWc6");
/* harmony import */ var _home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @home/components/widget/lib/analogue-gauge.models */ "r6Bh");
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
var analogueCompassSettingsSchemaValue = _home_components_widget_lib_analogue_compass_models__WEBPACK_IMPORTED_MODULE_2__["analogueCompassSettingsSchema"];
// @dynamic
var TbAnalogueCompass = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(TbAnalogueCompass, _super);
    function TbAnalogueCompass(ctx, canvasId) {
        return _super.call(this, ctx, canvasId) || this;
    }
    Object.defineProperty(TbAnalogueCompass, "settingsSchema", {
        get: function () {
            return analogueCompassSettingsSchemaValue;
        },
        enumerable: false,
        configurable: true
    });
    TbAnalogueCompass.prototype.createGaugeOptions = function (gaugeElement, settings) {
        var majorTicks = (settings.majorTicks && settings.majorTicks.length > 0) ? Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(settings.majorTicks) :
            ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        majorTicks.push(majorTicks[0]);
        return {
            renderTo: gaugeElement,
            // Generic options
            minValue: 0,
            maxValue: 360,
            majorTicks: majorTicks,
            minorTicks: settings.minorTicks || 22,
            ticksAngle: 360,
            startAngle: 180,
            strokeTicks: settings.showStrokeTicks || false,
            highlights: [],
            valueBox: false,
            // needle
            needleCircleSize: settings.needleCircleSize || 15,
            needleType: 'line',
            needleStart: 75,
            needleEnd: 99,
            needleWidth: 3,
            needleCircleOuter: false,
            // borders
            borders: settings.showBorder || false,
            borderInnerWidth: 0,
            borderMiddleWidth: 0,
            borderOuterWidth: settings.borderOuterWidth || 10,
            borderShadowWidth: 0,
            // colors
            colorPlate: settings.colorPlate || '#222',
            colorMajorTicks: settings.colorMajorTicks || '#f5f5f5',
            colorMinorTicks: settings.colorMinorTicks || '#ddd',
            colorNeedle: settings.colorNeedle || '#f08080',
            colorNeedleEnd: settings.colorNeedle || '#f08080',
            colorNeedleCircleInner: settings.colorNeedleCircle || '#e8e8e8',
            colorNeedleCircleInnerEnd: settings.colorNeedleCircle || '#e8e8e8',
            colorBorderOuter: settings.colorBorder || '#ccc',
            colorBorderOuterEnd: settings.colorBorder || '#ccc',
            colorNeedleShadowDown: '#222',
            // fonts
            fontNumbers: Object(_home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_4__["getFontFamily"])(settings.majorTickFont),
            fontNumbersSize: settings.majorTickFont && settings.majorTickFont.size ? settings.majorTickFont.size : 20,
            fontNumbersStyle: settings.majorTickFont && settings.majorTickFont.style ? settings.majorTickFont.style : 'normal',
            fontNumbersWeight: settings.majorTickFont && settings.majorTickFont.weight ? settings.majorTickFont.weight : '500',
            colorNumbers: settings.majorTickFont && settings.majorTickFont.color ? settings.majorTickFont.color : '#ccc',
            // animations
            animation: settings.animation !== false && !this.ctx.isMobile,
            animationDuration: (Object(_core_utils__WEBPACK_IMPORTED_MODULE_3__["isDefined"])(settings.animationDuration) && settings.animationDuration !== null) ? settings.animationDuration : 500,
            animationRule: settings.animationRule || 'cycle',
            animationTarget: settings.animationTarget || 'needle'
        };
    };
    TbAnalogueCompass.prototype.createGauge = function (gaugeData) {
        return new RadialGauge(gaugeData);
    };
    return TbAnalogueCompass;
}(_home_components_widget_lib_analogue_gauge_models__WEBPACK_IMPORTED_MODULE_5__["TbBaseGauge"]));



/***/ })

}]);
//# sourceMappingURL=home-components-widget-lib-analogue-compass.js.map