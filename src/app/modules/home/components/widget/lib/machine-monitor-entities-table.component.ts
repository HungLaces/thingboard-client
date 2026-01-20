import { Label } from 'ng2-charts';
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

import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  StaticProvider,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { PageComponent } from '@shared/components/page.component';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { WidgetAction, WidgetContext } from '@home/models/widget-component.models';
import {
  DataKey,
  Datasource,
  DatasourceData,
  WidgetActionDescriptor,
  WidgetConfig
} from '@shared/models/widget.models';
import { IWidgetSubscription } from '@core/api/widget-api.models';
import { UtilsService } from '@core/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import {
  createLabelFromDatasource,
  deepClone,
  hashCode,
  isDefined,
  isNumber,
  isObject,
  isUndefined
} from '@core/utils';
import cssjs from '@core/css/css';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { DataKeyType } from '@shared/models/telemetry/telemetry.models';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { emptyPageData, PageData } from '@shared/models/page/page-data';
import { EntityId } from '@shared/models/id/entity-id';
import { entityTypeTranslations } from '@shared/models/entity-type.models';
import { debounceTime, distinctUntilChanged, map, tap, timeout } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  CellContentInfo,
  CellStyleInfo,
  constructTableCssString,
  DisplayColumn,
  EntityColumn,
  EntityData,
  entityDataSortOrderFromString,
  findColumnByEntityKey,
  findEntityKeyByColumnDef,
  fromEntityColumnDef,
  getCellContentInfo,
  getCellStyleInfo,
  getColumnDefaultVisibility,
  getColumnSelectionAvailability,
  getColumnWidth,
  getEntityValue,
  getRowStyleInfo,
  RowStyleInfo,
  TableWidgetDataKeySettings,
  TableWidgetSettings,
  widthStyle
} from '@home/components/widget/lib/table-widget.models';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  DISPLAY_COLUMNS_PANEL_DATA,
  DisplayColumnsPanelComponent,
  DisplayColumnsPanelData
} from '@home/components/widget/lib/display-columns-panel.component';
import {
  dataKeyToEntityKey,
  Direction,
  EntityDataPageLink,
  entityDataPageLinkSortDirection,
  EntityKey,
  EntityKeyType,
  EntityKeyValueType,
  FilterPredicateType,
  FilterPredicateValue,
  KeyFilter,
  KeyFilterPredicate,
  NumericOperation,
  StringOperation
} from '@shared/models/query/query.models';
import { sortItems } from '@shared/models/page/page-link';
import { entityFields } from '@shared/models/entity.models';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { WidgetService } from '@app/core/http/widget.service';
import { R } from '@angular/cdk/keycodes';

interface EntitiesTableWidgetSettings extends TableWidgetSettings {
  entitiesTitle: string;
  enableSelectColumnDisplay: boolean;
  defaultSortOrder: string;
  displayEntityName: boolean;
  entityNameColumnTitle: string;
  displayEntityLabel: boolean;
  entityLabelColumnTitle: string;
  displayEntityType: boolean;
}

