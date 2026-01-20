(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["dashboard-pages-module"],{

/***/ "QNxH":
/*!*********************************************************************!*\
  !*** ./src/app/modules/dashboard/dashboard-pages.routing.module.ts ***!
  \*********************************************************************/
/*! exports provided: WidgetEditorDashboardResolver, DashboardPagesRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WidgetEditorDashboardResolver", function() { return WidgetEditorDashboardResolver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardPagesRoutingModule", function() { return DashboardPagesRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _shared_models_authority_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/models/authority.enum */ "zp9Z");
/* harmony import */ var _home_components_dashboard_page_dashboard_page_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @home/components/dashboard-page/dashboard-page.component */ "Xbih");
/* harmony import */ var _core_http_dashboard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @core/http/dashboard.service */ "YnEf");
/* harmony import */ var _core_services_dashboard_utils_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/services/dashboard-utils.service */ "4j5O");
/* harmony import */ var _app_modules_home_pages_dashboard_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @app/modules/home/pages/dashboard/dashboard-routing.module */ "ekQc");
/* harmony import */ var _core_services_utils_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @core/services/utils.service */ "OiFK");
/* harmony import */ var _shared_models_constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/models/constants */ "he9t");
/* harmony import */ var _common_modules_map__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/modules-map */ "F4h8");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ "fXoL");














var WidgetEditorDashboardResolver = /** @class */ (function () {
    function WidgetEditorDashboardResolver(dashboardService, dashboardUtils, utils) {
        this.dashboardService = dashboardService;
        this.dashboardUtils = dashboardUtils;
        this.utils = utils;
    }
    WidgetEditorDashboardResolver.prototype.resolve = function (route) {
        var editWidgetInfo = this.utils.editWidgetInfo;
        var widget = {
            isSystemType: true,
            bundleAlias: 'customWidgetBundle',
            typeAlias: 'customWidget',
            type: editWidgetInfo.type,
            title: 'My widget',
            image: null,
            description: null,
            sizeX: editWidgetInfo.sizeX * 2,
            sizeY: editWidgetInfo.sizeY * 2,
            row: 2,
            col: 4,
            config: JSON.parse(editWidgetInfo.defaultConfig)
        };
        widget.config.title = widget.config.title || editWidgetInfo.widgetName;
        return this.dashboardUtils.createSingleWidgetDashboard(widget);
    };
    WidgetEditorDashboardResolver.ɵfac = function WidgetEditorDashboardResolver_Factory(t) { return new (t || WidgetEditorDashboardResolver)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_core_http_dashboard_service__WEBPACK_IMPORTED_MODULE_3__["DashboardService"]), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_core_services_dashboard_utils_service__WEBPACK_IMPORTED_MODULE_4__["DashboardUtilsService"]), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_core_services_utils_service__WEBPACK_IMPORTED_MODULE_6__["UtilsService"])); };
    WidgetEditorDashboardResolver.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjectable"]({ token: WidgetEditorDashboardResolver, factory: WidgetEditorDashboardResolver.ɵfac });
    return WidgetEditorDashboardResolver;
}());

var routes = [
    {
        path: 'dashboard/:dashboardId',
        component: _home_components_dashboard_page_dashboard_page_component__WEBPACK_IMPORTED_MODULE_2__["DashboardPageComponent"],
        data: {
            breadcrumb: {
                skip: true
            },
            auth: [_shared_models_authority_enum__WEBPACK_IMPORTED_MODULE_1__["Authority"].TENANT_ADMIN, _shared_models_authority_enum__WEBPACK_IMPORTED_MODULE_1__["Authority"].CUSTOMER_USER],
            title: 'dashboard.dashboard',
            widgetEditMode: false,
            singlePageMode: true
        },
        resolve: {
            dashboard: _app_modules_home_pages_dashboard_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_5__["DashboardResolver"]
        }
    },
    {
        path: 'widget-editor',
        component: _home_components_dashboard_page_dashboard_page_component__WEBPACK_IMPORTED_MODULE_2__["DashboardPageComponent"],
        data: {
            breadcrumb: {
                skip: true
            },
            auth: [_shared_models_authority_enum__WEBPACK_IMPORTED_MODULE_1__["Authority"].SYS_ADMIN, _shared_models_authority_enum__WEBPACK_IMPORTED_MODULE_1__["Authority"].TENANT_ADMIN],
            title: 'widget.editor',
            widgetEditMode: true,
            singlePageMode: true
        },
        resolve: {
            dashboard: WidgetEditorDashboardResolver
        }
    }
];
var DashboardPagesRoutingModule = /** @class */ (function () {
    function DashboardPagesRoutingModule() {
    }
    DashboardPagesRoutingModule.ɵfac = function DashboardPagesRoutingModule_Factory(t) { return new (t || DashboardPagesRoutingModule)(); };
    DashboardPagesRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({ type: DashboardPagesRoutingModule });
    DashboardPagesRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({ providers: [
            WidgetEditorDashboardResolver,
            _app_modules_home_pages_dashboard_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_5__["DashboardResolver"],
            {
                provide: _shared_models_constants__WEBPACK_IMPORTED_MODULE_7__["MODULES_MAP"],
                useValue: _common_modules_map__WEBPACK_IMPORTED_MODULE_8__["modulesMap"]
            }
        ], imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
    return DashboardPagesRoutingModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](DashboardPagesRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "taxM":
/*!*************************************************************!*\
  !*** ./src/app/modules/dashboard/dashboard-pages.module.ts ***!
  \*************************************************************/
/*! exports provided: DashboardPagesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardPagesModule", function() { return DashboardPagesModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/shared.module */ "PCNd");
/* harmony import */ var _modules_home_components_home_components_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @modules/home/components/home-components.module */ "G4cQ");
/* harmony import */ var _app_modules_home_dialogs_home_dialogs_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/modules/home/dialogs/home-dialogs.module */ "M0Qk");
/* harmony import */ var _dashboard_pages_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dashboard-pages.routing.module */ "QNxH");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");






var DashboardPagesModule = /** @class */ (function () {
    function DashboardPagesModule() {
    }
    DashboardPagesModule.ɵfac = function DashboardPagesModule_Factory(t) { return new (t || DashboardPagesModule)(); };
    DashboardPagesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({ type: DashboardPagesModule });
    DashboardPagesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({ imports: [[
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_1__["SharedModule"],
                _modules_home_components_home_components_module__WEBPACK_IMPORTED_MODULE_2__["HomeComponentsModule"],
                _app_modules_home_dialogs_home_dialogs_module__WEBPACK_IMPORTED_MODULE_3__["HomeDialogsModule"],
                _dashboard_pages_routing_module__WEBPACK_IMPORTED_MODULE_4__["DashboardPagesRoutingModule"]
            ]] });
    return DashboardPagesModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](DashboardPagesModule, { imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _shared_shared_module__WEBPACK_IMPORTED_MODULE_1__["SharedModule"],
        _modules_home_components_home_components_module__WEBPACK_IMPORTED_MODULE_2__["HomeComponentsModule"],
        _app_modules_home_dialogs_home_dialogs_module__WEBPACK_IMPORTED_MODULE_3__["HomeDialogsModule"],
        _dashboard_pages_routing_module__WEBPACK_IMPORTED_MODULE_4__["DashboardPagesRoutingModule"]] }); })();


/***/ })

}]);
//# sourceMappingURL=dashboard-pages-module.js.map