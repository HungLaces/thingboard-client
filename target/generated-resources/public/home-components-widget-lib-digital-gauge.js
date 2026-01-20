(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-components-widget-lib-digital-gauge"],{

/***/ "4FQJ":
/*!*********************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/digital-gauge.ts ***!
  \*********************************************************************/
/*! exports provided: TbCanvasDigitalGauge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TbCanvasDigitalGauge", function() { return TbCanvasDigitalGauge; });
/* harmony import */ var _home_components_widget_lib_digital_gauge_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @home/components/widget/lib/digital-gauge.models */ "Mpb7");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinycolor2 */ "Zss7");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinycolor2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core/utils */ "//Q6");
/* harmony import */ var _home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @home/components/widget/lib/settings.models */ "yWc6");
/* harmony import */ var _home_components_widget_lib_canvas_digital_gauge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @home/components/widget/lib/canvas-digital-gauge */ "QR2c");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _shared_models_widget_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/models/widget.models */ "0lYY");
/* harmony import */ var _shared_models_telemetry_telemetry_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/models/telemetry/telemetry.models */ "3Tyt");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ "qCKp");
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









var tinycolor = tinycolor2__WEBPACK_IMPORTED_MODULE_1__;
var digitalGaugeSettingsSchemaValue = _home_components_widget_lib_digital_gauge_models__WEBPACK_IMPORTED_MODULE_0__["digitalGaugeSettingsSchema"];
// @dynamic
var TbCanvasDigitalGauge = /** @class */ (function () {
    function TbCanvasDigitalGauge(ctx, canvasId) {
        this.ctx = ctx;
        var gaugeElement = $('#' + canvasId, ctx.$container)[0];
        var settings = ctx.settings;
        this.localSettings = {};
        this.localSettings.minValue = settings.minValue || 0;
        this.localSettings.maxValue = settings.maxValue || 100;
        this.localSettings.gaugeType = settings.gaugeType || 'arc';
        this.localSettings.neonGlowBrightness = settings.neonGlowBrightness || 0;
        this.localSettings.dashThickness = settings.dashThickness || 0;
        this.localSettings.roundedLineCap = settings.roundedLineCap === true;
        var dataKey = ctx.data[0].dataKey;
        var keyColor = settings.defaultColor || dataKey.color;
        this.localSettings.unitTitle = ((settings.showUnitTitle === true) ?
            (settings.unitTitle && settings.unitTitle.length > 0 ?
                settings.unitTitle : dataKey.label) : '');
        this.localSettings.showTimestamp = settings.showTimestamp === true;
        this.localSettings.timestampFormat = settings.timestampFormat && settings.timestampFormat.length ?
            settings.timestampFormat : 'yyyy-MM-dd HH:mm:ss';
        this.localSettings.gaugeWidthScale = settings.gaugeWidthScale || 0.75;
        this.localSettings.gaugeColor = settings.gaugeColor || tinycolor(keyColor).setAlpha(0.2).toRgbString();
        this.localSettings.useFixedLevelColor = settings.useFixedLevelColor || false;
        if (!settings.useFixedLevelColor) {
            if (!settings.levelColors || settings.levelColors.length === 0) {
                this.localSettings.levelColors = [keyColor];
            }
            else {
                this.localSettings.levelColors = settings.levelColors.slice();
            }
        }
        else {
            this.localSettings.levelColors = [keyColor];
            this.localSettings.fixedLevelColors = settings.fixedLevelColors || [];
        }
        this.localSettings.showTicks = settings.showTicks || false;
        this.localSettings.ticks = [];
        this.localSettings.ticksValue = settings.ticksValue || [];
        this.localSettings.tickWidth = settings.tickWidth || 4;
        this.localSettings.colorTicks = settings.colorTicks || '#666';
        this.localSettings.decimals = Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["isDefined"])(dataKey.decimals) ? dataKey.decimals :
            (Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["isDefinedAndNotNull"])(settings.decimals) ? settings.decimals : ctx.decimals);
        this.localSettings.units = dataKey.units && dataKey.units.length ? dataKey.units :
            (Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["isDefined"])(settings.units) && settings.units.length > 0 ? settings.units : ctx.units);
        this.localSettings.hideValue = settings.showValue !== true;
        this.localSettings.hideMinMax = settings.showMinMax !== true;
        this.localSettings.donutStartAngle = Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["isDefinedAndNotNull"])(settings.donutStartAngle) ?
            -TbCanvasDigitalGauge.toRadians(settings.donutStartAngle) : null;
        this.localSettings.title = ((settings.showTitle === true) ?
            (settings.title && settings.title.length > 0 ?
                settings.title : dataKey.label) : '');
        if (!this.localSettings.unitTitle && this.localSettings.showTimestamp) {
            this.localSettings.unitTitle = ' ';
        }
        this.localSettings.titleFont = Object(_home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_3__["prepareFontSettings"])(settings.titleFont, {
            size: 12,
            style: 'normal',
            weight: '500',
            color: keyColor
        });
        this.localSettings.valueFont = Object(_home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_3__["prepareFontSettings"])(settings.valueFont, {
            size: 18,
            style: 'normal',
            weight: '500',
            color: keyColor
        });
        this.localSettings.minMaxFont = Object(_home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_3__["prepareFontSettings"])(settings.minMaxFont, {
            size: 10,
            style: 'normal',
            weight: '500',
            color: keyColor
        });
        this.localSettings.labelFont = Object(_home_components_widget_lib_settings_models__WEBPACK_IMPORTED_MODULE_3__["prepareFontSettings"])(settings.labelFont, {
            size: 8,
            style: 'normal',
            weight: '500',
            color: keyColor
        });
        var gaugeData = {
            renderTo: gaugeElement,
            gaugeWidthScale: this.localSettings.gaugeWidthScale,
            gaugeColor: this.localSettings.gaugeColor,
            levelColors: this.localSettings.levelColors,
            colorTicks: this.localSettings.colorTicks,
            tickWidth: this.localSettings.tickWidth,
            ticks: this.localSettings.ticks,
            title: this.localSettings.title,
            fontTitleSize: this.localSettings.titleFont.size,
            fontTitleStyle: this.localSettings.titleFont.style,
            fontTitleWeight: this.localSettings.titleFont.weight,
            colorTitle: this.localSettings.titleFont.color,
            fontTitle: this.localSettings.titleFont.family,
            fontValueSize: this.localSettings.valueFont.size,
            fontValueStyle: this.localSettings.valueFont.style,
            fontValueWeight: this.localSettings.valueFont.weight,
            colorValue: this.localSettings.valueFont.color,
            fontValue: this.localSettings.valueFont.family,
            fontMinMaxSize: this.localSettings.minMaxFont.size,
            fontMinMaxStyle: this.localSettings.minMaxFont.style,
            fontMinMaxWeight: this.localSettings.minMaxFont.weight,
            colorMinMax: this.localSettings.minMaxFont.color,
            fontMinMax: this.localSettings.minMaxFont.family,
            fontLabelSize: this.localSettings.labelFont.size,
            fontLabelStyle: this.localSettings.labelFont.style,
            fontLabelWeight: this.localSettings.labelFont.weight,
            colorLabel: this.localSettings.labelFont.color,
            fontLabel: this.localSettings.labelFont.family,
            minValue: this.localSettings.minValue,
            maxValue: this.localSettings.maxValue,
            gaugeType: this.localSettings.gaugeType,
            dashThickness: this.localSettings.dashThickness,
            roundedLineCap: this.localSettings.roundedLineCap,
            symbol: this.localSettings.units,
            label: this.localSettings.unitTitle,
            showTimestamp: this.localSettings.showTimestamp,
            hideValue: this.localSettings.hideValue,
            hideMinMax: this.localSettings.hideMinMax,
            donutStartAngle: this.localSettings.donutStartAngle,
            valueDec: this.localSettings.decimals,
            neonGlowBrightness: this.localSettings.neonGlowBrightness,
            // animations
            animation: settings.animation !== false && !ctx.isMobile,
            animationDuration: Object(_core_utils__WEBPACK_IMPORTED_MODULE_2__["isDefinedAndNotNull"])(settings.animationDuration) ? settings.animationDuration : 500,
            animationRule: settings.animationRule || 'linear',
            isMobile: ctx.isMobile
        };
        this.gauge = new _home_components_widget_lib_canvas_digital_gauge__WEBPACK_IMPORTED_MODULE_4__["CanvasDigitalGauge"](gaugeData).draw();
        this.init();
    }
    Object.defineProperty(TbCanvasDigitalGauge, "settingsSchema", {
        get: function () {
            return digitalGaugeSettingsSchemaValue;
        },
        enumerable: false,
        configurable: true
    });
    TbCanvasDigitalGauge.generateDatasource = function (ctx, datasources, entityAlias, attribute, settings) {
        var entityAliasId = ctx.aliasController.getEntityAliasId(entityAlias);
        if (!entityAliasId) {
            throw new Error('Not valid entity aliase name ' + entityAlias);
        }
        var datasource = datasources.find(function (datasourceIteration) {
            return datasourceIteration.entityAliasId === entityAliasId;
        });
        var dataKey = {
            type: _shared_models_telemetry_telemetry_models__WEBPACK_IMPORTED_MODULE_7__["DataKeyType"].attribute,
            name: attribute,
            label: attribute,
            settings: [settings],
            _hash: Math.random()
        };
        if (datasource) {
            var findDataKey = datasource.dataKeys.find(function (dataKeyIteration) {
                return dataKeyIteration.name === attribute;
            });
            if (findDataKey) {
                findDataKey.settings.push(settings);
            }
            else {
                datasource.dataKeys.push(dataKey);
            }
        }
        else {
            var datasourceAttribute = {
                type: _shared_models_widget_models__WEBPACK_IMPORTED_MODULE_6__["DatasourceType"].entity,
                name: entityAlias,
                aliasName: entityAlias,
                entityAliasId: entityAliasId,
                dataKeys: [dataKey]
            };
            datasources.push(datasourceAttribute);
        }
        return datasources;
    };
    TbCanvasDigitalGauge.toRadians = function (angle) {
        return angle * (Math.PI / 180);
    };
    TbCanvasDigitalGauge.prototype.init = function () {
        var _a, _b;
        var updateSetting = false;
        if (this.localSettings.useFixedLevelColor && ((_a = this.localSettings.fixedLevelColors) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.localSettings.levelColors = this.settingLevelColorsSubscribe(this.localSettings.fixedLevelColors);
            updateSetting = true;
        }
        if (this.localSettings.showTicks && ((_b = this.localSettings.ticksValue) === null || _b === void 0 ? void 0 : _b.length)) {
            this.localSettings.ticks = this.settingTicksSubscribe(this.localSettings.ticksValue);
            updateSetting = true;
        }
        if (updateSetting) {
            this.updateSetting();
        }
    };
    TbCanvasDigitalGauge.prototype.settingLevelColorsSubscribe = function (options) {
        var _this = this;
        var levelColorsDatasource = [];
        var predefineLevelColors = [];
        function setLevelColor(levelSetting, color) {
            if (levelSetting.valueSource === 'predefinedValue' && isFinite(levelSetting.value)) {
                predefineLevelColors.push({
                    value: levelSetting.value,
                    color: color
                });
            }
            else if (levelSetting.entityAlias && levelSetting.attribute) {
                try {
                    levelColorsDatasource = TbCanvasDigitalGauge.generateDatasource(this.ctx, levelColorsDatasource, levelSetting.entityAlias, levelSetting.attribute, { color: color, index: predefineLevelColors.length });
                }
                catch (e) {
                    return;
                }
                predefineLevelColors.push(null);
            }
        }
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var levelColor = options_1[_i];
            if (levelColor.from) {
                setLevelColor.call(this, levelColor.from, levelColor.color);
            }
            if (levelColor.to) {
                setLevelColor.call(this, levelColor.to, levelColor.color);
            }
        }
        this.subscribeAttributes(levelColorsDatasource, 'levelColors').subscribe(function (subscription) {
            _this.levelColorsSourcesSubscription = subscription;
        });
        return predefineLevelColors;
    };
    TbCanvasDigitalGauge.prototype.settingTicksSubscribe = function (options) {
        var _this = this;
        var ticksDatasource = [];
        var predefineTicks = [];
        for (var _i = 0, options_2 = options; _i < options_2.length; _i++) {
            var tick = options_2[_i];
            if (tick.valueSource === 'predefinedValue' && isFinite(tick.value)) {
                predefineTicks.push(tick.value);
            }
            else if (tick.entityAlias && tick.attribute) {
                try {
                    ticksDatasource = TbCanvasDigitalGauge
                        .generateDatasource(this.ctx, ticksDatasource, tick.entityAlias, tick.attribute, predefineTicks.length);
                }
                catch (e) {
                    continue;
                }
                predefineTicks.push(null);
            }
        }
        this.subscribeAttributes(ticksDatasource, 'ticks').subscribe(function (subscription) {
            _this.ticksSourcesSubscription = subscription;
        });
        return predefineTicks;
    };
    TbCanvasDigitalGauge.prototype.subscribeAttributes = function (datasource, typeAttributes) {
        var _this = this;
        if (!datasource.length) {
            return rxjs__WEBPACK_IMPORTED_MODULE_8__["EMPTY"];
        }
        var levelColorsSourcesSubscriptionOptions = {
            datasources: datasource,
            useDashboardTimewindow: false,
            type: _shared_models_widget_models__WEBPACK_IMPORTED_MODULE_6__["widgetType"].latest,
            callbacks: {
                onDataUpdated: function (subscription) {
                    _this.updateAttribute(subscription.data, typeAttributes);
                }
            }
        };
        return this.ctx.subscriptionApi.createSubscription(levelColorsSourcesSubscriptionOptions, true);
    };
    TbCanvasDigitalGauge.prototype.updateAttribute = function (data, typeAttributes) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var keyData = data_1[_i];
            if (keyData && keyData.data && keyData.data[0]) {
                var attrValue = keyData.data[0][1];
                if (isFinite(attrValue)) {
                    for (var _a = 0, _b = keyData.dataKey.settings; _a < _b.length; _a++) {
                        var setting = _b[_a];
                        switch (typeAttributes) {
                            case 'levelColors':
                                this.localSettings.levelColors[setting.index] = {
                                    value: attrValue,
                                    color: setting.color
                                };
                                break;
                            case 'ticks':
                                this.localSettings.ticks[setting] = attrValue;
                                break;
                        }
                    }
                }
            }
        }
        this.updateSetting();
    };
    TbCanvasDigitalGauge.prototype.updateSetting = function () {
        this.gauge.options.ticks = this.localSettings.ticks;
        this.gauge.options.levelColors = this.localSettings.levelColors;
        this.gauge.options = _home_components_widget_lib_canvas_digital_gauge__WEBPACK_IMPORTED_MODULE_4__["CanvasDigitalGauge"].configure(this.gauge.options);
        this.gauge.update({});
    };
    TbCanvasDigitalGauge.prototype.update = function () {
        if (this.ctx.data.length > 0) {
            var cellData = this.ctx.data[0];
            if (cellData.data.length > 0) {
                var tvPair = cellData.data[cellData.data.length -
                    1];
                var timestamp = void 0;
                if (this.localSettings.showTimestamp) {
                    timestamp = tvPair[0];
                    var filter = this.ctx.$injector.get(_angular_common__WEBPACK_IMPORTED_MODULE_5__["DatePipe"]);
                    this.gauge.options.label =
                        filter.transform(timestamp, this.localSettings.timestampFormat);
                }
                var value = tvPair[1];
                if (value !== this.gauge.value) {
                    if (!this.gauge.options.animation) {
                        this.gauge._value = value;
                    }
                    this.gauge.value = value;
                }
                else if (this.localSettings.showTimestamp && this.gauge.timestamp !== timestamp) {
                    this.gauge.timestamp = timestamp;
                }
            }
        }
    };
    TbCanvasDigitalGauge.prototype.mobileModeChanged = function () {
        var animation = this.ctx.settings.animation !== false && !this.ctx.isMobile;
        this.gauge.update({ animation: animation, isMobile: this.ctx.isMobile });
    };
    TbCanvasDigitalGauge.prototype.resize = function () {
        this.gauge.update({ width: this.ctx.width, height: this.ctx.height });
    };
    return TbCanvasDigitalGauge;
}());


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "xexB")))