@Component({
  selector: 'tb-machine-monitor-entities-table',
  templateUrl: './machine-monitor-entities-table.component.html',
  styleUrls: ['./machine-monitor-entities-table.component.scss', './table-widget.scss']
})
export class MachineMonitorEntitiesTableComponent extends PageComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  ctx: WidgetContext;

  @ViewChild('searchInput') searchInputField: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('machineLoading') loadingEl: ElementRef;

  public displayPagination = true;
  public enableStickyHeader = true;
  public enableStickyAction = true;
  public pageSizeOptions;
  public pageLink: EntityDataPageLink;
  public sortOrderProperty: string;
  public textSearchMode = false;
  public columns: Array<EntityColumn> = [];
  public displayedColumns: string[] = [];
  public actionCellDescriptors: WidgetActionDescriptor[];
  public entityDatasource: EntityDatasource;
  // public valueColumnSearch = "";
  public fillterArr = [];
  public checkFillter = false;
  public statusArr = [
    { value: 0, viewValue: 'Running' },
    { value: 1, viewValue: 'Stop' },
    { value: 99, viewValue: 'Waiting' }
  ];
  public dashboardTypeArr = [
    { value: 'may_DaKenh', viewValue: 'may_DaKenh' },
    { value: 'may_Luyen', viewValue: 'may_Luyen' },
    { value: 'may_Mounter', viewValue: 'may_Mounter' },
    { value: 'may_Reflow', viewValue: 'may_Reflow' },
    { value: 'may_Other', viewValue: 'may_Other' },
  ];
  public machineTypeArr = [
    { value: 'Type 3', viewValue: 'Type 1' },
    { value: 'Type 3', viewValue: 'Type 2' },
    { value: 'Type 3', viewValue: 'Type 3' },
    { value: 'Type 4', viewValue: 'Type 4' },
    { value: 'Type 5', viewValue: 'Type 5' },
    { value: 'Type 6', viewValue: 'Type 6' },
    { value: 'Type 7', viewValue: 'Type 7' },
    { value: 'Type 8', viewValue: 'Type 8' },
    { value: 'Type 9', viewValue: 'Type 9' },
    { value: 'Type 10', viewValue: 'Type 10' },
    { value: 'Type 11', viewValue: 'Type 11' },
    { value: 'Type 12', viewValue: 'Type 12' },
    { value: 'Type 13', viewValue: 'Type 13' },
    { value: 'Type 14', viewValue: 'Type 14' },
    { value: 'Type 15', viewValue: 'Type 15' },
    { value: 'Type 16', viewValue: 'Type 16' },
    { value: 'Type 17', viewValue: 'Type 17' },
    { value: 'Type 18', viewValue: 'Type 18' },
  ];

  public machineGroupArr = [
    { value: 'Nhóm Jig', viewValue: 'Nhóm Jig' },
    { value: 'Nhóm máy cắm xuyên lỗ (THT)', viewValue: 'Nhóm máy cắm xuyên lỗ (THT)' },
    { value: 'Nhóm máy Printer', viewValue: 'Nhóm máy Printer' },
    { value: 'Nhóm máy Nhựa', viewValue: 'Nhóm máy Nhựa' },
    { value: 'Nhóm máy lò hàn Wave', viewValue: 'Nhóm máy lò hàn Wave' },
    { value: 'Nhóm máy đo thông số', viewValue: 'Nhóm máy đo thông số' },
    { value: 'Nhóm máy SPI', viewValue: 'Nhóm máy SPI' },
    { value: 'Nhóm máy Mounter', viewValue: 'Nhóm máy Mounter' },
    { value: 'Nhóm máy lò hàn Reflow', viewValue: 'Nhóm máy lò hàn Reflow' },
    { value: 'Nhóm máy AOI', viewValue: 'Nhóm máy AOI' },
    { value: 'Nhóm máy kim loại', viewValue: 'Nhóm máy kim loại' },
    { value: 'Nhóm máy bao lắp ráp', viewValue: 'Nhóm máy bao lắp ráp' },
    { value: 'Nhóm máy bao gói', viewValue: 'Nhóm máy bao gói' },
    { value: 'Nhóm máy luyện', viewValue: 'Nhóm máy luyện' },
    { value: 'Nhóm máy thử sáng 1', viewValue: 'Nhóm máy thử sáng 1' },
    { value: 'Nhóm máy test nóng (High temprature)', viewValue: 'Nhóm máy test nóng (High temprature)' },
    { value: 'Nhóm máy test nguội (Room temprature)', viewValue: 'Nhóm máy test nguội (Room temprature)' },
    { value: 'Nhóm máy cụm Sơn', viewValue: 'Nhóm máy cụm Sơn' },
  ];

  public columnCustomWidth = ['Planning_Code'];
  public columnFullWidth = ['name', 'label','machine_name'];
  public columnMinWidth = [];
  public columnSelect = ["machine_status","dashboard_type","machine_type","machine_group"];

  public listError;
  public listErrorHMI;

  private cellContentCache: Array<any> = [];
  private cellStyleCache: Array<any> = [];
  private rowStyleCache: Array<any> = [];

  private settings: EntitiesTableWidgetSettings;
  private widgetConfig: WidgetConfig;
  private subscription: IWidgetSubscription;

  private entitiesTitlePattern: string;

  private defaultPageSize = 10;
  private defaultSortOrder = 'entityName';

  private contentsInfo: { [key: string]: CellContentInfo } = {};
  private stylesInfo: { [key: string]: CellStyleInfo } = {};
  private columnWidth: { [key: string]: string } = {};
  private columnDefaultVisibility: { [key: string]: boolean } = {};
  private columnSelectionAvailability: { [key: string]: boolean } = {};

  private rowStylesInfo: RowStyleInfo;

  public isLoading: boolean = false;

  handleLoading(_isLoading: boolean) {
    this.isLoading = _isLoading;
  }

  // public fakeSerial_stage = {"BG-BULB-01":[{"position":1,"serialBoard":"","serial":"123123","lastUpdateTs":"2023-12-07 10:04:50"},{"position":2,"serialBoard":"","serial":"sdssadasdad","lastUpdateTs":"2023-12-07 14:10:27"},{"position":3,"serialBoard":"","serial":"dsddsdsdsds","lastUpdateTs":"2023-12-07 14:15:30"},{"position":4,"serialBoard":"","serial":"dsdsdsdsdsdsdsdsdsds","lastUpdateTs":"2023-12-07 14:15:30"},{"position":5,"serialBoard":"","serial":"sdsd","lastUpdateTs":"2023-12-07 14:26:10"},{"position":6,"serialBoard":"","serial":"dsdsds","lastUpdateTs":"2023-12-07 14:26:10"},{"position":7,"serialBoard":"","serial":"dasdadadasd","lastUpdateTs":"2023-12-07 14:57:06"},{"position":8,"serialBoard":"","serial":"gsadfasace","lastUpdateTs":"2023-12-07 14:57:06"},{"position":9,"serialBoard":"","serial":"dafabeas","lastUpdateTs":"2023-12-07 14:57:06"},{"position":10,"serialBoard":"","serial":"1","lastUpdateTs":"2023-12-07 14:58:44"},{"position":11,"serialBoard":"","serial":"2","lastUpdateTs":"2023-12-07 14:58:44"},{"position":12,"serialBoard":"","serial":"3","lastUpdateTs":"2023-12-07 14:58:44"},{"position":13,"serialBoard":"","serial":"4","lastUpdateTs":"2023-12-07 15:01:10"},{"position":14,"serialBoard":"","serial":"5","lastUpdateTs":"2023-12-07 15:01:10"},{"position":15,"serialBoard":"","serial":"6","lastUpdateTs":"2023-12-07 15:01:10"},{"position":16,"serialBoard":"","serial":"34","lastUpdateTs":"2023-12-07 15:01:58"},{"position":17,"serialBoard":"","serial":"4343","lastUpdateTs":"2023-12-07 15:01:58"},{"position":18,"serialBoard":"","serial":"423","lastUpdateTs":"2023-12-07 15:01:58"},{"position":19,"serialBoard":"","serial":"324","lastUpdateTs":"2023-12-07 15:01:58"},{"position":20,"serialBoard":"","serial":"dasfafa","lastUpdateTs":"2023-12-07 15:07:09"},{"position":21,"serialBoard":"","serial":"dasdadasdas","lastUpdateTs":"2023-12-07 15:07:09"},{"position":22,"serialBoard":"","serial":"dasdada","lastUpdateTs":"2023-12-07 15:27:29"},{"position":23,"serialBoard":"","serial":"sdadagdafwf","lastUpdateTs":"2023-12-07 15:27:29"},{"position":24,"serialBoard":"","serial":"dasflabsa,sfa","lastUpdateTs":"2023-12-07 15:29:12"},{"position":25,"serialBoard":"","serial":"asfaslklasajskf","lastUpdateTs":"2023-12-07 15:29:12"},{"position":26,"serialBoard":"","serial":"jfbaksjfashakfasfasfas","lastUpdateTs":"2023-12-07 15:29:12"},{"position":27,"serialBoard":"","serial":"dasshsajedas","lastUpdateTs":"2023-12-07 15:36:23"},{"position":28,"serialBoard":"","serial":"fasgfaelalkmkf","lastUpdateTs":"2023-12-07 15:36:23"},{"position":29,"serialBoard":"","serial":"faslkfjwlkwfa","lastUpdateTs":"2023-12-07 15:36:23"},{"position":30,"serialBoard":"","serial":"dfdfdfdfddfdfdfd","lastUpdateTs":"2024-01-16 08:48:50"},{"position":31,"serialBoard":"","serial":"saljfbasdlgbalfefjsdef","lastUpdateTs":"2024-01-16 09:19:38"},{"position":32,"serialBoard":"sdasdmasmaf","serial":"dasdlansfasfaskfakfnas","lastUpdateTs":"2024-01-16 09:24:42"},{"position":33,"serialBoard":"dkjfskdfhdskjfhskf","serial":"fdklsjflhednfk","lastUpdateTs":"2024-01-16 09:26:00"},{"position":34,"serialBoard":"dkjfskdfhdskjfhskf","serial":"sfkjgafjasgfajfa","lastUpdateTs":"2024-01-16 09:26:00"},{"position":35,"serialBoard":"dkjfskdfhdskjfhskf","serial":"fajsfgajkfahfas","lastUpdateTs":"2024-01-16 09:26:00"}],"BG-BULB-03":[{"position":1,"serialBoard":"","serial":"fjsafasjhfafje","lastUpdateTs":"2023-12-07 15:37:56"},{"position":2,"serialBoard":"","serial":"dfbasjfhajsfahsfa","lastUpdateTs":"2023-12-07 15:37:56"}],"RD-TEST-THT":[{"position":1,"serialBoard":"","serial":"hungtestserial00001","lastUpdateTs":"2023-12-07 16:04:21"}],"RD-TEST-TS":[{"position":1,"serialBoard":"","serial":"hungtestserial00001","lastUpdateTs":"2023-12-07 16:04:52"},{"position":2,"serialBoard":"","serial":"hungtestserial00002","lastUpdateTs":"2023-12-07 16:05:09"}]};

  // public fakeList_error_serial = [{"stage_name":"BG-BULB-01","list_serial_error":[{"serial":"sdfsdfsdfsdf","Error_Detail":[{"err_key":"ERROR46","value":1},{"err_key":"ERROR386","value":1},{"err_key":"ERROR05","value":1},{"err_key":"ERROR06","value":1},{"err_key":"ERROR07","value":1},{"err_key":"ERROR08","value":1},{"err_key":"ERROR09","value":1},{"err_key":"ERROR01","value":1}],"Error_Detail_HMI":{}},{"serial":"sdfsdflzdngzdm,gzdgn","Error_Detail":[{"err_key":"ERROR46","value":1},{"err_key":"ERROR391","value":1}],"Error_Detail_HMI":{}},{"serial":"hungtestSerial","Error_Detail":[{"err_key":"ERROR391","value":-9}],"Error_Detail_HMI":{}},{"serial":"sdjaskdasdkasjdkasdasd","Error_Detail":[{"err_key":"ERROR03","value":1}],"Error_Detail_HMI":{}},{"serial":"wdwsdsd","Error_Detail":[{"err_key":"ERROR02","value":1}],"Error_Detail_HMI":{}},{"serial":"jehfjdshfklshfafjasfasf","Error_Detail":[{"err_key":"ERROR03","value":1},{"err_key":"ERROR06","value":2},{"err_key":"ERROR01","value":2}],"Error_Detail_HMI":{}},{"serial":"sdsdddsds","Error_Detail":[{"err_key":"ERROR04","value":2}],"Error_Detail_HMI":{}},{"serial":"a","Error_Detail":[{"err_key":"ERROR01","value":1},{"err_key":"ERROR08","value":2}],"Error_Detail_HMI":{}},{"serial":"safhgfdsfhgdfs","Error_Detail":[{"err_key":"ERROR06","value":1},{"err_key":"ERROR03","value":1},{"err_key":"ERROR01","value":2},{"err_key":"ERROR07","value":1},{"err_key":"ERROR08","value":1},{"err_key":"ERROR05","value":1}],"Error_Detail_HMI":{}}]},{"stage_name":"BG-BULB-03","list_serial_error":[{"serial":"hungdxfssdd","Error_Detail":[{"err_key":"ERROR08","value":1}],"Error_Detail_HMI":{}},{"serial":"dsds","Error_Detail":[{"err_key":"ERROR388","value":1}],"Error_Detail_HMI":{}},{"serial":"dsfsdgsdhdfsfaf","Error_Detail":[{"err_key":"ERROR05","value":1}],"Error_Detail_HMI":{}}]},{"stage_name":"RD-TEST-THT","list_serial_error":[{"serial":"asd","Error_Detail":[{"err_key":"ERROR07","value":1}],"Error_Detail_HMI":{}}]},{"stage_name":"RD-TEST-LR","list_serial_error":[{"serial":"sdsdsdqw","Error_Detail":[{"err_key":"ERROR07","value":1},{"err_key":"ERROR09","value":1},{"err_key":"ERROR03","value":2},{"err_key":"ERROR05","value":1},{"err_key":"ERROR02","value":2},{"err_key":"ERROR06","value":-1}],"Error_Detail_HMI":{}},{"serial":"eeqeqeq","Error_Detail":[{"err_key":"ERROR09","value":1},{"err_key":"ERROR04","value":1},{"err_key":"ERROR03","value":1}],"Error_Detail_HMI":{}},{"serial":"hdvcfdhjkafvashdjfgsdhj","Error_Detail":[{"err_key":"ERROR09","value":1},{"err_key":"ERROR08","value":1}],"Error_Detail_HMI":{}}]}];


  private searchAction: WidgetAction = {
    name: 'Export Excel',
    show: true,
    icon: 'import_export',
    onAction: async() => {
      this.loadingEl.nativeElement.classList.remove("hide");
      this.loadingEl.nativeElement.classList.add("spinner");
      var itemRealData : any;
      var arrRealData = [];
      try{
        var optionsLogin = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "ecyberlinh@gmail.com",
            password: "ATTT@123",
          }),
        };
        var textSearch = "";
        var sortProperty = "createdTime";
        var sortOrder = "DESC";
        var type = "stage";
        var responseLogin = await fetch(
          "http://192.168.68.95:4200/api/auth/login",
          optionsLogin
        );
        var resultLogin = await responseLogin.json();

        var optionsFirstWO = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Authorization": "Bearer " + resultLogin.token,
          },
        };
        var responseFirstWO = await fetch(
          `http://192.168.68.95:4200/api/tenant/assetInfos?pageSize=1&page=0&textSearch=${textSearch}&sortProperty=${sortProperty}&sortOrder=${sortOrder}&type=${type}`,
          optionsFirstWO
        );
        var resultFirstWO = await responseFirstWO.json();
        console.log("Success First WO:", resultFirstWO);
        var totalElements = resultFirstWO.totalElements;
        console.log("totalElements", totalElements);

        var optionsWO = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Authorization": "Bearer " + resultLogin.token,
          },
        };
        var responseWO = await fetch(
          `http://192.168.68.95:4200/api/tenant/assetInfos?pageSize=${totalElements}&page=0&textSearch=${textSearch}&sortProperty=${sortProperty}&sortOrder=${sortOrder}&type=${type}`,
          optionsWO
        );
        var resultWO = await responseWO.json();

        var responseTelemetry, resultTelemetry;
        var optionsTelemetry = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Authorization": "Bearer " + resultLogin.token,
          },
        };
        var arrWO = resultWO.data;
        var telemetrys = "Lot_Number,list_stage,Number_Of_Planning,Product_Code,Product_Name,Planning_Code,"+
        "Po_Id,quota,his_list_stage,Sap_Wo,description,machine_type,machine_stop_time,machine_running_time,dashboard_type,"+
        "machine_group,mStatus,machine_cycletime,machine_average_productivity,wo_number_of_input,wo_number_of_output,machine_status";
        for (let i = 0; i < arrWO.length; i++) {
          try {
            responseTelemetry = await fetch(
              `http://192.168.68.95:4200/api/plugins/telemetry/${arrWO[i].id.entityType}/${arrWO[i].id.id}/values/timeseries?useStrictDataTypes=false&keys=${telemetrys}`,
              optionsTelemetry
            );
            resultTelemetry = await responseTelemetry.json();
            if (resultTelemetry.mStatus[0].value == "Active") {
              itemRealData = {};
              itemRealData.asset_id = arrWO[i].id.id;
              itemRealData.asset_name = arrWO[i].name;
              itemRealData.asset_label = arrWO[i].label;
              itemRealData.asset_description = arrWO[i].additionalInfo;
              itemRealData.asset_created_time = arrWO[i].createdTime;
              itemRealData.machine_status = resultTelemetry.machine_status[0].value;
              itemRealData.lot_number = resultTelemetry.Lot_Number[0].value ? resultTelemetry.Lot_Number[0].value : "";
              itemRealData.list_stage = JSON.parse(resultTelemetry.list_stage[0].value);
              itemRealData.number_of_planning = resultTelemetry.Number_Of_Planning[0].value;
              itemRealData.product_code = resultTelemetry.Product_Code[0].value;
              itemRealData.product_name = resultTelemetry.Product_Name[0].value;
              itemRealData.planning_code = resultTelemetry.Planning_Code[0].value ? resultTelemetry.Planning_Code[0].value : "";
              itemRealData.wo_lot = itemRealData.planning_code ? itemRealData.planning_code + "-" + itemRealData.lot_number : "";
              itemRealData.po_id = resultTelemetry.Po_Id[0].value;
              itemRealData.quota = resultTelemetry.quota[0].value;
              itemRealData.his_list_stage = JSON.parse(resultTelemetry.his_list_stage[0].value);
              itemRealData.sap_wo = resultTelemetry.Sap_Wo[0].value;
              itemRealData.description = resultTelemetry.description[0].value;
              itemRealData.machine_type = resultTelemetry.machine_type[0].value;
              itemRealData.machineStopTime = resultTelemetry.machine_stop_time[0].value;
              itemRealData.machineRunningTime = resultTelemetry.machine_running_time[0].value;
              itemRealData.dashboard_type = resultTelemetry.dashboard_type[0].value;
              itemRealData.machine_group = resultTelemetry.machine_group[0].value;
              itemRealData.mstatus = resultTelemetry.mStatus[0].value;
              itemRealData.machine_cycletime = resultTelemetry.machine_cycletime[0].value;
              itemRealData.machine_average_productivity = resultTelemetry.machine_average_productivity[0].value;
              itemRealData.wo_number_of_input = resultTelemetry.wo_number_of_input[0].value;
              itemRealData.wo_number_of_output = resultTelemetry.wo_number_of_output[0].value;
              arrRealData.push(itemRealData);
            }
          }catch(e){
            console.log("Call API responseTelemetry ERR ", e);
          }
        }
      }catch(e){
        console.log("Call API ERR ", e);
      }


      var getListErrInCommonObservable = this.widgetService.getListErrInCommon();
      getListErrInCommonObservable.pipe(timeout(120000)).subscribe((dataListErrInCommon: any[]) => {
        var exportArr: any[] = [];
        var MachineErrorDetailArr: any[] = [];
        var SerialMachineErrorArr: any[] = [];
        
        if (this.checkFillter == true) {
          let getArrFillterValue = JSON.parse(
            JSON.stringify(
              this.fillterArr.filter(item => {
                return item.value.toString().length > 0;
              })
            )
          )
          
          getArrFillterValue.forEach(item2 => {
            switch (item2.columnName) {
              case "name":
                item2.columnName = "asset_name";
                break;
              case "label":
                item2.columnName = "asset_label";
                break;
              case "description":
                item2.columnName = "description";
                break;
              case "machine_status":
                item2.columnName = "machine_status";
                break;
              case "Po_Id":
                item2.columnName = "po_id";
                break;
              case "Planning_Code":
                item2.columnName = "planning_code";
                break;
              case "Lot_Number":
                item2.columnName = "lot_number";
                break;
              case "Product_Code":
                item2.columnName = "product_code";
                break;
              case "Product_Name":
                item2.columnName = "product_name";
                break;
              case "Number_Of_Planning":
                item2.columnName = "number_of_planning";
                break;
              case "machine_type":
                item2.columnName = "machine_type";
                break;
              case "machine_group":
                item2.columnName = "machine_group";
                break;
              case "dashboard_type":
                item2.columnName = "dashboard_type";
                break;
              default:
                break;
            }
          });

          let dataFillter = {};
          getArrFillterValue.forEach(item3 => {
            if(item3.columnName == "asset_name"){
              dataFillter[item3.columnName] = item3.value.toString().toUpperCase();
            }else if(item3.columnName == "asset_label"){
              dataFillter[item3.columnName] = item3.value.toString().toUpperCase();
            }else if(item3.columnName == "description"){
              dataFillter[item3.columnName] = item3.value.toString().toUpperCase();
            }else if(item3.columnName == "po_id"){
              dataFillter[item3.columnName] = item3.value.toString().toUpperCase();
            }else if(item3.columnName == "planning_code"){
              dataFillter[item3.columnName] = item3.value.toString().toUpperCase();
            }else{
              dataFillter[item3.columnName] = item3.value;
            }
          })
          let result = this.filterData(arrRealData, dataFillter);
          arrRealData = [...result];

        }
        var reportData = arrRealData;
        reportData.forEach(item => {
          item.Machine_Description = item.description;
          item.TrangThai = Number(item.machine_status) == 0 ? "Running" : Number(item.machine_status) == 99 ? "Waiting" : "Stop";
          item.Time_Machine_Running = this.secondsToHms(Number(item.machineRunningTime));
          item.Time_Machine_Stop = this.secondsToHms(Number(item.machineStopTime));
          item.Time_Created = this.timeConverter(Number(item.asset_created_time));
          item.Total_Error_Machine = this.totalErrorMachine(item.list_stage,item.his_list_stage,item.asset_name);
          item.Hop_Cach = this.handleMachineHopCach(Number(item.wo_number_of_input),Number(item.Total_Error_Machine));
          item.Do_Tin_Cay = this.handleMachineDoTinCay(item.list_stage,item.his_list_stage,dataListErrInCommon,Number(item.wo_number_of_input),item.asset_name);
          item.PPM = this.handleMachinePPM(Number(item.Total_Error_Machine),Number(item.wo_number_of_input),Number(item.quota));
          item.OEE = this.handleMachineOEE(Number(item.machineRunningTime),Number(item.machineStopTime),Number(item.machineCycletime),Number(item.wo_number_of_input),Number(item.wo_number_of_output),Number(item.Total_Error_Machine));
          item.Nang_Suat_Thuc_Tinh = this.handleMachineNangSuatThucTinh(Number(item.wo_number_of_output),Number(item.machineRunningTime));
          item.Cycle_Time_TrungBinh = this.handleMachineCycleTimeTrungBinh(Number(item.wo_number_of_output),Number(item.machineRunningTime));
          item.Ti_Le_Loi_Vat_Tu = this.handleTotalVattuErr(item.list_stage , item.his_list_stage , item.asset_name , dataListErrInCommon,Number(item.wo_number_of_input));
          item.San_Luong_Ca_1 = 0;
          item.San_Luong_Ca_2 = 0;
          item.List_Error = this.handleListErrorByMachine(item.list_stage,item.his_list_stage,item.asset_name,dataListErrInCommon);
          // item.List_Serial_Error = this.handleListSerialErrorByMachine(item.list_error_serial,dataListErrInCommon,item.assetName);
          item.List_Serial_Error = [];
        });

        var MachineErrorDetailItem: any;
        reportData.forEach(item => {
          item.List_Error.forEach(itemError => {
            MachineErrorDetailItem = {};
            MachineErrorDetailItem.planning_code = item.planning_code;
            MachineErrorDetailItem.wo_lot = item.wo_lot;
            MachineErrorDetailItem.po_id = item.po_id;
            MachineErrorDetailItem.asset_name = item.asset_name;
            MachineErrorDetailItem.asset_label = item.asset_label;
            MachineErrorDetailItem.Machine_Description = item.Machine_Description;
            MachineErrorDetailItem.TrangThai = item.TrangThai;
            MachineErrorDetailItem.sap_wo = item.sap_wo;
            MachineErrorDetailItem.lot_number = item.lot_number;
            MachineErrorDetailItem.product_code = item.product_code;
            MachineErrorDetailItem.product_name = item.product_name;
            MachineErrorDetailItem.StageMachine = item.asset_name;
            MachineErrorDetailItem.err_key = itemError.err_key;
            MachineErrorDetailItem.err_name = itemError.err_name;
            MachineErrorDetailItem.value = itemError.value;
            MachineErrorDetailItem.type_error = itemError.type_error;
            MachineErrorDetailArr.push(MachineErrorDetailItem);
          });
        });

        var SerialMachineErrorItem: any;
        reportData.forEach(item => {
          item.List_Serial_Error.forEach(itemError => {
            SerialMachineErrorItem = {};
            SerialMachineErrorItem.planning_code = item.planning_code;
            SerialMachineErrorItem.wo_lot = item.wo_lot;
            SerialMachineErrorItem.po_id = item.po_id;
            SerialMachineErrorItem.asset_name = item.asset_name;
            SerialMachineErrorItem.asset_label = item.asset_label;
            SerialMachineErrorItem.Machine_Description = item.Machine_Description;
            SerialMachineErrorItem.TrangThai = item.TrangThai;
            SerialMachineErrorItem.sap_wo = item.sap_wo;
            SerialMachineErrorItem.lot_number = item.lot_number;
            SerialMachineErrorItem.product_code = item.product_code;
            SerialMachineErrorItem.product_name = item.product_name;
            SerialMachineErrorItem.StageMachine = item.asset_name;
            SerialMachineErrorItem.serialBoard = "";
            SerialMachineErrorItem.serial = itemError.serial;
            SerialMachineErrorItem.err_key = itemError.err_key;
            SerialMachineErrorItem.err_name = itemError.err_name;
            SerialMachineErrorItem.value = itemError.value;
            SerialMachineErrorItem.type_error = itemError.type_error;
            SerialMachineErrorArr.push(SerialMachineErrorItem);
          });
        });

        var ListSerial: any[] = [];
        var ListSerialItem: any = {};
        var serial_stageObj: any;
        reportData.forEach(item => {
          try {
            if (item.serial_stage != null) {
              if (typeof item.serial_stage == 'string') {
                serial_stageObj = JSON.parse(item.serial_stage.replaceAll("\'", '\"'));
              } else {
                serial_stageObj = item.serial_stage;
              }

              for (var key in serial_stageObj) {
                if(item.asset_name == key){
                  serial_stageObj[key].forEach(item2 => {
                  ListSerialItem.planning_code = item.planning_code;
                  ListSerialItem.wo_lot = item.wo_lot;
                  ListSerialItem.po_id = item.po_id;
                  ListSerialItem.sap_wo = item.sap_wo;
                  ListSerialItem.lot_number = item.lot_number;
                  ListSerialItem.StageMachine = item.asset_name;
                  ListSerialItem.serialBoard = item2.serialBoard;
                  ListSerialItem.serial = item2.serial;
                  ListSerialItem.lastUpdateTs = this.timeConverter(Number(new Date(item2.lastUpdateTs)));
                  ListSerial.push(ListSerialItem);
                  ListSerialItem = {};
                })
                }
              }

            }
          } catch (error) {

          }
        })
        
        reportData.forEach(item => {
          let {asset_id ,asset_description ,asset_created_time, status_wo , list_stage , his_list_stage, list_error_serial, machineRunningTime, machineStopTime, 
            machine_average_productivity, mstatus, quota, serial_stage, List_Error, machineCycletime ,description,dashboard_type,machine_status,...restPro } = item;
          exportArr.push(restPro);
        });

        console.log("exportArr",exportArr);
        this.exportToExcel(exportArr, "ReportListMachine", "Report_List_Machine",MachineErrorDetailArr,SerialMachineErrorArr,ListSerial);
        },(error) => {
          this.loadingEl.nativeElement.classList.remove("spinner");
          this.loadingEl.nativeElement.classList.add("hide");
          this.ctx.showErrorToast("Xuất excel thất bại", "top", "left");
        })
    }
  };

  private columnDisplayAction: WidgetAction = {
    name: 'entity.columns-to-display',
    show: true,
    icon: 'view_column',
    onAction: ($event) => {
      this.editColumnsToDisplay($event);
    }
  };

  constructor(protected store: Store<AppState>,
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private utils: UtilsService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private domSanitizer: DomSanitizer,
    private widgetService: WidgetService) {
    super(store);
    this.pageLink = {
      page: 0,
      pageSize: this.defaultPageSize,
      textSearch: null,
      dynamic: true
    };
  }

  ngOnInit(): void {
    this.ctx.$scope.entitiesTableWidget = this;
    this.settings = this.ctx.settings;
    this.widgetConfig = this.ctx.widgetConfig;
    this.subscription = this.ctx.defaultSubscription;
    this.initializeConfig();
    this.updateDatasources();
    this.ctx.updateWidgetParams();
    // ------------- Code Start ----------------
    this.columns.forEach(item => {
      this.fillterArr.push({
        value: "",
        columnName: item.name
      })
    });
    // ------------- Code End -------------------
  }

  ngAfterViewInit(): void {
    // fromEvent(this.searchInputField.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       if (this.displayPagination) {
    //         this.paginator.pageIndex = 0;
    //       }
    //       this.updateData();
    //     })
    //   )
    //   .subscribe();

    if (this.displayPagination) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
    ((this.displayPagination ? merge(this.sort.sortChange, this.paginator.page) : this.sort.sortChange) as Observable<any>)
      .pipe(
        tap(() => { this.updateData(); console.log("PHD datasource update 2: ", this.entityDatasource); })
      )
      .subscribe();
    
    // -------------------- Code Start -----------------
    var localCheckFilter = JSON.parse(sessionStorage.getItem("checkFillterMachine"));
    console.log("----------localCheckFilter------------", localCheckFilter);
    var localFillterArr = JSON.parse(sessionStorage.getItem("fillterArrMachine"));
    console.log("----------localFillterArr------------", localFillterArr);
    var giamsatPageIndex = JSON.parse(sessionStorage.getItem("machinePageIndex"));
    this.paginator.pageIndex = giamsatPageIndex;
    var giamsatPageSize = JSON.parse(sessionStorage.getItem("machinePageSize"));
    this.paginator.pageSize = giamsatPageSize;
	this.updateData();
    if (localCheckFilter == true) {
      this.checkFillter = true;
      this.fillterArr = localFillterArr;
      this.updateData();
    } else {

    }
    // -------------------- Code End ------------------------
  }
  ngOnDestroy() {
    sessionStorage.setItem("machinePageIndex", JSON.stringify(this.paginator.pageIndex));
    sessionStorage.setItem("machinePageSize", JSON.stringify(this.paginator.pageSize));
  }

  public onDataUpdated() {
    this.updateTitle(true);
    this.entityDatasource.dataUpdated();
    this.clearCache();
    this.ctx.detectChanges();
  }

  public pageLinkSortDirection(): SortDirection {
    return entityDataPageLinkSortDirection(this.pageLink);
  }

  private initializeConfig() {
    this.ctx.widgetActions = [this.searchAction, this.columnDisplayAction];

    this.actionCellDescriptors = this.ctx.actionsApi.getActionDescriptors('actionCellButton');

    if (this.settings.entitiesTitle && this.settings.entitiesTitle.length) {
      this.entitiesTitlePattern = this.utils.customTranslation(this.settings.entitiesTitle, this.settings.entitiesTitle);
    } else {
      this.entitiesTitlePattern = this.translate.instant('entity.entities');
    }

    this.updateTitle(false);

    this.searchAction.show = isDefined(this.settings.enableSearch) ? this.settings.enableSearch : true;
    this.displayPagination = isDefined(this.settings.displayPagination) ? this.settings.displayPagination : true;
    this.enableStickyHeader = isDefined(this.settings.enableStickyHeader) ? this.settings.enableStickyHeader : true;
    this.enableStickyAction = isDefined(this.settings.enableStickyAction) ? this.settings.enableStickyAction : true;
    this.columnDisplayAction.show = isDefined(this.settings.enableSelectColumnDisplay) ? this.settings.enableSelectColumnDisplay : true;

    this.rowStylesInfo = getRowStyleInfo(this.settings, 'entity, ctx');

    const pageSize = this.settings.defaultPageSize;
    if (isDefined(pageSize) && isNumber(pageSize) && pageSize > 0) {
      this.defaultPageSize = pageSize;
    }
    this.pageSizeOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3];
    this.pageLink.pageSize = this.displayPagination ? this.defaultPageSize : 1024;

    const cssString = constructTableCssString(this.widgetConfig);
    const cssParser = new cssjs();
    cssParser.testMode = false;
    const namespace = 'entities-table-' + hashCode(cssString);
    cssParser.cssPreviewNamespace = namespace;
    cssParser.createStyleElement(namespace, cssString);
    $(this.elementRef.nativeElement).addClass(namespace);
  }

  private updateTitle(updateWidgetParams = false) {
    const newTitle = createLabelFromDatasource(this.subscription.datasources[0], this.entitiesTitlePattern);
    if (this.ctx.widgetTitle !== newTitle) {
      this.ctx.widgetTitle = newTitle;
      if (updateWidgetParams) {
        this.ctx.updateWidgetParams();
      }
    }
  }

  private updateDatasources() {

    const displayEntityName = isDefined(this.settings.displayEntityName) ? this.settings.displayEntityName : true;
    const displayEntityLabel = isDefined(this.settings.displayEntityLabel) ? this.settings.displayEntityLabel : false;
    let entityNameColumnTitle: string;
    let entityLabelColumnTitle: string;
    if (this.settings.entityNameColumnTitle && this.settings.entityNameColumnTitle.length) {
      entityNameColumnTitle = this.utils.customTranslation(this.settings.entityNameColumnTitle, this.settings.entityNameColumnTitle);
    } else {
      entityNameColumnTitle = this.translate.instant('entity.entity-name');
    }
    if (this.settings.entityLabelColumnTitle && this.settings.entityLabelColumnTitle.length) {
      entityLabelColumnTitle = this.utils.customTranslation(this.settings.entityLabelColumnTitle, this.settings.entityLabelColumnTitle);
    } else {
      entityLabelColumnTitle = this.translate.instant('entity.entity-label');
    }
    const displayEntityType = isDefined(this.settings.displayEntityType) ? this.settings.displayEntityType : true;

    if (displayEntityName) {
      this.columns.push(
        {
          name: 'entityName',
          label: 'entityName',
          def: 'entityName',
          title: entityNameColumnTitle,
          entityKey: {
            key: 'name',
            type: EntityKeyType.ENTITY_FIELD
          }
        } as EntityColumn
      );
      this.contentsInfo.entityName = {
        useCellContentFunction: false
      };
      this.stylesInfo.entityName = {
        useCellStyleFunction: false
      };
      this.columnWidth.entityName = '0px';
      this.columnDefaultVisibility.entityName = true;
      this.columnSelectionAvailability.entityName = true;
    }
    if (displayEntityLabel) {
      this.columns.push(
        {
          name: 'entityLabel',
          label: 'entityLabel',
          def: 'entityLabel',
          title: entityLabelColumnTitle,
          entityKey: {
            key: 'label',
            type: EntityKeyType.ENTITY_FIELD
          }
        } as EntityColumn
      );
      this.contentsInfo.entityLabel = {
        useCellContentFunction: false
      };
      this.stylesInfo.entityLabel = {
        useCellStyleFunction: false
      };
      this.columnWidth.entityLabel = '0px';
      this.columnDefaultVisibility.entityLabel = true;
      this.columnSelectionAvailability.entityLabel = true;
    }
    if (displayEntityType) {
      this.columns.push(
        {
          name: 'entityType',
          label: 'entityType',
          def: 'entityType',
          title: this.translate.instant('entity.entity-type'),
          entityKey: {
            key: 'entityType',
            type: EntityKeyType.ENTITY_FIELD
          }
        } as EntityColumn
      );
      this.contentsInfo.entityType = {
        useCellContentFunction: false
      };
      this.stylesInfo.entityType = {
        useCellStyleFunction: false
      };
      this.columnWidth.entityType = '0px';
      this.columnDefaultVisibility.entityType = true;
      this.columnSelectionAvailability.entityType = true;
    }

    const dataKeys: Array<DataKey> = [];

    const datasource = this.subscription.options.datasources ? this.subscription.options.datasources[0] : null;

    if (datasource && datasource.dataKeys) {
      datasource.dataKeys.forEach((entityDataKey) => {
        const dataKey: EntityColumn = deepClone(entityDataKey) as EntityColumn;
        dataKey.entityKey = dataKeyToEntityKey(entityDataKey);
        if (dataKey.type === DataKeyType.function) {
          dataKey.name = dataKey.label;
        }
        dataKeys.push(dataKey);

        dataKey.label = this.utils.customTranslation(dataKey.label, dataKey.label);
        dataKey.title = dataKey.label;
        dataKey.def = 'def' + this.columns.length;
        const keySettings: TableWidgetDataKeySettings = dataKey.settings;
        if (dataKey.type === DataKeyType.entityField &&
          !isDefined(keySettings.columnWidth) || keySettings.columnWidth === '0px') {
          const entityField = entityFields[dataKey.name];
          if (entityField && entityField.time) {
            keySettings.columnWidth = '120px';
          }
        }

        this.stylesInfo[dataKey.def] = getCellStyleInfo(keySettings, 'value, entity, ctx');
        this.contentsInfo[dataKey.def] = getCellContentInfo(keySettings, 'value, entity, ctx');
        this.contentsInfo[dataKey.def].units = dataKey.units;
        this.contentsInfo[dataKey.def].decimals = dataKey.decimals;
        this.columnWidth[dataKey.def] = getColumnWidth(keySettings);
        this.columnDefaultVisibility[dataKey.def] = getColumnDefaultVisibility(keySettings);
        this.columnSelectionAvailability[dataKey.def] = getColumnSelectionAvailability(keySettings);
        this.columns.push(dataKey);
      });
      this.displayedColumns.push(...this.columns.filter(column => this.columnDefaultVisibility[column.def])
        .map(column => column.def));
    }

    if (this.settings.defaultSortOrder && this.settings.defaultSortOrder.length) {
      this.defaultSortOrder = this.utils.customTranslation(this.settings.defaultSortOrder, this.settings.defaultSortOrder);
    }

    this.pageLink.sortOrder = entityDataSortOrderFromString(this.defaultSortOrder, this.columns);
    let sortColumn: EntityColumn;
    if (this.pageLink.sortOrder) {
      sortColumn = findColumnByEntityKey(this.pageLink.sortOrder.key, this.columns);
    }
    this.sortOrderProperty = sortColumn ? sortColumn.def : null;

    if (this.actionCellDescriptors.length) {
      this.displayedColumns.push('actions');
    }
    this.entityDatasource = new EntityDatasource(this.translate, dataKeys, this.subscription, this.ngZone);
  }

  private editColumnsToDisplay($event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    const target = $event.target || $event.currentTarget;
    const config = new OverlayConfig();
    config.backdropClass = 'cdk-overlay-transparent-backdrop';
    config.hasBackdrop = true;
    const connectedPosition: ConnectedPosition = {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top'
    };
    config.positionStrategy = this.overlay.position().flexibleConnectedTo(target as HTMLElement)
      .withPositions([connectedPosition]);

    const overlayRef = this.overlay.create(config);
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });

    const columns: DisplayColumn[] = this.columns.map(column => {
      return {
        title: column.title,
        def: column.def,
        display: this.displayedColumns.indexOf(column.def) > -1,
        selectable: this.columnSelectionAvailability[column.def]
      };
    });

    const providers: StaticProvider[] = [
      {
        provide: DISPLAY_COLUMNS_PANEL_DATA,
        useValue: {
          columns,
          columnsUpdated: (newColumns) => {
            this.displayedColumns = newColumns.filter(column => column.display).map(column => column.def);
            if (this.actionCellDescriptors.length) {
              this.displayedColumns.push('actions');
            }
            this.clearCache();
          }
        } as DisplayColumnsPanelData
      },
      {
        provide: OverlayRef,
        useValue: overlayRef
      }
    ];
    const injector = Injector.create({ parent: this.viewContainerRef.injector, providers });
    overlayRef.attach(new ComponentPortal(DisplayColumnsPanelComponent,
      this.viewContainerRef, injector));
    this.ctx.detectChanges();
  }

  private enterFilterMode() {
    this.textSearchMode = true;
    this.pageLink.textSearch = '';
    this.ctx.hideTitlePanel = true;
    this.ctx.detectChanges(true);
    setTimeout(() => {
      this.searchInputField.nativeElement.focus();
      this.searchInputField.nativeElement.setSelectionRange(0, 0);
    }, 10);
  }

  exitFilterMode() {
    this.textSearchMode = false;
    this.pageLink.textSearch = null;
    if (this.displayPagination) {
      this.paginator.pageIndex = 0;
    }
    this.updateData();
    this.ctx.hideTitlePanel = false;
    this.ctx.detectChanges(true);
  }

  private updateData() {
    if (this.displayPagination) {
      this.pageLink.page = this.paginator.pageIndex;
      this.pageLink.pageSize = this.paginator.pageSize;
    } else {
      this.pageLink.page = 0;
    }
    const key = findEntityKeyByColumnDef(this.sort.active, this.columns);
    if (key) {
      this.pageLink.sortOrder = {
        key,
        direction: Direction[this.sort.direction.toUpperCase()]
      };
    } else {
      this.pageLink.sortOrder = null;
    }
    const sortOrderLabel = fromEntityColumnDef(this.sort.active, this.columns);
    let keyFilters: KeyFilter[] = []; // TODO:
    if (this.checkFillter == true) {
      keyFilters = this.handleSearchByColumn();
    } else {
      keyFilters = [];
    }
    this.entityDatasource.loadEntities(this.pageLink, sortOrderLabel, keyFilters);
    this.ctx.detectChanges();
  }

  public trackByColumnDef(column: EntityColumn) {
    return column.def;
  }

  public trackByEntityId(index: number, entity: EntityData) {
    return entity.id.id;
  }

  public trackByActionCellDescriptionId(action: WidgetActionDescriptor) {
    return action.id;
  }

  public headerStyle(key: EntityColumn): any {
    const columnWidth = this.columnWidth[key.def];
    return widthStyle(columnWidth);
  }

  public rowStyle(entity: EntityData, row: number): any {
    let res = this.rowStyleCache[row];
    if (!res) {
      res = {};
      if (entity && this.rowStylesInfo.useRowStyleFunction && this.rowStylesInfo.rowStyleFunction) {
        try {
          res = this.rowStylesInfo.rowStyleFunction(entity, this.ctx);
          if (!isObject(res)) {
            throw new TypeError(`${res === null ? 'null' : typeof res} instead of style object`);
          }
          if (Array.isArray(res)) {
            throw new TypeError(`Array instead of style object`);
          }
        } catch (e) {
          res = {};
          console.warn(`Row style function in widget '${this.ctx.widgetTitle}' ` +
            `returns '${e}'. Please check your row style function.`);
        }
      }
      this.rowStyleCache[row] = res;
    }
    return res;
  }

  public cellStyle(entity: EntityData, key: EntityColumn, row: number): any {
    const col = this.columns.indexOf(key);
    const index = row * this.columns.length + col;
    let res = this.cellStyleCache[index];
    if (!res) {
      res = {};
      if (entity && key) {
        const styleInfo = this.stylesInfo[key.def];
        const value = getEntityValue(entity, key);
        if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
          try {
            res = styleInfo.cellStyleFunction(value, entity, this.ctx);
            if (!isObject(res)) {
              throw new TypeError(`${res === null ? 'null' : typeof res} instead of style object`);
            }
            if (Array.isArray(res)) {
              throw new TypeError(`Array instead of style object`);
            }
          } catch (e) {
            res = {};
            console.warn(`Cell style function for data key '${key.label}' in widget '${this.ctx.widgetTitle}' ` +
              `returns '${e}'. Please check your cell style function.`);
          }
        }
        this.cellStyleCache[index] = res;
      }
    }
    if (!res.width) {
      const columnWidth = this.columnWidth[key.def];
      res = Object.assign(res, widthStyle(columnWidth));
    }
    return res;
  }

  public cellContent(entity: EntityData, key: EntityColumn, row: number): SafeHtml {
    const col = this.columns.indexOf(key);
    const index = row * this.columns.length + col;
    let res = this.cellContentCache[index];
    if (isUndefined(res)) {
      res = '';
      if (entity && key) {
        const contentInfo = this.contentsInfo[key.def];
        const value = getEntityValue(entity, key);
        let content: string;
        if (contentInfo.useCellContentFunction && contentInfo.cellContentFunction) {
          try {
            content = contentInfo.cellContentFunction(value, entity, this.ctx);
          } catch (e) {
            content = '' + value;
          }
        } else {
          content = this.defaultContent(key, contentInfo, value);
        }

        if (isDefined(content)) {
          content = this.utils.customTranslation(content, content);
          switch (typeof content) {
            case 'string':
              res = this.domSanitizer.bypassSecurityTrustHtml(content);
              break;
            default:
              res = content;
          }
        }
      }
      this.cellContentCache[index] = res;
    }
    return res;
  }

  private defaultContent(key: EntityColumn, contentInfo: CellContentInfo, value: any): any {
    if (isDefined(value)) {
      const entityField = entityFields[key.name];
      if (entityField) {
        if (entityField.time) {
          return this.datePipe.transform(value, 'yyyy-MM-dd HH:mm:ss');
        }
      }
      const decimals = (contentInfo.decimals || contentInfo.decimals === 0) ? contentInfo.decimals : this.ctx.widgetConfig.decimals;
      const units = contentInfo.units || this.ctx.widgetConfig.units;
      return this.ctx.utils.formatValue(value, decimals, units, true);
    } else {
      return '';
    }
  }

  public onRowClick($event: Event, entity: EntityData, isDouble?: boolean) {
    if ($event) {
      $event.stopPropagation();
    }
    this.entityDatasource.toggleCurrentEntity(entity);
    const actionSourceId = isDouble ? 'rowDoubleClick' : 'rowClick';
    const descriptors = this.ctx.actionsApi.getActionDescriptors(actionSourceId);
    if (descriptors.length) {
      let entityId;
      let entityName;
      let entityLabel;
      if (entity) {
        entityId = entity.id;
        entityName = entity.entityName;
        entityLabel = entity.entityLabel;
      }
      this.ctx.actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, { entity }, entityLabel);
    }
  }

  public onActionButtonClick($event: Event, entity: EntityData, actionDescriptor: WidgetActionDescriptor) {
    if ($event) {
      $event.stopPropagation();
    }
    let entityId;
    let entityName;
    let entityLabel;
    if (entity) {
      entityId = entity.id;
      entityName = entity.entityName;
      entityLabel = entity.entityLabel;
    }
    this.ctx.actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, { entity }, entityLabel);
  }

  private clearCache() {
    this.cellContentCache.length = 0;
    this.cellStyleCache.length = 0;
    this.rowStyleCache.length = 0;
  }

  // -------------- Code Start ----------------
  handleSearchByColumn() {
    console.log("---------checkFillter--------", this.checkFillter);
    if (this.checkFillter == true) {
      console.log("-------------fillterArr------------", this.fillterArr);
      sessionStorage.setItem("checkFillterMachine", JSON.stringify(this.checkFillter));
      sessionStorage.setItem("fillterArrMachine", JSON.stringify(this.fillterArr));
      let arrFillterValue = this.fillterArr.filter(item => {
        return item.value.toString().length > 0;
      })
      console.log("----------realFillterValue---------", arrFillterValue);
      const keyFilters: KeyFilter[] = []; // TODO:
      let initKeyFilter: KeyFilter;
      arrFillterValue.forEach(item => {
        if (item.columnName == "Planning_Code" || item.columnName == "machine_input_by_day" || item.columnName == "machine_output_by_day" || item.columnName == "Po_Id" || item.columnName == "Lot_Number" || item.columnName == "Product_Code" || item.columnName == "Product_Name" || item.columnName == "Number_Of_Planning") {
          initKeyFilter = {
            key: {
              type: EntityKeyType.TIME_SERIES,
              key: item.columnName,
            },
            valueType: EntityKeyValueType.STRING,
            value: undefined,
            predicate: {
              type: FilterPredicateType.STRING,
              operation: StringOperation.CONTAINS,
              value: {
                defaultValue: item.value.trim(),
                dynamicValue: null
              },
              ignoreCase: true,
            }
          }
        } else if (item.columnName == "machine_status") {
          initKeyFilter = {
            key: {
              type: EntityKeyType.TIME_SERIES,
              key: item.columnName,
            },
            valueType: EntityKeyValueType.NUMERIC,
            value: undefined,
            predicate: {
              type: FilterPredicateType.NUMERIC,
              operation: NumericOperation.EQUAL,
              value: {
                defaultValue: item.value,
                dynamicValue: null
              },
            }
          }
        } else if (item.columnName == "name" || item.columnName == "label") {
          initKeyFilter = {
            key: {
              type: EntityKeyType.ENTITY_FIELD,
              key: item.columnName,
            },
            valueType: EntityKeyValueType.STRING,
            value: undefined,
            predicate: {
              type: FilterPredicateType.STRING,
              operation: StringOperation.CONTAINS,
              value: {
                defaultValue: item.value.trim(),
                dynamicValue: null
              },
              ignoreCase: true,
            }
          }
        } else {
          initKeyFilter = {
            key: {
              type: EntityKeyType.ATTRIBUTE,
              key: item.columnName,
            },
            valueType: EntityKeyValueType.STRING,
            value: undefined,
            predicate: {
              type: FilterPredicateType.STRING,
              operation: StringOperation.CONTAINS,
              value: {
                defaultValue: item.value.trim(),
                dynamicValue: null
              },
              ignoreCase: true,
            }
          }
        }
        keyFilters.push(initKeyFilter);
      })
      console.log("---------keyFilters PHD---------", keyFilters);
      return keyFilters;
    }
  }
  handleEnter() {
    this.updateData();
  }
  handleKeyUp() {
    this.checkFillter = this.fillterArr.some(item => {
      return item.value.toString().length > 0;
    });
    if (this.checkFillter == false) {
      this.updateData();
      sessionStorage.setItem("checkFillterMachine", JSON.stringify(this.checkFillter));
      sessionStorage.setItem("fillterArrMachine", JSON.stringify(this.fillterArr));
    } else {

    }
  }
  handleChangeStatus() {
    this.checkFillter = this.fillterArr.some(item => {
      return item.value.toString().length > 0;
    });
    console.log("----------------handleChangeStatus---------------", this.checkFillter);
    if (this.checkFillter == false) {
      this.updateData();
      sessionStorage.setItem("checkFillterMachine", JSON.stringify(this.checkFillter));
      sessionStorage.setItem("fillterArrMachine", JSON.stringify(this.fillterArr));
    } else {
      this.updateData();
    }
  }

  handleChangeDashType() {
    this.checkFillter = this.fillterArr.some(item => {
      return item.value.toString().length > 0;
    });
    if (this.checkFillter == false) {
      this.updateData();
      sessionStorage.setItem("checkFillterMachine", JSON.stringify(this.checkFillter));
      sessionStorage.setItem("fillterArrMachine", JSON.stringify(this.fillterArr));
    } else {
      this.updateData();
    }
  }

  handleChangeMachineType(){
    this.checkFillter = this.fillterArr.some(item => {
      return item.value.toString().length > 0;
    });
    if (this.checkFillter == false) {
      this.updateData();
      sessionStorage.setItem("checkFillterMachine", JSON.stringify(this.checkFillter));
      sessionStorage.setItem("fillterArrMachine", JSON.stringify(this.fillterArr));
    } else {
      this.updateData();
    }
  }

  handleChangeMachineGroup(){
    this.checkFillter = this.fillterArr.some(item => {
      return item.value.toString().length > 0;
    });
    if (this.checkFillter == false) {
      this.updateData();
      sessionStorage.setItem("checkFillterMachine", JSON.stringify(this.checkFillter));
      sessionStorage.setItem("fillterArrMachine", JSON.stringify(this.fillterArr));
    } else {
      this.updateData();
    }
  }

  // ---------------Start Handle Export Excel ------------------
    //---------------------------------START HANDLE FILTER EXPORT-----------------------------------------------------
  filterData = (data, query) => {
    var arrKeyItem;
    const filteredData = data.filter((item) => {
      for (let key in query) {
        arrKeyItem = Object.keys(item);
        if (arrKeyItem.includes(key)) {
          if (item[key] != null) {
            if (!item[key].includes(query[key])) {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    });
    return filteredData;
  };
  //-----------------------------------END HANDLE FILTER EXPORT---------------------------------------------------
  secondsToHms(secs: any) {
    var time = new Date();
    time.setHours(parseInt((secs / 3600).toString()) % 24);
    time.setMinutes(parseInt((secs / 60).toString()) % 60);
    time.setSeconds(parseInt((secs % 60).toString()));
    var timeFormart = time.toTimeString().split(" ")[0];
    return timeFormart;
  }
  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate().toString().length <= 1 ? "0" + a.getDate() : a.getDate();
    var hour = a.getHours().toString().length <= 1 ? "0" + a.getHours() : a.getHours();
    var min = a.getMinutes().toString().length <= 1 ? "0" + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds().toString().length <= 1 ? "0" + a.getSeconds() : a.getSeconds();
    var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }
  totalErrorMachine(list_stage, his_list_stage , machineName): any {
    var sum_err = 0;
    var sum_list_err_detail = 0 , sum_list_err_detail_hmi = 0;
    var sum_his_err_detail = 0 , sum_his_err_detail_hmi = 0;
        if(list_stage != null){
          if(list_stage.length > 0 ){
              let gettedListStage = list_stage.find(stage => stage.stage_name == machineName);
              if(gettedListStage){
                if(gettedListStage.hasOwnProperty("Error_Detail")){
                    if(gettedListStage["Error_Detail"].length > 0){
                        var list_err_detail = gettedListStage["Error_Detail"];
                        for( var x = 0 ; x < list_err_detail.length ; x++){
                            if(list_err_detail[x].value != null){
                                sum_list_err_detail += parseInt (list_err_detail[x].value);
                            }
                        }
                    }
                }
                if(gettedListStage.hasOwnProperty("Error_Detail_HMI")){
                    if(!jQuery.isEmptyObject(gettedListStage["Error_Detail_HMI"])){
                        var list_err_detail_hmi = gettedListStage["Error_Detail_HMI"];
                        for (const property in list_err_detail_hmi) {
                            sum_list_err_detail_hmi += parseInt(list_err_detail_hmi[property]);
                        }
                    }
                }
              }
              
          }
        }
        
        
        if(his_list_stage != null){
            if(his_list_stage.length > 0 ){
                let gettedHisListStage = his_list_stage.find(stage => stage.stage_name == machineName);
                
                console.log("PHD his_list_stage", his_list_stage);
                console.log("PHD machineName", machineName);
                console.log("PHD gettedHisListStage", gettedHisListStage);

                if(gettedHisListStage){
                  if(gettedHisListStage.hasOwnProperty("Error_Detail")){
                      if(gettedHisListStage["Error_Detail"].length > 0){
                          var his_err_detail = gettedHisListStage["Error_Detail"];
                          for( var x = 0 ; x < his_err_detail.length ; x++){
                              if(his_err_detail[x].value != null){
                                  sum_his_err_detail += parseInt (his_err_detail[x].value);
                              }
                          }
                      }
                  }
                  if(gettedHisListStage.hasOwnProperty("Error_Detail_HMI")){
                      if(!jQuery.isEmptyObject(gettedHisListStage["Error_Detail_HMI"])){
                          var his_err_detail_hmi = gettedHisListStage["Error_Detail_HMI"];
                          for (const property in his_err_detail_hmi) {
                              sum_his_err_detail_hmi += parseInt(his_err_detail_hmi[property]);
                          }
                      }
                  }
                }
            
                
            }
        }

    	sum_err = sum_list_err_detail + sum_list_err_detail_hmi + sum_his_err_detail + sum_his_err_detail_hmi;
    	return sum_err;
  }
  handleMachineHopCach(wo_input,total_machine_error){
     var ratioErr_VT;
     if(wo_input && wo_input !=0){
    	    ratioErr_VT = (parseInt(total_machine_error.toString())/parseInt(wo_input.toString())*100).toFixed(2);
    	}else{
    		ratioErr_VT = 0;
    	}
      var hopCach = 100 - ratioErr_VT;
      return hopCach;
  }

  handleMachineDoTinCay(liststage, hisliststage, listErrInCommon, inputStages , machineName) {

    let detailErrorsGroup = [];
    if (liststage == null || liststage == undefined || liststage.length == 0) {
      detailErrorsGroup = [];
    }else{
      let gettedListStage = liststage.find(stage => stage.stage_name == machineName);
      if(gettedListStage){
        if (gettedListStage.Error_Detail) {
            for (let j = 0; j < gettedListStage.Error_Detail.length; j++) {
              detailErrorsGroup.push({
                err_key: gettedListStage.Error_Detail[j].err_key,
                value: gettedListStage.Error_Detail[j].value
              })
            }
          }
    
        if (gettedListStage.Error_Detail_HMI) {
            for (const property in gettedListStage.Error_Detail_HMI) {
              detailErrorsGroup.push({
                err_key: property,
                value: gettedListStage.Error_Detail_HMI[property]
              })
            }
        }
      }
    }


    if (hisliststage == null || hisliststage == undefined || hisliststage.length == 0) {
      hisliststage = [];
    }else{
      let gettedHisListStage = hisliststage.find(stage => stage.stage_name == machineName);
      if(gettedHisListStage){
        if (gettedHisListStage.Error_Detail) {
            for (let j = 0; j < gettedHisListStage.Error_Detail.length; j++) {
              detailErrorsGroup.push({
                err_key: gettedHisListStage.Error_Detail[j].err_key,
                value: gettedHisListStage.Error_Detail[j].value
              })
            }
          }
    
        if (gettedHisListStage.Error_Detail_HMI) {
            for (const property in gettedHisListStage.Error_Detail_HMI) {
              detailErrorsGroup.push({
                err_key: property,
                value: gettedHisListStage.Error_Detail_HMI[property]
              })
            }
        }
      }

    }

    

    if (detailErrorsGroup) {
      for (let i = 0; i < detailErrorsGroup.length - 1; i++) {
        for (let j = i + 1; j < detailErrorsGroup.length; j++) {
          if (detailErrorsGroup[i].err_key == detailErrorsGroup[j].err_key) {
            detailErrorsGroup[i].value = (parseInt(detailErrorsGroup[i].value) + parseInt(detailErrorsGroup[j].value)).toString();
            detailErrorsGroup.splice(j, 1);
            j = j - 1;
          }
        }
      }
    }

    let totalErrorNC = 0;
    let totalErrorLY = 0;
    for (let i = 0; i < listErrInCommon.length; i++) {
      for (let j = 0; j < detailErrorsGroup.length; j++) {
        if (listErrInCommon[i].key == detailErrorsGroup[j].err_key) {
          if (listErrInCommon[i].value[0].hasOwnProperty("type_error")) {
            if (listErrInCommon[i].value[0].type_error == "Lỗi LY") {
              totalErrorLY = totalErrorLY + parseInt(detailErrorsGroup[j].value);
            } else if (listErrInCommon[i].value[0].type_error == "Lỗi NC") {
              totalErrorNC = totalErrorNC + parseInt(detailErrorsGroup[j].value);
            }
          }
        }
      }
    }
    

    var valueDoTinCay = 0;
    valueDoTinCay = 100 - ((((totalErrorNC * 2) + totalErrorLY) / inputStages) * 100);
    var convertValue = valueDoTinCay.toString() != "NaN" && valueDoTinCay.toString() != "-Infinity" ? valueDoTinCay : "";
    return convertValue;
  }

  handleMachinePPM(sum_err , input , quota) {
    var value: any = 0;
    if (input && input > 0 && quota > 0) {
        var ppm: any = parseFloat((1000000 * parseInt(sum_err) / parseInt(input) / parseFloat(quota)).toString()).toFixed(2);
        value = ppm;
      } else {
        value = 0;
    }
    return value;
  }
  handleMachineOEE(startingTime,stoppingTime,cylceTime,wo_input,wo_output,resultErrTotal){
    cylceTime = cylceTime ? cylceTime : 0;
    var param = Number(startingTime) / Number(wo_input);
    var valuePerformance = parseFloat((cylceTime/param).toString());
    var valueAvaiable = parseFloat((startingTime/(startingTime + stoppingTime)).toString());
    var valueQuanlity = parseFloat(((wo_input - resultErrTotal)/wo_output).toString());
    var OEE = !isNaN(valueAvaiable * valuePerformance * valueQuanlity) ?  (valueAvaiable * valuePerformance * valueQuanlity).toFixed(2) : "0";
    return OEE;
  }
  handleMachineNangSuatThucTinh(wo_output,machineRunningTime){
    var actualProductivity : any = 0;
    if(wo_output != 0 && (machineRunningTime !== 0 && machineRunningTime !== "")){
      actualProductivity = (wo_output / (machineRunningTime / 3600)).toFixed(4);
    }
    return actualProductivity;
  }
  handleMachineCycleTimeTrungBinh(wo_output,machine_running_time){
    var cycleTimeTb : any = 0;
    if(wo_output > 0 && machine_running_time > 0){
      var num = parseFloat(wo_output)/ parseFloat(machine_running_time);
      cycleTimeTb = parseFloat((Math.round(num * 1000000) / 1000000).toString()).toFixed(2);
    }
    return cycleTimeTb;
  }
  handleTotalVattuErr(listStage, hisliststage, machineName , datacommon , machineNumberOfInput){
    let detailErrorsGroup = [];
    if(listStage == null || listStage == undefined || listStage.length == 0){
        detailErrorsGroup = [];
    }else{
      let gettedListStage = listStage.find(stage => stage.stage_name == machineName);
      let itemList = gettedListStage;
      if(itemList){
        if (itemList.Error_Detail) {
            for(let j = 0; j < itemList.Error_Detail.length; j++) {
                if (itemList.Error_Detail[j].value) {
                    detailErrorsGroup.push({
                        err_key: itemList.Error_Detail[j].err_key,
                        value: itemList.Error_Detail[j].value
                    })    
                }
            }
        } else {
            console.log("itemList.Error_Detail null")
        }
        
        if (itemList.Error_Detail_HMI) {
            for(const property in itemList.Error_Detail_HMI) {
                detailErrorsGroup.push({
                    err_key: property,
                    value: itemList.Error_Detail_HMI[property]
                })
            }
        } else {
            console.log("itemList.Error_Detail_HMI null")
        }
      }

    }
    
    if(hisliststage == null || hisliststage == undefined || hisliststage.length == 0){
        hisliststage = [];
    }else{
      let gettedHisListStage = hisliststage.find(stage => stage.stage_name == machineName);
      let itemHis = gettedHisListStage;
      if(itemHis){
        if (itemHis.Error_Detail) {
            for(let j = 0; j < itemHis.Error_Detail.length; j++) {
                if (itemHis.Error_Detail[j].value) {
                    detailErrorsGroup.push({
                        err_key: itemHis.Error_Detail[j].err_key,
                        value: itemHis.Error_Detail[j].value
                    })    
                }
            }
        } else {
            console.log("itemHis.Error_Detail null")
        }
        
        if (itemHis.Error_Detail_HMI) {
            for(const property in itemHis.Error_Detail_HMI) {
                detailErrorsGroup.push({
                    err_key: property,
                    value: itemHis.Error_Detail_HMI[property]
                })
            }
        } else {
            console.log("itemHis.Error_Detail_HMI null")
        }
      }

    }
    
    
    if (detailErrorsGroup) {
        for(let i = 0; i < detailErrorsGroup.length - 1; i++) {
            for(let j = i + 1; j < detailErrorsGroup.length; j++) {
                if(detailErrorsGroup[i].err_key == detailErrorsGroup[j].err_key){
                    detailErrorsGroup[i].value = (parseInt(detailErrorsGroup[i].value) + parseInt(detailErrorsGroup[j].value)).toString();
                    detailErrorsGroup.splice(j,1);
                    j = j - 1;
                }
            }
        }
    }
    let newErrorVatTu = [];
    let totalError = 0;

    for(let i = 0; i < detailErrorsGroup.length; i++) {
        totalError = totalError + parseInt(detailErrorsGroup[i].value);
        
        for(let j = 0; j < datacommon.length; j++) {
            if(detailErrorsGroup[i].err_key == datacommon[j].key && datacommon[j].value[0].hasOwnProperty("is_vatu")) {
                if(datacommon[j].value[0].is_vatu) {
                    newErrorVatTu.push({
                        err_key : detailErrorsGroup[i].err_key,
                        value: detailErrorsGroup[i].value,
                        is_vatu: true
                    });
                    break;
                } else {
                    newErrorVatTu.push({
                        err_key : detailErrorsGroup[i].err_key,
                        value: detailErrorsGroup[i].value,
                        is_vatu: false
                    });
                    break;
                }
            } else if (j == (datacommon.length - 1)){
                newErrorVatTu.push({
                    err_key : detailErrorsGroup[i].err_key,
                    value: detailErrorsGroup[i].value,
                    is_vatu: false
                });
                break;
            }
        }
    }

    let totalErrorVattu = 0;
    for(let i = 0; i < newErrorVatTu.length; i++) {
        if(newErrorVatTu[i].is_vatu) {
            totalErrorVattu = totalErrorVattu + parseInt(newErrorVatTu[i].value);
        }
    }

    var machineMaterialErrRate : any = 0;
    if(totalErrorVattu != 0 && machineNumberOfInput != 0 ){
      machineMaterialErrRate = (parseInt(totalErrorVattu.toString())/parseInt(machineNumberOfInput.toString())*100).toFixed(2)
    } 
    return machineMaterialErrRate;
}
handleListErrorByMachine(listStage,hisliststage,machineName,datacommon){
  let detailErrorsGroup = [];
    if(listStage == null || listStage == undefined || listStage.length == 0){
        detailErrorsGroup = [];
    }else{
      let gettedListStage = listStage.find(stage => stage.stage_name == machineName);
      let itemList = gettedListStage;
      if(itemList){
        if (itemList.Error_Detail) {
            for(let j = 0; j < itemList.Error_Detail.length; j++) {
                if (itemList.Error_Detail[j].value) {
                    detailErrorsGroup.push({
                        err_key: itemList.Error_Detail[j].err_key,
                        value: itemList.Error_Detail[j].value
                    })    
                }
            }
        } else {
            console.log("itemList.Error_Detail null")
        }
        
        if (itemList.Error_Detail_HMI) {
            for(const property in itemList.Error_Detail_HMI) {
                detailErrorsGroup.push({
                    err_key: property,
                    value: itemList.Error_Detail_HMI[property]
                })
            }
        } else {
            console.log("itemList.Error_Detail_HMI null")
        }
      }

    }
    
    if(hisliststage == null || hisliststage == undefined || hisliststage.length == 0){
        hisliststage = [];
    }else{
      let gettedHisListStage = hisliststage.find(stage => stage.stage_name == machineName);
      let itemHis = gettedHisListStage;
      if(itemHis){
        if (itemHis.Error_Detail) {
            for(let j = 0; j < itemHis.Error_Detail.length; j++) {
                if (itemHis.Error_Detail[j].value) {
                    detailErrorsGroup.push({
                        err_key: itemHis.Error_Detail[j].err_key,
                        value: itemHis.Error_Detail[j].value
                    })    
                }
            }
        } else {
            console.log("itemHis.Error_Detail null")
        }
        
        if (itemHis.Error_Detail_HMI) {
            for(const property in itemHis.Error_Detail_HMI) {
                detailErrorsGroup.push({
                    err_key: property,
                    value: itemHis.Error_Detail_HMI[property]
                })
            }
        } else {
            console.log("itemHis.Error_Detail_HMI null")
        }
      }

    }
    
    
    if (detailErrorsGroup) {
        for(let i = 0; i < detailErrorsGroup.length - 1; i++) {
            for(let j = i + 1; j < detailErrorsGroup.length; j++) {
                if(detailErrorsGroup[i].err_key == detailErrorsGroup[j].err_key){
                    detailErrorsGroup[i].value = (parseInt(detailErrorsGroup[i].value) + parseInt(detailErrorsGroup[j].value)).toString();
                    detailErrorsGroup.splice(j,1);
                    j = j - 1;
                }
            }
        }
    }

    for(let i = 0; i < detailErrorsGroup.length; i++) {
        
        for(let j = 0; j < datacommon.length; j++) {
            if(detailErrorsGroup[i].err_key == datacommon[j].key) {
                detailErrorsGroup[i].err_name = datacommon[j].value[0].error_label ? datacommon[j].value[0].error_label : "";
                detailErrorsGroup[i].type_error = datacommon[j].value[0].type_error ? datacommon[j].value[0].type_error : "";
            }
        }
    }
    return detailErrorsGroup;
}
handleListSerialErrorByMachine(listSerialError,datacommon,machineName){
  if(listSerialError == null || listSerialError == undefined || listSerialError.length == 0){
        listSerialError = [];
  }
  var ListSerialErr: any[] = [];
  var ListSeriaErrItem: any = {};
  
  listSerialError.forEach(item => {
    if(item.stage_name == machineName){
      item.list_serial_error.forEach(item2 => {
        item2.Error_Detail.forEach(item3 => {
          ListSeriaErrItem.serial = item2.serial;
          ListSeriaErrItem.err_key = item3.err_key;
          ListSeriaErrItem.value = item3.value;
          ListSerialErr.push(ListSeriaErrItem);
          ListSeriaErrItem = {};
        })
      })
    }
  });
  ListSerialErr.forEach(item => {
    datacommon.forEach(itemDataCommon => {
      if(item.err_key == itemDataCommon.key ){
        item.err_name = itemDataCommon.value[0].error_label ? itemDataCommon.value[0].error_label : "";
        item.type_error = itemDataCommon.value[0].type_error ? itemDataCommon.value[0].type_error : "";
      }
    })
  });
  return ListSerialErr;
}
exportToExcel(arr: any[], sheetName, fileName , arrMachineErrorDetail,arrListSerialErr,arrListSerial) {
    let Heading = [["Mã Planning WO",	"Tên WO-LOT",	"Mã đơn hàng",	"Mã máy",	"Tên máy",	"Mô tả",	"Trạng thái",	"SAP WO",	"LotNumber",	
    "Mã hàng hóa",	"Tên hàng hóa",	"Số lượng kế hoạch",	"Sản lượng đầu vào",	"Sản lượng hoàn thành",	"Sản lượng ca 1",	
    "Sản lượng ca 2",	"Thời gian chạy",	"Thời gian dừng",	"Ngày tiếp nhận",	"Loại máy",	"Nhóm máy",	"Hợp cách",	"Độ tin cậy",
    "PPM Machine",	"OEE Machine",	"Tổng lỗi",	"Machine_CycleTime trung bình",	"Machine_Năng suất thực tính","Tỉ lệ lỗi vật tư"]];
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);

  
    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, arr, {
      header: ['planning_code', 'wo_lot', 'po_id', 'asset_name', 'asset_label', 'Machine_Description', 'TrangThai', 'sap_wo', 'lot_number',
        'product_code', 'product_name', 'number_of_planning', 'wo_number_of_input', 'wo_number_of_output', 'San_Luong_Ca_1', 'San_Luong_Ca_2',
        'Time_Machine_Running', 'Time_Machine_Stop', 'Time_Created', 'machine_type', 'machine_group', 'Hop_Cach', 'Do_Tin_Cay', 'PPM', 'OEE', 'Total_Error_Machine',
        'Cycle_Time_TrungBinh','Nang_Suat_Thuc_Tinh','Ti_Le_Loi_Vat_Tu'],
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    

    let HeadingMachineErrorDetail = [["Mã Planning WO",	"Tên WO-LOT",	"Mã đơn hàng",	"Mã máy",	"Tên máy",	"Mô tả", "Trạng thái",	"SAP WO",
    "LotNumber", "Mã hàng hóa",	"Tên hàng hóa",	"StageMachine",	"ErrorCode",	"ErrorName",	"Number Of Error",	"Type NC/LY"]];
    const wsStageDetail: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(wsStageDetail, HeadingMachineErrorDetail);
    XLSX.utils.sheet_add_json(wsStageDetail, arrMachineErrorDetail, {
      header: ['planning_code', 'wo_lot', 'po_id', 'asset_name', 'asset_label', 'Machine_Description', 'TrangThai', 'sap_wo',
        'lot_number', 'product_code', 'product_name', 'StageMachine', 'err_key', 'err_name', 'value','type_error'],
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, wsStageDetail, "ErrorMachineinfor");


    let HeadingListSerialErr = [["Mã Planning WO",	"Tên WO-LOT",	"Mã đơn hàng",	"Mã máy",	"Tên máy",	"Mô tả", "Trạng thái",	"SAP WO",
    "LotNumber", "Mã hàng hóa",	"Tên hàng hóa",	"StageMachine", "SerialBoard", "Serial",	"ErrorCode",	"ErrorName",	"Number Of Error",	"Type NC/LY"]];

    const wsListErrStage: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(wsListErrStage, HeadingListSerialErr);
    XLSX.utils.sheet_add_json(wsListErrStage, arrListSerialErr, {
      header: ['planning_code', 'wo_lot', 'po_id', 'asset_name', 'asset_label', 'Machine_Description', 'TrangThai', 'sap_wo',
        'lot_number', 'product_code', 'product_name', 'StageMachine','serialBoard' , 'serial', 'err_key', 'err_name', 'value','type_error'],
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, wsListErrStage, "SerialError");

    let HeadingListSerial = [['Mã Planning WO', 'Tên WO-LOT', 'Mã đơn hàng', 'SAP WO', 'LotNumber', 'StageMachine', 'Serial board', 'Serial_Pcs', 'Time']];
    const wsListSerial: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(wsListSerial, HeadingListSerial);
    XLSX.utils.sheet_add_json(wsListSerial, arrListSerial, {
      header: ['planning_code', 'wo_lot', 'po_id', 'sap_wo', 'lot_number', 'StageMachine', 'serialBoard', 'serial', 'lastUpdateTs'],
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, wsListSerial, "ListSerial");

    XLSX.writeFile(wb, `${fileName}.xlsx`);
    this.ctx.showSuccessToast("Xuất excel thành công", 2000, "top", "left");
    // this.handleLoading(false);
    this.loadingEl.nativeElement.classList.remove("spinner");
    this.loadingEl.nativeElement.classList.add("hide");
  }
  // ---------------End Handle Export Excel ------------------
  // ------------- Code End ------------------

}


class EntityDatasource implements DataSource<EntityData> {

  private entitiesSubject = new BehaviorSubject<EntityData[]>([]);
  private pageDataSubject = new BehaviorSubject<PageData<EntityData>>(emptyPageData<EntityData>());

  private currentEntity: EntityData = null;

  public dataLoading = true;

  private appliedPageLink: EntityDataPageLink;
  private appliedSortOrderLabel: string;

  constructor(
    private translate: TranslateService,
    private dataKeys: Array<DataKey>,
    private subscription: IWidgetSubscription,
    private ngZone: NgZone
  ) {
  }

  connect(collectionViewer: CollectionViewer): Observable<EntityData[] | ReadonlyArray<EntityData>> {
    return this.entitiesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.entitiesSubject.complete();
    this.pageDataSubject.complete();
  }

  loadEntities(pageLink: EntityDataPageLink, sortOrderLabel: string, keyFilters: KeyFilter[]) {
    this.dataLoading = true;
    // this.clear();
    this.appliedPageLink = pageLink;
    this.appliedSortOrderLabel = sortOrderLabel;
    this.subscription.subscribeForPaginatedData(0, pageLink, keyFilters);
  }


  dataUpdated() {
    const datasourcesPageData = this.subscription.datasourcePages[0];
    const dataPageData = this.subscription.dataPages[0];
    let entities = new Array<EntityData>();
    datasourcesPageData.data.forEach((datasource, index) => {
      entities.push(this.datasourceToEntityData(datasource, dataPageData.data[index]));
    });
    if (this.appliedSortOrderLabel && this.appliedSortOrderLabel.length) {
      const asc = this.appliedPageLink.sortOrder.direction === Direction.ASC;
      entities = entities.sort((a, b) => sortItems(a, b, this.appliedSortOrderLabel, asc));
    }
    const entitiesPageData: PageData<EntityData> = {
      data: entities,
      totalPages: datasourcesPageData.totalPages,
      totalElements: datasourcesPageData.totalElements,
      hasNext: datasourcesPageData.hasNext
    };
    this.ngZone.run(() => {
      this.entitiesSubject.next(entities);
      this.pageDataSubject.next(entitiesPageData);
      this.dataLoading = false;
    });
  }

  private datasourceToEntityData(datasource: Datasource, data: DatasourceData[]): EntityData {
    const entity: EntityData = {
      id: {} as EntityId,
      entityName: datasource.entityName,
      entityLabel: datasource.entityLabel ? datasource.entityLabel : datasource.entityName
    };
    if (datasource.entityId) {
      entity.id.id = datasource.entityId;
    }
    if (datasource.entityType) {
      entity.id.entityType = datasource.entityType;
      entity.entityType = this.translate.instant(entityTypeTranslations.get(datasource.entityType).type);
    } else {
      entity.entityType = '';
    }
    this.dataKeys.forEach((dataKey, index) => {
      const keyData = data[index].data;
      if (keyData && keyData.length && keyData[0].length > 1) {
        if (data[index].dataKey.type !== DataKeyType.entityField || !entity.hasOwnProperty(dataKey.label)) {
          entity[dataKey.label] = keyData[0][1];
        }
      } else {
        entity[dataKey.label] = '';
      }
    });
    return entity;
  }

  isEmpty(): Observable<boolean> {
    return this.entitiesSubject.pipe(
      map((entities) => !entities.length)
    );
  }

  total(): Observable<number> {
    return this.pageDataSubject.pipe(
      map((pageData) => pageData.totalElements)
    );
  }

  public toggleCurrentEntity(entity: EntityData): boolean {
    if (this.currentEntity !== entity) {
      this.currentEntity = entity;
      return true;
    } else {
      return false;
    }
  }

  public isCurrentEntity(entity: EntityData): boolean {
    return (this.currentEntity && entity && this.currentEntity.id && entity.id) &&
      (this.currentEntity.id.id === entity.id.id);
  }
}
