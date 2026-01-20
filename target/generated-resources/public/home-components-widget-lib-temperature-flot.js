(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-components-widget-lib-temperature-flot"],{

/***/ "gGQI":
/*!************************************************************************!*\
  !*** ./src/app/modules/home/components/widget/lib/temperature-flot.ts ***!
  \************************************************************************/
/*! exports provided: TemPeratureFlot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemPeratureFlot", function() { return TemPeratureFlot; });
/* harmony import */ var _app_core_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/core/utils */ "//Q6");
/* harmony import */ var _app_shared_models_widget_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/shared/models/widget.models */ "0lYY");
/* harmony import */ var _flot_widget_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flot-widget.models */ "RV8Q");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "wd/R");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tinycolor2 */ "Zss7");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(tinycolor2__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_models_time_time_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/models/time/time.models */ "aX2P");
/* harmony import */ var _core_services_utils_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @core/services/utils.service */ "OiFK");
/* harmony import */ var _shared_models_telemetry_telemetry_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/models/telemetry/telemetry.models */ "3Tyt");
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








var tinycolor = tinycolor2__WEBPACK_IMPORTED_MODULE_4__;
var moment = moment__WEBPACK_IMPORTED_MODULE_3__;
var flotPieSettingsSchemaValue = _flot_widget_models__WEBPACK_IMPORTED_MODULE_2__["flotPieSettingsSchema"];
var flotPieDatakeySettingsSchemaValue = _flot_widget_models__WEBPACK_IMPORTED_MODULE_2__["flotPieDatakeySettingsSchema"];
var TemPeratureFlot = /** @class */ (function () {
    function TemPeratureFlot(ctx, chartType) {
        var _a;
        this.ctx = ctx;
        this.chartType = chartType;
        this.plotInited = false;
        this.isMouseInteraction = false;
        this.flotHoverHandler = this.onFlotHover.bind(this);
        this.flotSelectHandler = this.onFlotSelect.bind(this);
        this.dblclickHandler = this.onFlotDblClick.bind(this);
        this.mousedownHandler = this.onFlotMouseDown.bind(this);
        this.mouseupHandler = this.onFlotMouseUp.bind(this);
        this.mouseleaveHandler = this.onFlotMouseLeave.bind(this);
        this.flotClickHandler = this.onFlotClick.bind(this);
        this.chartType = this.chartType || 'line';
        this.settings = ctx.settings;
        this.utils = this.ctx.$injector.get(_core_services_utils_service__WEBPACK_IMPORTED_MODULE_6__["UtilsService"]);
        this.showTooltip = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.showTooltip) ? this.settings.showTooltip : true;
        this.tooltip = this.showTooltip ? $('#flot-series-tooltip') : null;
        if (((_a = this.tooltip) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            this.tooltip = this.createTooltipElement();
        }
        this.trackDecimals = ctx.decimals;
        this.trackUnits = ctx.units;
        this.tooltipIndividual = this.chartType === 'pie' || (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.tooltipIndividual)
            ? this.settings.tooltipIndividual : false);
        this.tooltipCumulative = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.tooltipCumulative) ? this.settings.tooltipCumulative : false;
        this.hideZeros = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.hideZeros) ? this.settings.hideZeros : false;
        var font = {
            color: this.settings.fontColor || '#545454',
            size: this.settings.fontSize || 10,
            family: 'Roboto'
        };
        this.options = {
            title: null,
            subtitile: null,
            shadowSize: Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.shadowSize) ? this.settings.shadowSize : 4,
            HtmlText: false,
            grid: {
                hoverable: true,
                mouseActiveRadius: 10,
                autoHighlight: this.tooltipIndividual === true,
                markings: []
            },
            selection: { mode: 'x' },
            legend: {
                show: false
            }
        };
        if (this.chartType === 'line' || this.chartType === 'bar' || this.chartType === 'state') {
            this.options.xaxes = [];
            this.xaxis = {
                mode: 'time',
                timezone: 'browser',
                font: Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(font),
                labelFont: Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(font)
            };
            this.yaxis = {
                font: Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(font),
                labelFont: Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(font)
            };
            if (this.settings.xaxis) {
                this.xaxis.font.color = this.settings.xaxis.color || this.xaxis.font.color;
                this.xaxis.label = this.utils.customTranslation(this.settings.xaxis.title, this.settings.xaxis.title) || null;
                this.xaxis.labelFont.color = this.xaxis.font.color;
                this.xaxis.labelFont.size = this.xaxis.font.size + 2;
                this.xaxis.labelFont.weight = 'bold';
            }
            this.yAxisTickFormatter = this.formatYAxisTicks.bind(this);
            this.yaxis.tickFormatter = this.yAxisTickFormatter;
            if (this.settings.yaxis) {
                this.yaxis.font.color = this.settings.yaxis.color || this.yaxis.font.color;
                this.yaxis.min = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.yaxis.min) ? this.settings.yaxis.min : null;
                this.yaxis.max = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.yaxis.max) ? this.settings.yaxis.max : null;
                this.yaxis.label = this.utils.customTranslation(this.settings.yaxis.title, this.settings.yaxis.title) || null;
                this.yaxis.labelFont.color = this.yaxis.font.color;
                this.yaxis.labelFont.size = this.yaxis.font.size + 2;
                this.yaxis.labelFont.weight = 'bold';
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(this.settings.yaxis.tickSize)) {
                    this.yaxis.tickSize = this.settings.yaxis.tickSize;
                }
                else {
                    this.yaxis.tickSize = null;
                }
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(this.settings.yaxis.tickDecimals)) {
                    this.yaxis.tickDecimals = this.settings.yaxis.tickDecimals;
                }
                else {
                    this.yaxis.tickDecimals = null;
                }
                if (this.settings.yaxis.ticksFormatter && this.settings.yaxis.ticksFormatter.length) {
                    try {
                        this.yaxis.ticksFormatterFunction = new Function('value', this.settings.yaxis.ticksFormatter);
                    }
                    catch (e) {
                        this.yaxis.ticksFormatterFunction = null;
                    }
                }
            }
            this.options.grid.borderWidth = 1;
            this.options.grid.color = this.settings.fontColor || '#545454';
            if (this.settings.grid) {
                this.options.grid.color = this.settings.grid.color || '#545454';
                this.options.grid.backgroundColor = this.settings.grid.backgroundColor || null;
                this.options.grid.tickColor = this.settings.grid.tickColor || '#DDDDDD';
                this.options.grid.borderWidth = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.grid.outlineWidth) ?
                    this.settings.grid.outlineWidth : 1;
                if (this.settings.grid.verticalLines === false) {
                    this.xaxis.tickLength = 0;
                }
                if (this.settings.grid.horizontalLines === false) {
                    this.yaxis.tickLength = 0;
                }
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.grid.margin)) {
                    this.options.grid.margin = this.settings.grid.margin;
                }
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.settings.grid.minBorderMargin)) {
                    this.options.grid.minBorderMargin = this.settings.grid.minBorderMargin;
                }
            }
            this.options.xaxes[0] = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(this.xaxis);
            if (this.settings.xaxis && this.settings.xaxis.showLabels === false) {
                this.options.xaxes[0].tickFormatter = function () {
                    return '';
                };
            }
            this.options.series = {};
            this.options.crosshair = {
                mode: 'x'
            };
            if (this.chartType === 'line' && this.settings.smoothLines) {
                this.options.series.curvedLines = {
                    active: true,
                    monotonicFit: true
                };
            }
            if ((this.chartType === 'line' || this.chartType === 'bar') && isFinite(this.settings.thresholdsLineWidth)) {
                this.options.grid.markingsLineWidth = this.settings.thresholdsLineWidth;
            }
            if (this.chartType === 'bar') {
                this.options.series.lines = {
                    show: false,
                    fill: false,
                    steps: false
                };
                this.options.series.bars = {
                    show: true,
                    lineWidth: 0,
                    fill: 0.9,
                    align: this.settings.barAlignment || 'left'
                };
                this.defaultBarWidth = this.settings.defaultBarWidth || 600;
            }
            if (this.chartType === 'state') {
                this.options.series.lines = {
                    steps: true,
                    show: true
                };
            }
        }
        else if (this.chartType === 'pie') {
            this.options.series = {
                pie: {
                    show: true,
                    label: {
                        show: this.settings.showLabels === true
                    },
                    radius: this.settings.radius || 1,
                    innerRadius: this.settings.innerRadius || 0,
                    stroke: {
                        color: '#fff',
                        width: 0
                    },
                    tilt: this.settings.tilt || 1,
                    shadow: {
                        left: 5,
                        top: 15,
                        alpha: 0.02
                    }
                }
            };
            this.options.grid.clickable = true;
            if (this.settings.stroke) {
                this.options.series.pie.stroke.color = this.settings.stroke.color || '#fff';
                this.options.series.pie.stroke.width = this.settings.stroke.width || 0;
            }
            if (this.options.series.pie.label.show) {
                this.options.series.pie.label.formatter = function (label, series) {
                    return "<div class='pie-label'>" + series.dataKey.label + "<br/>" + Math.round(series.percent) + "%</div>";
                };
                this.options.series.pie.label.radius = 3 / 4;
                this.options.series.pie.label.background = {
                    opacity: 0.8
                };
            }
            // Experimental
            this.animatedPie = this.settings.animatedPie === true;
        }
        if (this.ctx.defaultSubscription) {
            console.log("This.ctx.$container: ", this.ctx.$container);
            this.init($('#demo', this.ctx.$container), this.ctx.defaultSubscription);
        }
    }
    TemPeratureFlot.pieSettingsSchema = function () {
        return flotPieSettingsSchemaValue;
    };
    TemPeratureFlot.pieDatakeySettingsSchema = function () {
        return flotPieDatakeySettingsSchemaValue;
    };
    TemPeratureFlot.settingsSchema = function (chartType) {
        return Object(_flot_widget_models__WEBPACK_IMPORTED_MODULE_2__["flotSettingsSchema"])(chartType);
    };
    TemPeratureFlot.datakeySettingsSchema = function (defaultShowLines, chartType) {
        return Object(_flot_widget_models__WEBPACK_IMPORTED_MODULE_2__["flotDatakeySettingsSchema"])(defaultShowLines, chartType);
    };
    TemPeratureFlot.prototype.init = function ($element, subscription) {
        var _this = this;
        var _a, _b;
        console.log("$element: ", $element);
        this.$element = $element;
        this.subscription = subscription;
        this.comparisonEnabled = this.subscription ? this.subscription.comparisonEnabled : this.settings.comparisonEnabled;
        if (this.comparisonEnabled) {
            var xaxis = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(this.xaxis);
            xaxis.position = 'top';
            if (this.settings.xaxisSecond) {
                if (this.settings.xaxisSecond.showLabels === false) {
                    xaxis.tickFormatter = function () {
                        return '';
                    };
                }
                xaxis.label = this.utils.customTranslation(this.settings.xaxisSecond.title, this.settings.xaxisSecond.title) || null;
                xaxis.position = this.settings.xaxisSecond.axisPosition;
            }
            xaxis.tickLength = 0;
            this.options.xaxes.push(xaxis);
            this.options.series.stack = false;
        }
        else {
            this.options.series.stack = this.settings.stack === true;
        }
        var colors = [];
        this.yaxes = [];
        var yaxesMap = {};
        var predefinedThresholds = [];
        var thresholdsDatasources = [];
        if (this.settings.customLegendEnabled && ((_a = this.settings.dataKeysListForLabels) === null || _a === void 0 ? void 0 : _a.length)) {
            this.labelPatternsSourcesData = [];
            var labelPatternsDatasources_1 = [];
            this.settings.dataKeysListForLabels.forEach(function (item) {
                item.settings = {};
            });
            this.subscription.datasources.forEach(function (item) {
                var datasource = {
                    type: item.type,
                    entityType: item.entityType,
                    entityId: item.entityId,
                    dataKeys: _this.settings.dataKeysListForLabels
                };
                labelPatternsDatasources_1.push(datasource);
            });
            this.subscribeForLabelPatternsSources(labelPatternsDatasources_1);
        }
        var tooltipValueFormatFunction = null;
        if (this.settings.tooltipValueFormatter && this.settings.tooltipValueFormatter.length) {
            try {
                tooltipValueFormatFunction = new Function('value', this.settings.tooltipValueFormatter);
            }
            catch (e) {
                tooltipValueFormatFunction = null;
            }
        }
        for (var i = 0; i < this.subscription.data.length; i++) {
            var series = this.subscription.data[i];
            colors.push(series.dataKey.color);
            var keySettings = series.dataKey.settings;
            series.dataKey.tooltipValueFormatFunction = tooltipValueFormatFunction;
            if (keySettings.tooltipValueFormatter && keySettings.tooltipValueFormatter.length) {
                try {
                    series.dataKey.tooltipValueFormatFunction = new Function('value', keySettings.tooltipValueFormatter);
                }
                catch (e) {
                    series.dataKey.tooltipValueFormatFunction = tooltipValueFormatFunction;
                }
            }
            series.lines = {
                fill: keySettings.fillLines === true
            };
            if (this.settings.stack && !this.comparisonEnabled) {
                series.stack = !keySettings.excludeFromStacking;
            }
            else {
                series.stack = false;
            }
            if (this.chartType === 'line' || this.chartType === 'state') {
                series.lines.show = keySettings.showLines !== false;
            }
            else {
                series.lines.show = keySettings.showLines === true;
            }
            if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(keySettings.lineWidth) && keySettings.lineWidth !== null) {
                series.lines.lineWidth = keySettings.lineWidth;
            }
            series.points = {
                show: false,
                radius: 8
            };
            if (keySettings.showPoints === true) {
                series.points.show = true;
                series.points.lineWidth = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(keySettings.showPointsLineWidth) ? keySettings.showPointsLineWidth : 5;
                series.points.radius = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(keySettings.showPointsRadius) ? keySettings.showPointsRadius : 3;
                series.points.symbol = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(keySettings.showPointShape) ? keySettings.showPointShape : 'circle';
                if (series.points.symbol === 'custom' && keySettings.pointShapeFormatter) {
                    try {
                        series.points.symbol = new Function('ctx, x, y, radius, shadow', keySettings.pointShapeFormatter);
                    }
                    catch (e) {
                        series.points.symbol = 'circle';
                    }
                }
            }
            if (this.chartType === 'line' && this.settings.smoothLines && !series.points.show) {
                series.curvedLines = {
                    apply: true
                };
            }
            var lineColor = tinycolor(series.dataKey.color);
            lineColor.setAlpha(.75);
            series.highlightColor = lineColor.toRgbString();
            if (series.datasource.isAdditional) {
                series.xaxisIndex = 1;
                series.xaxis = 2;
            }
            else {
                series.xaxisIndex = 0;
                series.xaxis = 1;
            }
            if (this.yaxis) {
                var units = series.dataKey.units && series.dataKey.units.length ? series.dataKey.units : this.trackUnits;
                var yaxis = void 0;
                if (keySettings.showSeparateAxis) {
                    yaxis = this.createYAxis(keySettings, units);
                    this.yaxes.push(yaxis);
                }
                else {
                    yaxis = yaxesMap[units];
                    if (!yaxis) {
                        yaxis = this.createYAxis(keySettings, units);
                        yaxesMap[units] = yaxis;
                        this.yaxes.push(yaxis);
                    }
                }
                series.yaxisIndex = this.yaxes.indexOf(yaxis);
                series.yaxis = series.yaxisIndex + 1;
                yaxis.keysInfo[i] = { hidden: false };
                yaxis.show = true;
                if (keySettings.thresholds && keySettings.thresholds.length) {
                    var _loop_1 = function (threshold) {
                        if (threshold.thresholdValueSource === 'predefinedValue' && isFinite(threshold.thresholdValue)) {
                            var colorIndex = this_1.subscription.data.length + predefinedThresholds.length;
                            this_1.generateThreshold(predefinedThresholds, series.yaxis, threshold.lineWidth, threshold.color, colorIndex, threshold.thresholdValue);
                        }
                        else if (threshold.thresholdEntityAlias && threshold.thresholdAttribute) {
                            var entityAliasId_1 = this_1.ctx.aliasController.getEntityAliasId(threshold.thresholdEntityAlias);
                            if (!entityAliasId_1) {
                                return "continue";
                            }
                            var datasource = thresholdsDatasources.filter(function (thresholdDatasource) {
                                return thresholdDatasource.entityAliasId === entityAliasId_1;
                            })[0];
                            var dataKey = {
                                type: _shared_models_telemetry_telemetry_models__WEBPACK_IMPORTED_MODULE_7__["DataKeyType"].attribute,
                                name: threshold.thresholdAttribute,
                                label: threshold.thresholdAttribute,
                                settings: {
                                    yaxis: series.yaxis,
                                    lineWidth: threshold.lineWidth,
                                    color: threshold.color
                                },
                                _hash: Math.random()
                            };
                            if (datasource) {
                                datasource.dataKeys.push(dataKey);
                            }
                            else {
                                datasource = {
                                    type: _app_shared_models_widget_models__WEBPACK_IMPORTED_MODULE_1__["DatasourceType"].entity,
                                    name: threshold.thresholdEntityAlias,
                                    aliasName: threshold.thresholdEntityAlias,
                                    entityAliasId: entityAliasId_1,
                                    dataKeys: [dataKey]
                                };
                                thresholdsDatasources.push(datasource);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, _c = keySettings.thresholds; _i < _c.length; _i++) {
                        var threshold = _c[_i];
                        _loop_1(threshold);
                    }
                }
            }
            if ((_b = this.labelPatternsSourcesData) === null || _b === void 0 ? void 0 : _b.length) {
                this.substituteLabelPatterns(series, i);
            }
        }
        this.subscribeForThresholdsAttributes(thresholdsDatasources);
        this.options.grid.markings = predefinedThresholds;
        this.predefinedThresholds = predefinedThresholds;
        this.options.colors = colors;
        this.options.yaxes = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(this.yaxes);
        if (this.chartType === 'line' || this.chartType === 'bar' || this.chartType === 'state') {
            if (this.chartType === 'bar') {
                if (this.subscription.timeWindowConfig.aggregation &&
                    this.subscription.timeWindowConfig.aggregation.type === _shared_models_time_time_models__WEBPACK_IMPORTED_MODULE_5__["AggregationType"].NONE) {
                    this.options.series.bars.barWidth = this.defaultBarWidth;
                }
                else {
                    this.options.series.bars.barWidth = this.subscription.timeWindow.interval * 0.6;
                }
            }
            this.options.xaxes[0].min = this.subscription.timeWindow.minTime;
            this.options.xaxes[0].max = this.subscription.timeWindow.maxTime;
            if (this.comparisonEnabled) {
                this.options.xaxes[1].min = this.subscription.comparisonTimeWindow.minTime;
                this.options.xaxes[1].max = this.subscription.comparisonTimeWindow.maxTime;
            }
        }
        this.checkMouseEvents();
        if (this.plot) {
            this.plot.destroy();
        }
        if (this.chartType === 'pie' && this.animatedPie) {
            this.pieDataAnimationDuration = 250;
            this.pieData = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(this.subscription.data);
            this.pieRenderedData = [];
            this.pieTargetData = [];
            for (var i = 0; i < this.subscription.data.length; i++) {
                this.pieTargetData[i] = (this.subscription.data[i].data && this.subscription.data[i].data[0])
                    ? this.subscription.data[i].data[0][1] : 0;
            }
            this.pieDataRendered();
        }
        this.plotInited = true;
        this.createPlot();
    };
    TemPeratureFlot.prototype.update = function () {
        var _this = this;
        var _a;
        if (this.updateTimeoutHandle) {
            clearTimeout(this.updateTimeoutHandle);
            this.updateTimeoutHandle = null;
        }
        if (this.subscription) {
            if (!this.isMouseInteraction && this.plot) {
                if (this.chartType === 'line' || this.chartType === 'bar' || this.chartType === 'state') {
                    var axisVisibilityChanged = false;
                    if (this.yaxis) {
                        console.log("This.subscription.data: ", this.subscription.data);
                        for (var i = 0; i < this.subscription.data.length; i++) {
                            var series = this.subscription.data[i];
                            var yaxisIndex = series.yaxisIndex;
                            if (this.yaxes[yaxisIndex].keysInfo[i].hidden !== series.dataKey.hidden) {
                                this.yaxes[yaxisIndex].keysInfo[i].hidden = series.dataKey.hidden;
                                axisVisibilityChanged = true;
                            }
                            if ((_a = this.labelPatternsSourcesData) === null || _a === void 0 ? void 0 : _a.length) {
                                this.substituteLabelPatterns(series, i);
                            }
                        }
                        if (axisVisibilityChanged) {
                            this.options.yaxes.length = 0;
                            this.yaxes.forEach(function (yaxis) {
                                var hidden = true;
                                yaxis.keysInfo.forEach(function (info) {
                                    if (info) {
                                        hidden = hidden && info.hidden;
                                    }
                                });
                                yaxis.hidden = hidden;
                                var newIndex = 1;
                                if (!yaxis.hidden) {
                                    _this.options.yaxes.push(yaxis);
                                    newIndex = _this.options.yaxes.length;
                                }
                                for (var k = 0; k < yaxis.keysInfo.length; k++) {
                                    if (yaxis.keysInfo[k]) {
                                        _this.subscription.data[k].yaxis = newIndex;
                                    }
                                }
                            });
                            this.options.yaxis = {
                                show: this.options.yaxes.length ? true : false
                            };
                        }
                    }
                    this.options.xaxes[0].min = this.subscription.timeWindow.minTime;
                    this.options.xaxes[0].max = this.subscription.timeWindow.maxTime;
                    if (this.comparisonEnabled) {
                        this.options.xaxes[1].min = this.subscription.comparisonTimeWindow.minTime;
                        this.options.xaxes[1].max = this.subscription.comparisonTimeWindow.maxTime;
                    }
                    if (this.chartType === 'bar') {
                        if (this.subscription.timeWindowConfig.aggregation &&
                            this.subscription.timeWindowConfig.aggregation.type === _shared_models_time_time_models__WEBPACK_IMPORTED_MODULE_5__["AggregationType"].NONE) {
                            this.options.series.bars.barWidth = this.defaultBarWidth;
                        }
                        else {
                            this.options.series.bars.barWidth = this.subscription.timeWindow.interval * 0.6;
                        }
                    }
                    if (axisVisibilityChanged) {
                        this.redrawPlot();
                    }
                    else {
                        this.plot.getOptions().xaxes[0].min = this.subscription.timeWindow.minTime;
                        this.plot.getOptions().xaxes[0].max = this.subscription.timeWindow.maxTime;
                        if (this.comparisonEnabled) {
                            this.plot.getOptions().xaxes[1].min = this.subscription.comparisonTimeWindow.minTime;
                            this.plot.getOptions().xaxes[1].max = this.subscription.comparisonTimeWindow.maxTime;
                        }
                        if (this.chartType === 'bar') {
                            if (this.subscription.timeWindowConfig.aggregation &&
                                this.subscription.timeWindowConfig.aggregation.type === _shared_models_time_time_models__WEBPACK_IMPORTED_MODULE_5__["AggregationType"].NONE) {
                                this.plot.getOptions().series.bars.barWidth = this.defaultBarWidth;
                            }
                            else {
                                this.plot.getOptions().series.bars.barWidth = this.subscription.timeWindow.interval * 0.6;
                            }
                        }
                        this.updateData();
                    }
                }
                else if (this.chartType === 'pie') {
                    if (this.animatedPie) {
                        this.nextPieDataAnimation(true);
                    }
                    else {
                        this.updateData();
                    }
                }
            }
            else if (this.isMouseInteraction && this.plot) {
                this.updateTimeoutHandle = setTimeout(this.update.bind(this), 30);
            }
        }
    };
    TemPeratureFlot.prototype.resize = function () {
        if (this.resizeTimeoutHandle) {
            clearTimeout(this.resizeTimeoutHandle);
            this.resizeTimeoutHandle = null;
        }
        if (this.plot && this.plotInited) {
            var width = this.$element.width();
            var height = this.$element.height();
            if (width && height) {
                this.plot.resize();
                if (this.chartType !== 'pie') {
                    this.plot.setupGrid();
                }
                this.plot.draw();
            }
            else {
                this.resizeTimeoutHandle = setTimeout(this.resize.bind(this), 30);
            }
        }
    };
    TemPeratureFlot.prototype.checkMouseEvents = function () {
        var enabled = !this.ctx.isEdit;
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isUndefined"])(this.mouseEventsEnabled) || this.mouseEventsEnabled !== enabled) {
            this.mouseEventsEnabled = enabled;
            if (this.$element) {
                if (enabled) {
                    this.enableMouseEvents();
                }
                else {
                    this.disableMouseEvents();
                }
                this.redrawPlot();
            }
        }
    };
    TemPeratureFlot.prototype.destroy = function () {
        this.cleanup();
        if (this.tooltip) {
            this.tooltip.stop(true);
            this.tooltip.hide();
        }
        if (this.plot) {
            this.plot.destroy();
            this.plot = null;
            this.plotInited = false;
        }
    };
    TemPeratureFlot.prototype.cleanup = function () {
        if (this.updateTimeoutHandle) {
            clearTimeout(this.updateTimeoutHandle);
            this.updateTimeoutHandle = null;
        }
        if (this.createPlotTimeoutHandle) {
            clearTimeout(this.createPlotTimeoutHandle);
            this.createPlotTimeoutHandle = null;
        }
        if (this.resizeTimeoutHandle) {
            clearTimeout(this.resizeTimeoutHandle);
            this.resizeTimeoutHandle = null;
        }
    };
    TemPeratureFlot.prototype.createPlot = function () {
        // console.log("This.$element: ", this.$element);
        if (this.createPlotTimeoutHandle) {
            clearTimeout(this.createPlotTimeoutHandle);
            this.createPlotTimeoutHandle = null;
        }
        if (this.plotInited && !this.plot) {
            var width = this.$element.width();
            var height = this.$element.height();
            if (width && height) {
                if (this.chartType === 'pie' && this.animatedPie) {
                    this.plot = $.plot(this.$element, this.pieData, this.options);
                }
                else {
                    this.plot = $.plot(this.$element, this.subscription.data, this.options);
                }
            }
            else {
                this.createPlotTimeoutHandle = setTimeout(this.createPlot.bind(this), 30);
            }
        }
    };
    TemPeratureFlot.prototype.updateData = function () {
        this.plot.setData(this.subscription.data);
        if (this.chartType !== 'pie') {
            this.plot.setupGrid();
        }
        this.plot.draw();
    };
    TemPeratureFlot.prototype.redrawPlot = function () {
        if (this.plot && this.plotInited) {
            this.plot.destroy();
            this.plot = null;
            this.createPlot();
        }
    };
    TemPeratureFlot.prototype.createYAxis = function (keySettings, units) {
        var yaxis = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(this.yaxis);
        var tickDecimals;
        var tickSize;
        var label = keySettings.axisTitle && keySettings.axisTitle.length ? keySettings.axisTitle : yaxis.label;
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(keySettings.axisTickDecimals)) {
            tickDecimals = keySettings.axisTickDecimals;
        }
        else {
            tickDecimals = yaxis.tickDecimals;
        }
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(keySettings.axisTickSize)) {
            tickSize = keySettings.axisTickSize;
        }
        else {
            tickSize = yaxis.tickSize;
        }
        var position = keySettings.axisPosition && keySettings.axisPosition.length ? keySettings.axisPosition : 'left';
        var min = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(keySettings.axisMin) ? keySettings.axisMin : yaxis.min;
        var max = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(keySettings.axisMax) ? keySettings.axisMax : yaxis.max;
        yaxis.label = label;
        yaxis.min = min;
        yaxis.max = max;
        yaxis.tickUnits = units;
        yaxis.tickDecimals = tickDecimals;
        yaxis.tickSize = tickSize;
        if (position === 'right' && tickSize === null) {
            yaxis.alignTicksWithAxis = 1;
        }
        else {
            yaxis.alignTicksWithAxis = null;
        }
        yaxis.position = position;
        yaxis.keysInfo = [];
        if (keySettings.axisTicksFormatter && keySettings.axisTicksFormatter.length) {
            try {
                yaxis.ticksFormatterFunction = new Function('value', keySettings.axisTicksFormatter);
            }
            catch (e) {
                yaxis.ticksFormatterFunction = this.yaxis.ticksFormatterFunction;
            }
        }
        return yaxis;
    };
    TemPeratureFlot.prototype.subscribeForThresholdsAttributes = function (datasources) {
        var _this = this;
        var thresholdsSourcesSubscriptionOptions = {
            datasources: datasources,
            useDashboardTimewindow: false,
            type: _app_shared_models_widget_models__WEBPACK_IMPORTED_MODULE_1__["widgetType"].latest,
            callbacks: {
                onDataUpdated: function (subscription) { return _this.thresholdsSourcesDataUpdated(subscription.data); }
            }
        };
        this.ctx.subscriptionApi.createSubscription(thresholdsSourcesSubscriptionOptions, true).subscribe(function (subscription) {
            _this.thresholdsSourcesSubscription = subscription;
        });
    };
    TemPeratureFlot.prototype.thresholdsSourcesDataUpdated = function (data) {
        var _this = this;
        var allThresholds = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["deepClone"])(this.predefinedThresholds);
        data.forEach(function (keyData) {
            if (keyData && keyData.data && keyData.data[0]) {
                var attrValue = keyData.data[0][1];
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumeric"])(attrValue) && isFinite(attrValue)) {
                    var settings = keyData.dataKey.settings;
                    var colorIndex = _this.subscription.data.length + allThresholds.length;
                    _this.generateThreshold(allThresholds, settings.yaxis, settings.lineWidth, settings.color, colorIndex, attrValue);
                }
            }
        });
        this.options.grid.markings = allThresholds;
        this.redrawPlot();
    };
    TemPeratureFlot.prototype.generateThreshold = function (existingThresholds, yaxis, lineWidth, color, defaultColorIndex, thresholdValue) {
        var marking = {};
        var markingYAxis;
        if (yaxis !== 1) {
            markingYAxis = 'y' + yaxis + 'axis';
        }
        else {
            markingYAxis = 'yaxis';
        }
        if (isFinite(lineWidth)) {
            marking.lineWidth = lineWidth;
        }
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(color)) {
            marking.color = color;
        }
        else {
            marking.color = this.utils.getMaterialColor(defaultColorIndex);
        }
        marking[markingYAxis] = {
            from: thresholdValue,
            to: thresholdValue
        };
        var similarMarkings = existingThresholds.filter(function (existingMarking) {
            return Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isEqual"])(existingMarking[markingYAxis], marking[markingYAxis]);
        });
        if (!similarMarkings.length) {
            existingThresholds.push(marking);
        }
    };
    TemPeratureFlot.prototype.subscribeForLabelPatternsSources = function (datasources) {
        var _this = this;
        var labelPatternsSourcesSubscriptionOptions = {
            datasources: datasources,
            useDashboardTimewindow: false,
            type: _app_shared_models_widget_models__WEBPACK_IMPORTED_MODULE_1__["widgetType"].latest,
            callbacks: {
                onDataUpdated: function (subscription) {
                    _this.labelPatternsParamsDataUpdated(subscription.data);
                }
            }
        };
        this.ctx.subscriptionApi.createSubscription(labelPatternsSourcesSubscriptionOptions, true).subscribe(function (subscription) {
            _this.labelPatternsSourcesSubscription = subscription;
        });
    };
    TemPeratureFlot.prototype.labelPatternsParamsDataUpdated = function (data) {
        this.labelPatternsSourcesData = data;
        for (var i = 0; i < this.subscription.data.length; i++) {
            var series = this.subscription.data[i];
            this.substituteLabelPatterns(series, i);
        }
        this.updateData();
        this.ctx.detectChanges();
    };
    TemPeratureFlot.prototype.substituteLabelPatterns = function (series, seriesIndex) {
        var seriesLabelPatternsSourcesData = this.labelPatternsSourcesData.filter(function (item) {
            return item.datasource.entityId === series.datasource.entityId;
        });
        var label = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["createLabelFromDatasource"])(series.datasource, series.dataKey.pattern);
        for (var i = 0; i < seriesLabelPatternsSourcesData.length; i++) {
            var keyData = seriesLabelPatternsSourcesData[i];
            if (keyData && keyData.data && keyData.data[0]) {
                var attrValue = keyData.data[0][1];
                var attrName = keyData.dataKey.name;
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(attrValue) && (attrValue !== null)) {
                    label = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["insertVariable"])(label, attrName, attrValue);
                }
            }
        }
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(this.subscription.legendData)) {
            var targetLegendKeyIndex = this.subscription.legendData.keys.findIndex(function (key) {
                return key.dataIndex === seriesIndex;
            });
            if (targetLegendKeyIndex !== -1) {
                this.subscription.legendData.keys[targetLegendKeyIndex].dataKey.label = label;
            }
        }
        series.dataKey.label = label;
    };
    TemPeratureFlot.prototype.seriesInfoDiv = function (label, color, value, units, trackDecimals, active, percent, valueFormatFunction) {
        var divElement = $('<div></div>');
        divElement.css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        });
        var lineSpan = $('<span></span>');
        lineSpan.css({
            backgroundColor: color,
            width: '20px',
            height: '3px',
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '5px'
        });
        divElement.append(lineSpan);
        var labelSpan = $("<span>" + label + ":</span>");
        labelSpan.css({
            marginRight: '10px'
        });
        if (active) {
            labelSpan.css({
                color: '#FFF',
                fontWeight: '700'
            });
        }
        divElement.append(labelSpan);
        var valueContent;
        if (valueFormatFunction) {
            valueContent = valueFormatFunction(value);
        }
        else {
            valueContent = this.ctx.utils.formatValue(value, trackDecimals, units);
        }
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(percent)) {
            valueContent += ' (' + Math.round(percent) + ' %)';
        }
        var valueSpan = $("<span>" + valueContent + "</span>");
        valueSpan.css({
            marginLeft: 'auto',
            fontWeight: '700'
        });
        if (active) {
            valueSpan.css({
                color: '#FFF'
            });
        }
        divElement.append(valueSpan);
        // const testCanvas = $(`<div>AAA</div>`);
        // divElement.append(testCanvas);
        return divElement;
    };
    TemPeratureFlot.prototype.seriesInfoDivFromInfo = function (seriesHoverInfo, seriesIndex) {
        var units = seriesHoverInfo.units && seriesHoverInfo.units.length ? seriesHoverInfo.units : this.trackUnits;
        var decimals = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefinedAndNotNull"])(seriesHoverInfo.decimals) ? seriesHoverInfo.decimals : this.trackDecimals;
        var divElement = this.seriesInfoDiv(seriesHoverInfo.label, seriesHoverInfo.color, seriesHoverInfo.value, units, decimals, seriesHoverInfo.index === seriesIndex, null, seriesHoverInfo.tooltipValueFormatFunction);
        return divElement.prop('outerHTML');
    };
    TemPeratureFlot.prototype.createTooltipElement = function () {
        var tooltip = $('<div id="flot-series-tooltip" class="flot-mouse-value"></div>');
        tooltip.css({
            fontSize: '12px',
            fontFamily: 'Roboto',
            fontWeight: '300',
            lineHeight: '18px',
            opacity: '1',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#D9DADB',
            position: 'absolute',
            display: 'none',
            zIndex: '1100',
            padding: '4px 10px',
            borderRadius: '4px'
        }).appendTo('body');
        return tooltip;
    };
    TemPeratureFlot.prototype.formatPieTooltip = function (item) {
        var units = item.series.dataKey.units && item.series.dataKey.units.length ? item.series.dataKey.units : this.trackUnits;
        var decimals = Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefinedAndNotNull"])(item.series.dataKey.decimals) ? item.series.dataKey.decimals : this.trackDecimals;
        var divElement = this.seriesInfoDiv(item.series.dataKey.label, item.series.dataKey.color, item.datapoint[1][0][1], units, decimals, true, item.series.percent, item.series.dataKey.tooltipValueFormatFunction);
        return divElement.prop('outerHTML');
    };
    TemPeratureFlot.prototype.formatChartTooltip = function (hoverInfo, seriesIndex) {
        var _this = this;
        var content = '';
        if (this.tooltipIndividual) {
            var seriesHoverArray = void 0;
            if (hoverInfo[1] && hoverInfo[1].seriesHover.length) {
                seriesHoverArray = hoverInfo[0].seriesHover.concat(hoverInfo[1].seriesHover);
            }
            else {
                seriesHoverArray = hoverInfo[0].seriesHover;
            }
            var found = seriesHoverArray.filter(function (seriesHover) {
                return seriesHover.index === seriesIndex;
            });
            if (found && found.length) {
                var timestamp = parseInt(found[0].time, 10);
                var date = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
                var dateDiv = $('<div>' + date + '</div>');
                dateDiv.css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    fontWeight: '700'
                });
                content += dateDiv.prop('outerHTML');
                content += this.seriesInfoDivFromInfo(found[0], seriesIndex);
            }
        }
        else {
            var maxRows_1;
            if (hoverInfo[1] && hoverInfo[1].seriesHover.length) {
                maxRows_1 = 5;
            }
            else {
                maxRows_1 = 15;
            }
            var columns_1 = 0;
            if (hoverInfo[1] && (hoverInfo[1].seriesHover.length > hoverInfo[0].seriesHover.length)) {
                columns_1 = Math.ceil(hoverInfo[1].seriesHover.length / maxRows_1);
            }
            else {
                columns_1 = Math.ceil(hoverInfo[0].seriesHover.length / maxRows_1);
            }
            hoverInfo.forEach(function (hoverData) {
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(hoverData.time)) {
                    var columnsContent = '';
                    var timestamp = parseInt(hoverData.time, 10);
                    var date = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
                    var dateDiv = $('<div>' + date + '</div>');
                    dateDiv.css({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        fontWeight: '700'
                    });
                    content += dateDiv.prop('outerHTML');
                    var seriesDiv = $('<div></div>');
                    seriesDiv.css({
                        display: 'flex',
                        flexDirection: 'row'
                    });
                    for (var c = 0; c < columns_1; c++) {
                        var columnDiv = $('<div></div>');
                        columnDiv.css({
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1'
                        });
                        var columnContent = '';
                        for (var i = c * maxRows_1; i < (c + 1) * maxRows_1; i++) {
                            if (i >= hoverData.seriesHover.length) {
                                break;
                            }
                            var seriesHoverInfo = hoverData.seriesHover[i];
                            columnContent += _this.seriesInfoDivFromInfo(seriesHoverInfo, seriesIndex);
                        }
                        columnDiv.html(columnContent);
                        if (columnContent) {
                            if (c > 0) {
                                columnsContent += '<span style="min-width: 20px;"></span>';
                            }
                            columnsContent += columnDiv.prop('outerHTML');
                        }
                    }
                    seriesDiv.html(columnsContent);
                    content += seriesDiv.prop('outerHTML');
                }
            });
        }
        return content;
    };
    TemPeratureFlot.prototype.formatYAxisTicks = function (value, axis) {
        if (this.settings.yaxis && this.settings.yaxis.showLabels === false) {
            return '';
        }
        if (axis.options.ticksFormatterFunction) {
            return axis.options.ticksFormatterFunction(value);
        }
        var factor = axis.options.tickDecimals ? Math.pow(10, axis.options.tickDecimals) : 1;
        var formatted = '' + Math.round(value * factor) / factor;
        if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isDefined"])(axis.options.tickDecimals) && axis.options.tickDecimals !== null) {
            var decimal = formatted.indexOf('.');
            var precision = decimal === -1 ? 0 : formatted.length - decimal - 1;
            if (precision < axis.options.tickDecimals) {
                formatted = (precision ? formatted : formatted + '.') + ('' + factor).substr(1, axis.options.tickDecimals - precision);
            }
        }
        if (axis.options.tickUnits) {
            formatted += ' ' + axis.options.tickUnits;
        }
        return formatted;
    };
    TemPeratureFlot.prototype.enableMouseEvents = function () {
        this.$element.css('pointer-events', '');
        this.$element.addClass('mouse-events');
        this.options.selection = { mode: 'x' };
        this.$element.bind('plothover', this.flotHoverHandler);
        this.$element.bind('plotselected', this.flotSelectHandler);
        this.$element.bind('dblclick', this.dblclickHandler);
        this.$element.bind('mousedown', this.mousedownHandler);
        this.$element.bind('mouseup', this.mouseupHandler);
        this.$element.bind('mouseleave', this.mouseleaveHandler);
        this.$element.bind('plotclick', this.flotClickHandler);
    };
    TemPeratureFlot.prototype.disableMouseEvents = function () {
        this.$element.css('pointer-events', 'none');
        this.$element.removeClass('mouse-events');
        this.options.selection = { mode: null };
        this.$element.unbind('plothover', this.flotHoverHandler);
        this.$element.unbind('plotselected', this.flotSelectHandler);
        this.$element.unbind('dblclick', this.dblclickHandler);
        this.$element.unbind('mousedown', this.mousedownHandler);
        this.$element.unbind('mouseup', this.mouseupHandler);
        this.$element.unbind('mouseleave', this.mouseleaveHandler);
        this.$element.unbind('plotclick', this.flotClickHandler);
    };
    TemPeratureFlot.prototype.onFlotHover = function (e, pos, item) {
        var _this = this;
        if (!this.plot || !this.tooltip) {
            return;
        }
        if ((!this.tooltipIndividual || item) && !this.ctx.isEdit) {
            var multipleModeTooltip = !this.tooltipIndividual;
            if (multipleModeTooltip) {
                this.plot.unhighlight();
            }
            var pageX = pos.pageX;
            var pageY = pos.pageY;
            var tooltipHtml = void 0;
            var hoverInfo = void 0;
            if (this.chartType === 'pie') {
                tooltipHtml = this.formatPieTooltip(item);
            }
            else {
                hoverInfo = this.getHoverInfo(this.plot.getData(), pos);
                if (Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(hoverInfo[0].time) || (hoverInfo[1] && Object(_app_core_utils__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(hoverInfo[1].time))) {
                    hoverInfo[0].seriesHover.sort(function (a, b) {
                        return b.value - a.value;
                    });
                    if (hoverInfo[1] && hoverInfo[1].seriesHover.length) {
                        hoverInfo[1].seriesHover.sort(function (a, b) {
                            return b.value - a.value;
                        });
                    }
                    tooltipHtml = this.formatChartTooltip(hoverInfo, item ? item.seriesIndex : -1);
                }
            }
            if (tooltipHtml) {
                this.tooltip.html(tooltipHtml)
                    .css({ top: 0, left: 0 })
                    .fadeIn(200);
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var tooltipWidth = this.tooltip.width();
                var tooltipHeight = this.tooltip.height();
                var left = pageX + 5;
                var top_1 = pageY + 5;
                if (windowWidth - pageX < tooltipWidth + 50) {
                    left = pageX - tooltipWidth - 10;
                }
                if (windowHeight - pageY < tooltipHeight + 20) {
                    top_1 = pageY - tooltipHeight - 10;
                }
                this.tooltip.css({
                    top: top_1,
                    left: left
                });
                if (multipleModeTooltip) {
                    hoverInfo.forEach(function (hoverData) {
                        hoverData.seriesHover.forEach(function (seriesHoverInfo) {
                            _this.plot.highlight(seriesHoverInfo.index, seriesHoverInfo.hoverIndex);
                        });
                    });
                }
            }
        }
        else {
            this.tooltip.stop(true);
            this.tooltip.hide();
            this.plot.unhighlight();
        }
    };
    TemPeratureFlot.prototype.onFlotSelect = function (e, ranges) {
        if (!this.plot) {
            return;
        }
        this.plot.clearSelection();
        this.subscription.onUpdateTimewindow(ranges.xaxis.from, ranges.xaxis.to);
    };
    TemPeratureFlot.prototype.onFlotDblClick = function () {
        this.subscription.onResetTimewindow();
    };
    TemPeratureFlot.prototype.onFlotMouseDown = function () {
        this.isMouseInteraction = true;
    };
    TemPeratureFlot.prototype.onFlotMouseUp = function () {
        this.isMouseInteraction = false;
    };
    TemPeratureFlot.prototype.onFlotMouseLeave = function () {
        if (!this.tooltip) {
            return;
        }
        this.tooltip.stop(true);
        this.tooltip.hide();
        if (this.plot) {
            this.plot.unhighlight();
        }
        this.isMouseInteraction = false;
    };
    TemPeratureFlot.prototype.onFlotClick = function (e, pos, item) {
        if (!this.plot) {
            return;
        }
        this.onPieSliceClick(e, item);
    };
    TemPeratureFlot.prototype.getHoverInfo = function (seriesList, pos) {
        var i;
        var series;
        var hoverIndex;
        var hoverDistance;
        var minDistance;
        var pointTime;
        var minTime;
        var minTimeHistorical;
        var hoverData;
        var value;
        var lastValue = 0;
        var minDistanceHistorical;
        var deltaX = 0;
        var results = [{
                seriesHover: []
            }];
        if (this.comparisonEnabled) {
            results.push({
                seriesHover: []
            });
        }
        if (this.chartType === 'bar' && this.options.series.bars.align !== 'left') {
            if (this.options.series.bars.align === 'center') {
                deltaX = this.options.series.bars.barWidth / 2;
            }
            else {
                deltaX = this.options.series.bars.barWidth;
            }
        }
        for (i = 0; i < seriesList.length; i++) {
            series = seriesList[i];
            var posx = void 0;
            if (series.datasource.isAdditional) {
                posx = pos.x2;
            }
            else {
                posx = pos.x;
            }
            posx += deltaX;
            hoverIndex = this.findHoverIndexFromData(posx, series);
            if (series.data[hoverIndex] && series.data[hoverIndex][0]) {
                hoverDistance = posx - series.data[hoverIndex][0];
                pointTime = series.data[hoverIndex][0];
                if (series.datasource.isAdditional) {
                    if (!minDistanceHistorical
                        || (hoverDistance >= 0 && (hoverDistance < minDistanceHistorical || minDistanceHistorical < 0))
                        || (hoverDistance < 0 && hoverDistance > minDistanceHistorical)) {
                        minDistanceHistorical = hoverDistance;
                        minTimeHistorical = pointTime;
                    }
                }
                else if (!minDistance
                    || (hoverDistance >= 0 && (hoverDistance < minDistance || minDistance < 0))
                    || (hoverDistance < 0 && hoverDistance > minDistance)) {
                    minDistance = hoverDistance;
                    minTime = pointTime;
                }
                if (series.stack) {
                    if (this.tooltipIndividual || !this.tooltipCumulative) {
                        value = series.data[hoverIndex][1];
                    }
                    else {
                        lastValue += series.data[hoverIndex][1];
                        value = lastValue;
                    }
                }
                else {
                    value = series.data[hoverIndex][1];
                }
                if (series.stack || (series.curvedLines && series.curvedLines.apply)) {
                    hoverIndex = this.findHoverIndexFromDataPoints(posx, series, hoverIndex);
                }
                if (!this.hideZeros || value) {
                    hoverData = {
                        value: value,
                        hoverIndex: hoverIndex,
                        color: series.dataKey.color,
                        label: series.dataKey.label,
                        units: series.dataKey.units,
                        decimals: series.dataKey.decimals,
                        tooltipValueFormatFunction: series.dataKey.tooltipValueFormatFunction,
                        time: pointTime,
                        distance: hoverDistance,
                        index: i
                    };
                    if (series.datasource.isAdditional) {
                        results[1].seriesHover.push(hoverData);
                    }
                    else {
                        results[0].seriesHover.push(hoverData);
                    }
                }
            }
        }
        if (results[1] && results[1].seriesHover.length) {
            results[1].time = minTimeHistorical;
        }
        results[0].time = minTime;
        return results;
    };
    TemPeratureFlot.prototype.findHoverIndexFromData = function (posX, series) {
        var lower = 0;
        var upper = series.data.length - 1;
        var middle;
        var index = null;
        while (index === null) {
            if (lower > upper) {
                return Math.max(upper, 0);
            }
            middle = Math.floor((lower + upper) / 2);
            if (series.data[middle][0] === posX) {
                return middle;
            }
            else if (series.data[middle][0] < posX) {
                lower = middle + 1;
            }
            else {
                upper = middle - 1;
            }
        }
    };
    TemPeratureFlot.prototype.findHoverIndexFromDataPoints = function (posX, series, last) {
        var ps = series.datapoints.pointsize;
        var initial = last * ps;
        var len = series.datapoints.points.length;
        var j;
        for (j = initial; j < len; j += ps) {
            if ((!series.lines.steps && series.datapoints.points[initial] != null && series.datapoints.points[j] == null)
                || series.datapoints.points[j] > posX) {
                return Math.max(j - ps, 0) / ps;
            }
        }
        return j / ps - 1;
    };
    TemPeratureFlot.prototype.pieDataRendered = function () {
        for (var i = 0; i < this.pieTargetData.length; i++) {
            var value = this.pieTargetData[i] ? this.pieTargetData[i] : 0;
            this.pieRenderedData[i] = value;
            if (!this.pieData[i].data[0]) {
                this.pieData[i].data[0] = [0, 0];
            }
            this.pieData[i].data[0][1] = value;
        }
    };
    TemPeratureFlot.prototype.nextPieDataAnimation = function (start) {
        if (start) {
            this.finishPieDataAnimation();
            this.pieAnimationStartTime = this.pieAnimationLastTime = Date.now();
            for (var i = 0; i < this.subscription.data.length; i++) {
                this.pieTargetData[i] = (this.subscription.data[i].data && this.subscription.data[i].data[0])
                    ? this.subscription.data[i].data[0][1] : 0;
            }
        }
        if (this.pieAnimationCaf) {
            this.pieAnimationCaf();
            this.pieAnimationCaf = null;
        }
        this.pieAnimationCaf = this.ctx.$scope.raf.raf(this.onPieDataAnimation.bind(this));
    };
    TemPeratureFlot.prototype.onPieDataAnimation = function () {
        var time = Date.now();
        var elapsed = time - this.pieAnimationLastTime; // this.pieAnimationStartTime;
        var progress = (time - this.pieAnimationStartTime) / this.pieDataAnimationDuration;
        if (progress >= 1) {
            this.finishPieDataAnimation();
        }
        else {
            if (elapsed >= 40) {
                for (var i = 0; i < this.pieTargetData.length; i++) {
                    var prevValue = this.pieRenderedData[i];
                    var targetValue = this.pieTargetData[i];
                    var value = prevValue + (targetValue - prevValue) * progress;
                    if (!this.pieData[i].data[0]) {
                        this.pieData[i].data[0] = [0, 0];
                    }
                    this.pieData[i].data[0][1] = value;
                }
                this.plot.setData(this.pieData);
                this.plot.draw();
                this.pieAnimationLastTime = time;
            }
            this.nextPieDataAnimation(false);
        }
    };
    TemPeratureFlot.prototype.finishPieDataAnimation = function () {
        this.pieDataRendered();
        this.plot.setData(this.pieData);
        this.plot.draw();
    };
    TemPeratureFlot.prototype.onPieSliceClick = function ($event, item) {
        var descriptors = this.ctx.actionsApi.getActionDescriptors('sliceClick');
        if ($event && descriptors.length) {
            $event.stopPropagation();
            var entityInfo = this.ctx.actionsApi.getActiveEntityInfo();
            var entityId = entityInfo ? entityInfo.entityId : null;
            var entityName = entityInfo ? entityInfo.entityName : null;
            var entityLabel = entityInfo ? entityInfo.entityLabel : null;
            this.ctx.actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, item, entityLabel);
        }
    };
    return TemPeratureFlot;
}());


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "xexB")))

/***/ })

}]);
//# sourceMappingURL=home-components-widget-lib-temperature-flot.js.map