/***/ }),

/***/ "Mpb7":
/*!****************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/digital-gauge.models.ts ***!
  \****************************************************************************/
/*! exports provided: digitalGaugeSettingsSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "digitalGaugeSettingsSchema", function() { return digitalGaugeSettingsSchema; });
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
var digitalGaugeSettingsSchema = {
    schema: {
        type: 'object',
        title: 'Settings',
        properties: {
            minValue: {
                title: 'Minimum value',
                type: 'number',
                default: 0
            },
            maxValue: {
                title: 'Maximum value',
                type: 'number',
                default: 100
            },
            gaugeType: {
                title: 'Gauge type',
                type: 'string',
                default: 'arc'
            },
            donutStartAngle: {
                title: 'Angle to start from when in donut mode',
                type: 'number',
                default: 90
            },
            neonGlowBrightness: {
                title: 'Neon glow effect brightness, (0-100), 0 - disable effect',
                type: 'number',
                default: 0
            },
            dashThickness: {
                title: 'Thickness of the stripes, 0 - no stripes',
                type: 'number',
                default: 0
            },
            roundedLineCap: {
                title: 'Display rounded line cap',
                type: 'boolean',
                default: false
            },
            title: {
                title: 'Gauge title',
                type: 'string',
                default: null
            },
            showTitle: {
                title: 'Show gauge title',
                type: 'boolean',
                default: false
            },
            unitTitle: {
                title: 'Unit title',
                type: 'string',
                default: null
            },
            showUnitTitle: {
                title: 'Show unit title',
                type: 'boolean',
                default: false
            },
            showTimestamp: {
                title: 'Show value timestamp',
                type: 'boolean',
                default: false
            },
            timestampFormat: {
                title: 'Timestamp format',
                type: 'string',
                default: 'yyyy-MM-dd HH:mm:ss'
            },
            showValue: {
                title: 'Show value text',
                type: 'boolean',
                default: true
            },
            showMinMax: {
                title: 'Show min and max values',
                type: 'boolean',
                default: true
            },
            gaugeWidthScale: {
                title: 'Width of the gauge element',
                type: 'number',
                default: 0.75
            },
            defaultColor: {
                title: 'Default color',
                type: 'string',
                default: null
            },
            gaugeColor: {
                title: 'Background color of the gauge element',
                type: 'string',
                default: null
            },
            useFixedLevelColor: {
                title: 'Use precise value for the color indicator',
                type: 'boolean',
                default: false
            },
            levelColors: {
                title: 'Colors of indicator, from lower to upper',
                type: 'array',
                items: {
                    title: 'Color',
                    type: 'string'
                }
            },
            fixedLevelColors: {
                title: 'The colors for the indicator using boundary values',
                type: 'array',
                items: {
                    title: 'levelColor',
                    type: 'object',
                    properties: {
                        from: {
                            title: 'From',
                            type: 'object',
                            properties: {
                                valueSource: {
                                    title: '[From] Value source',
                                    type: 'string',
                                    default: 'predefinedValue'
                                },
                                entityAlias: {
                                    title: '[From] Source entity alias',
                                    type: 'string'
                                },
                                attribute: {
                                    title: '[From] Source entity attribute',
                                    type: 'string'
                                },
                                value: {
                                    title: '[From] Value (if predefined value is selected)',
                                    type: 'number'
                                }
                            }
                        },
                        to: {
                            title: 'To',
                            type: 'object',
                            properties: {
                                valueSource: {
                                    title: '[To] Value source',
                                    type: 'string',
                                    default: 'predefinedValue'
                                },
                                entityAlias: {
                                    title: '[To] Source entity alias',
                                    type: 'string'
                                },
                                attribute: {
                                    title: '[To] Source entity attribute',
                                    type: 'string'
                                },
                                value: {
                                    title: '[To] Value (if predefined value is selected)',
                                    type: 'number'
                                }
                            }
                        },
                        color: {
                            title: 'Color',
                            type: 'string'
                        }
                    }
                }
            },
            showTicks: {
                title: 'Show ticks',
                type: 'boolean',
                default: false
            },
            tickWidth: {
                title: 'Width ticks',
                type: 'number',
                default: 4
            },
            colorTicks: {
                title: 'Color ticks',
                type: 'string',
                default: '#666'
            },
            ticksValue: {
                title: 'The ticks predefined value',
                type: 'array',
                items: {
                    title: 'tickValue',
                    type: 'object',
                    properties: {
                        valueSource: {
                            title: 'Value source',
                            type: 'string',
                            default: 'predefinedValue'
                        },
                        entityAlias: {
                            title: 'Source entity alias',
                            type: 'string'
                        },
                        attribute: {
                            title: 'Source entity attribute',
                            type: 'string'
                        },
                        value: {
                            title: 'Value (if predefined value is selected)',
                            type: 'number'
                        }
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
                default: 'linear'
            },
            titleFont: {
                title: 'Gauge title font',
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
                        default: 12
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
                        default: null
                    }
                }
            },
            labelFont: {
                title: 'Font of label showing under value',
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
                        default: 8
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
                        default: null
                    }
                }
            },
            valueFont: {
                title: 'Font of label showing current value',
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
                        default: 18
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
                        default: null
                    }
                }
            },
            minMaxFont: {
                title: 'Font of minimum and maximum labels',
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
                        default: 10
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
                        default: null
                    }
                }
            }
        }
    },
    form: [
        'minValue',
        'maxValue',
        {
            key: 'gaugeType',
            type: 'rc-select',
            multiple: false,
            items: [
                {
                    value: 'arc',
                    label: 'Arc'
                },
                {
                    value: 'donut',
                    label: 'Donut'
                },
                {
                    value: 'horizontalBar',
                    label: 'Horizontal bar'
                },
                {
                    value: 'verticalBar',
                    label: 'Vertical bar'
                }
            ]
        },
        'donutStartAngle',
        'neonGlowBrightness',
        'dashThickness',
        'roundedLineCap',
        'title',
        'showTitle',
        'unitTitle',
        'showUnitTitle',
        'showTimestamp',
        'timestampFormat',
        'showValue',
        'showMinMax',
        'gaugeWidthScale',
        {
            key: 'defaultColor',
            type: 'color'
        },
        {
            key: 'gaugeColor',
            type: 'color'
        },
        'useFixedLevelColor',
        {
            key: 'levelColors',
            condition: 'model.useFixedLevelColor !== true',
            items: [
                {
                    key: 'levelColors[]',
                    type: 'color'
                }
            ]
        },
        {
            key: 'fixedLevelColors',
            condition: 'model.useFixedLevelColor === true',
            items: [
                {
                    key: 'fixedLevelColors[].from.valueSource',
                    type: 'rc-select',
                    multiple: false,
                    items: [
                        {
                            value: 'predefinedValue',
                            label: 'Predefined value (Default)'
                        },
                        {
                            value: 'entityAttribute',
                            label: 'Value taken from entity attribute'
                        }
                    ]
                },
                'fixedLevelColors[].from.value',
                'fixedLevelColors[].from.entityAlias',
                'fixedLevelColors[].from.attribute',
                {
                    key: 'fixedLevelColors[].to.valueSource',
                    type: 'rc-select',
                    multiple: false,
                    items: [
                        {
                            value: 'predefinedValue',
                            label: 'Predefined value (Default)'
                        },
                        {
                            value: 'entityAttribute',
                            label: 'Value taken from entity attribute'
                        }
                    ]
                },
                'fixedLevelColors[].to.value',
                'fixedLevelColors[].to.entityAlias',
                'fixedLevelColors[].to.attribute',
                {
                    key: 'fixedLevelColors[].color',
                    type: 'color'
                }
            ]
        },
        'showTicks',
        {
            key: 'tickWidth',
            condition: 'model.showTicks === true'
        },
        {
            key: 'colorTicks',
            condition: 'model.showTicks === true',
            type: 'color'
        },
        {
            key: 'ticksValue',
            condition: 'model.showTicks === true',
            items: [
                {
                    key: 'ticksValue[].valueSource',
                    type: 'rc-select',
                    multiple: false,
                    items: [
                        {
                            value: 'predefinedValue',
                            label: 'Predefined value (Default)'
                        },
                        {
                            value: 'entityAttribute',
                            label: 'Value taken from entity attribute'
                        }
                    ]
                },
                'ticksValue[].value',
                'ticksValue[].entityAlias',
                'ticksValue[].attribute'
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
            key: 'titleFont',
            items: [
                'titleFont.family',
                'titleFont.size',
                {
                    key: 'titleFont.style',
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
                    key: 'titleFont.weight',
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
                    key: 'titleFont.color',
                    type: 'color'
                }
            ]
        },
        {
            key: 'labelFont',
            items: [
                'labelFont.family',
                'labelFont.size',
                {
                    key: 'labelFont.style',
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
                    key: 'labelFont.weight',
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
                    key: 'labelFont.color',
                    type: 'color'
                }
            ]
        },
        {
            key: 'valueFont',
            items: [
                'valueFont.family',
                'valueFont.size',
                {
                    key: 'valueFont.style',
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
                    key: 'valueFont.weight',
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
                    key: 'valueFont.color',
                    type: 'color'
                }
            ]
        },
        {
            key: 'minMaxFont',
            items: [
                'minMaxFont.family',
                'minMaxFont.size',
                {
                    key: 'minMaxFont.style',
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
                    key: 'minMaxFont.weight',
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
                    key: 'minMaxFont.color',
                    type: 'color'
                }
            ]
        }
    ]
};


/***/ }),

/***/ "yWc6":
/*!***********************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/settings.models.ts ***!
  \***********************************************************************/
/*! exports provided: getFontFamily, prepareFontSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFontFamily", function() { return getFontFamily; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prepareFontSettings", function() { return prepareFontSettings; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
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

function getFontFamily(fontSettings) {
    var family = fontSettings && fontSettings.family ? fontSettings.family : 'Roboto';
    if (family === 'RobotoDraft') {
        family = 'Roboto';
    }
    return family;
}
function prepareFontSettings(fontSettings, defaultFontSettings) {
    var result = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, defaultFontSettings), (fontSettings || {}));
    result.family = getFontFamily(result);
    return result;
}


/***/ })

}]);
//# sourceMappingURL=home-components-widget-lib-digital-gauge.js.map