(function(){
        var app = angular.module('app');
        
        app.directive('superCubeView', ['$log','$rootScope','$tm1Ui', '$timeout', '$document','filterFilter', '$window','$anchorScroll','$location','$ngBootbox',  function($log, $rootScope, $tm1Ui, $timeout , $window, $document,  filterFilter, $anchorScroll,  $location, $ngBootbox ) {
            return {
                templateUrl: 'html/SuperCubeView.html',
                scope:{
                    panelHeading:'@',
                    tm1Instance: '@',  
                    cubeName:'@',
                    cubeView:'@',
                    cubeMdx:'@',
                    attributeOptions:'@',
                    tableWidth:'@',
                    tablePosition:'@',
                    tableLeft:'@',
                    tableTop:'@',
                    tableHeight:'@',
                    chartHeight:'@',
                    tableId:'@',
                    tableHeightBottomOffset:'@',
                    tableDimensionColumnClass:'@',
                    tableDataColumnClass:'@',
                    tableId:"@",
                    rowsToLoad:'@',
                    chartVisible:'@',
                    tableHide:'@',
                    customPage:'@',
                    cubeMdxParams:'@',
                    hideChartAsOption:'@',
                    hideTableUploadAsOption:'@',
                    hideMdxCustomAsOption:'@',
                    hideTableAsOption:'@',
                    useDefaultParameters:'@',
                    uiProcessName:'@',
                    useGrid:'@'
                }, 
                link:function(scope, $elements, $attributes, directiveCtrl, transclude){
                        scope.defaults = {  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
                        monthkey: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
                    };
                  
                   
                scope.lists = {
                  records:[]
                }
                scope.mouseOverCellUploadedFromExcel = [];
                scope.panelHeading = $attributes.panelHeading;
                scope.hideCol = $location.search()['hideCol'];
                scope.hideColumn = [];
                scope.selections = {
                  searchRows: []
                };
                  scope.data = [];
                scope.workbookUploadedSheetsData = [];
                scope.workbookUploadedSheetsColumnData = [];
                scope.sheetsUploaded = [];
                scope.hideTableUploadAsOption = $attributes.hideTableUploadAsOption;
                scope.hideMdxCustomAsOption = $attributes.hideMdxCustomAsOption;
                scope.lists.records = {};
                scope.selectedColumnForPieChart = 0;
                scope.finalRowCellArrayToCapture = [];
                scope.sent = 0;
                scope.firstDayPosition = {};
                scope.tm1Instance = $attributes.tm1Instance;
                scope.myCellData = []; 
                $rootScope.overCol = []; 
                scope.mdxId = [];
                scope.attributeOptions = $attributes.attributeOptions;
                scope.tableWidth = $attributes.tableWidth; 
                scope.innerWidth = window.innerWidth;
                scope.tablePosition = $attributes.tablePosition;
                scope.tableLeft = $attributes.tableLeft;
                scope.tableTop = $attributes.tableTop;
                scope.tableHeight = $attributes.tableHeight;
                scope.chartHeight = $attributes.chartHeight;
                scope.tableId = $attributes.tableId;
                scope.rowsToLoad =  $attributes.rowsToLoad;
                scope.tableDimensionColumnClass = $attributes.tableDimensionColumnClass;
                scope.tableDataColumnClass = $attributes.tableDataColumnClass;
                scope.customPages = [];
                scope.customPages[$attributes.tableId] = $attributes.customPage;
                scope.hideChartAsOption = $attributes.hideChartAsOption;
                scope.hideTableAsOption = $attributes.hideTableAsOption;
                scope.mouseOverChart= [];
                scope.tableUrlValue = $location.search()['tableHide'];
                scope.chartUrlValue = $location.search()['chartView'];
                scope.cubeNameUrlValue = decodeURI($location.search()['cubeName']);
                scope.cubeViewUrlValue = decodeURI($location.search()['cubeView']);
                scope.suppressZerosUrlValue = decodeURI($location.search()['suppressZeros'+scope.tableId]);
                scope.mdxIdUrlValue = decodeURI($location.search()['mdxId']); 
                scope.useGrid = $attributes.useGrid;
                scope.consolidatedColumnsElementNames = [];
               
                scope.selectedCellArray = [];
                scope.finalarrayRowSelected = [];
                scope.arrayCellsSelected = [];
                
                scope.arrayRowSelected = [];
                if($attributes.uiProcessName && $attributes.uiProcessName != '' && $attributes.uiProcessName != null && $attributes.uiProcessName != 'undefined'  ){
                  scope.uiProcessName = $attributes.uiProcessName;
                }

                if(scope.hideCol != null && scope.hideCol != 'undefined'){
                  if( (scope.hideCol+'').split('-').length > 0){
                    scope.hideColumn[scope.tableId] = [];
                    //console.log((scope.hideCol+'').split('-')[0], "#####");
                    for(var urlcount = 0; urlcount < (scope.hideCol+'').split('-')[0];urlcount++){
                      
                      scope.hideColumn[scope.tableId][urlcount] = true;
                    }
                    //  if((scope.hideCol+'').split('-')[1] === 'true'){
                    //   scope.hideColumn[scope.tableId][(scope.hideCol+'').split('-')[0]] = true;
                    // }else{
                    //   scope.hideColumn[scope.tableId][(scope.hideCol+'').split('-')[0]] = false;
                    // }
                  
                  } 
                }else{
                  scope.hideColumn[scope.tableId] = [];
                } 

                if($attributes.cubeMdxParams != null && $attributes.cubeMdxParams != 'undefined' ){
                  scope.cubeMdxParams = JSON.parse($attributes.cubeMdxParams);
                }else{

                } 

                if(scope.cubeNameUrlValue != null && scope.cubeNameUrlValue != 'undefined' &&  !$attributes.useDefaultParameters){
                //console.log(scope.cubeNameUrlValue, "URL VALUES TRACKED" )
                  scope.cubeName = scope.cubeNameUrlValue ;  
                } else{
                  scope.cubeName = $attributes.cubeName;
                }
                

                 
                if(scope.mdxIdUrlValue != null && scope.mdxIdUrlValue != 'undefined'   &&  !$attributes.useDefaultParameters  || $attributes.useDefaultParameters === false ){
            //console.log(scope.cubeNameUrlValue, "URL VALUES TRACKED" )
                  scope.mdxId[scope.tableId] = scope.mdxIdUrlValue; 
                    
                }else{
                  scope.mdxId[scope.tableId] =  $attributes.cubeMdx;
                }
                
               

                if(scope.cubeViewUrlValue != null && scope.cubeViewUrlValue != 'undefined'  &&  !$attributes.useDefaultParameters){
                  //console.log(scope.cubeViewUrlValue, "URL VALUES TRACKED" )
                  scope.cubeView = scope.cubeViewUrlValue ; 
                  
                  
                } else{
                  scope.cubeView = $attributes.cubeView;
                }

                if(scope.chartUrlValue != null && scope.chartUrlValue != 'undefined' ){
                    //console.log(scope.cubeNameUrlValue, "URL VALUES TRACKED" )
                    if(scope.chartUrlValue === 'true' ){
                      
                      scope.chartVisible = true; 
                    }else{
                      scope.chartVisible = false ; 
                    }
                      
                      
                      
                } else{
                  scope.chartVisible = false ; 
                }
                    
                if(scope.tableUrlValue === 'true'){
                    
                
                    //console.log(scope.tableUrlValue, "scope.tableUrlValuescope.tableUrlValuescope.tableUrlValue")
                    if(scope.hideTableAsOption === 'true'){
                      scope.tableHide = true ; 
                    }else{
                      scope.tableHide = false ; 
                    }
                    
                    
                    
                    
                  } else{
                    if(scope.hideTableAsOption === 'true'){
                      scope.tableHide = true ; 
                    }else{
                      scope.tableHide = false ; 
                    }
                    
                  }
  
                  scope.dataWidth = 70;
                 //$rootScope.cubeName = scope.cubeName;
                 //$rootScope.cubeView = scope.cubeView;
                
                  
                
                 
                scope.dateNow = new Date() ;
                 
                scope.collapseDimensions = true;
                scope.innerHeight = window.innerHeight;
                var n = scope.dateNow.getMonth();
                var p = scope.dateNow.getDay();
                var y = scope.dateNow.getFullYear();
                scope.monthNow = n;
                scope.dayNow = p;
                scope.yearNow =  y; 
                scope.dateNumber =((scope.dateNow+"").split(":")[0]).split(' ')[2];
                //scope.date  = (((scope.dateNow+"").split(":")[0]).split(',').join('')).split(' ').join('');
                
                scope.datasetNew = [];
                scope.dataset = []; 
                scope.tableNew = [];
                scope.table = [];
                scope.tables = [];
                scope.optionsNew = [];
                scope.options = [];
                scope.cellRef = {};

                scope.activeName = 'lineChart';
                scope.chartName = 'Line'
        var chart;
        
        scope.chartToolTipElements = [];
        var formatComma = d3.format(","),
            formatDecimal = d3.format(".1f"), 
            formatDecimalComma = d3.format(",.2f"),
            formatSuffix = d3.format("s"),
            formatSuffixDecimal1 = d3.format(".1s"),
            formatSuffixDecimal2 = d3.format(".2s"),
            formatMoney = function(d) { return "$" + formatDecimalComma(d); },
            formatPercent = d3.format(",.2%");
          var curveArray = [
              {"d3Curve":d3.curveLinear,"curveTitle":"curveLinear"},
              {"d3Curve":d3.curveStep,"curveTitle":"curveStep"},
              {"d3Curve":d3.curveStepBefore,"curveTitle":"curveStepBefore"},
              {"d3Curve":d3.curveStepAfter,"curveTitle":"curveStepAfter"},
              {"d3Curve":d3.curveBasis,"curveTitle":"curveBasis"},
              {"d3Curve":d3.curveCardinal,"curveTitle":"curveCardinal"},
              {"d3Curve":d3.curveMonotoneX,"curveTitle":"curveMonotoneX"},
              {"d3Curve":d3.curveCatmullRom,"curveTitle":"curveCatmullRom"}
          ];
        $rootScope.lineType = "monotone";
        scope.options = {
            "chart": {
              "type":  scope.activeName,
              "height": (scope.chartHeight),
              "margin": {
                "top": 20,
                "right": 0,
                "bottom": 5,
                "left": 0
              }, 
              "width":null,
              "valueFormat":  function(d){  return  formatComma(d); },
              "useInteractiveGuideline": $rootScope.interactiveLayer, 
              "dispatch": { 
                "elementClick": function(d){ console.log(d, "elementClicked")},
                 
              },
              "xAxis": {
                "axisLabel": "",
                "dispatch": {
                  
                },
                "axisLabelDistance": 0,
                "staggerLabels": false,
                "rotateLabels": 0,
                "rotateYLabel": true,
                "showMaxMin": false,
                "height": 0,
                "ticks": null,
                "width": 75,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 0,
                "orient": "bottom",
                "tickValues": null,
                "tickSubdivide": 0,
                "tickSize": 6,
                "tickPadding": 7,
                "domain": [
                  0,
                  1
                ],
                "range": [
                  0,
                  1
                ]
              },
              "yAxis": {
                "axisLabel": "",
                "axisLabelDistance": -10,
                "dispatch": {},
                "staggerLabels": false,
                "rotateLabels": 0,
                "rotateYLabel": true,
                "showMaxMin": true,
                "height": 60,
                "ticks": null,
                "width": 75,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 250,
                "orient": "left",
                "tickValues": null,
                "tickSubdivide": 0,
                "tickSize": 6,
                "tickPadding": 3,
                "domain": [
                  0,
                  1
                ],
                "range": [
                  0,
                  1
                ]
              },
              "x2Axis": {
                "dispatch": {},
                "axisLabelDistance": 0,
                "staggerLabels": false,
                "rotateLabels": 0,
                "rotateYLabel": true,
                "showMaxMin": true,
                "axisLabel": null,
                "height": 60,
                "ticks": null,
                "width": 75,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 0,
                "orient": "bottom",
                "tickValues": null,
                "tickSubdivide": 0,
                "tickSize": 6,
                "tickPadding": 5,
                "domain": [
                  0,
                  1
                ],
                "range": [
                  0,
                  1
                ]
              },
              "y2Axis": {
                "dispatch": {},
                "axisLabelDistance": 0,
                "staggerLabels": false,
                "rotateLabels": 0,
                "rotateYLabel": true,
                "showMaxMin": true,
                "axisLabel": null,
                "height": 60,
                "ticks": null,
                "width": 75,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 250,
                "orient": "left",
                "tickValues": null,
                "tickSubdivide": 0,
                "tickSize": 6,
                "tickPadding": 3,
                "domain": [
                  0,
                  1
                ],
                "range": [
                  0,
                  1
                ]
              },
              "lines": {
                "dispatch": { 
                 
                    elementClick: function(e){     listenTotheChart(e);  if(!scope.options.chart.useInteractiveGuideline && e != 'undefined' && e != null ){scope.chartToolTipElements = {"0":e};   scope.selections.searchRows[scope.table] = (e['series']['key']+'').split(' :- ')[0];  window.dispatchEvent(new Event('resize'));}else{scope.chartToolTipElements = e; scope.selections.searchRows[scope.tableId] = '';  window.dispatchEvent(new Event('resize'));}   },
                    elementMouseover: function(e){  if(e){  $timeout(function(){   if(scope.hideCol){ var hiddenTotal = scope.gatherColumnsHiden(); var useNumber =    e['pointIndex'] + (hiddenTotal);  }else{var useNumber =    e['pointIndex'] ;}   ; $rootScope.overCol[scope.tableId] = useNumber; return e; });  } },
                    elementMouseout: function(e){ if(e){ $timeout(function(){$rootScope.overCol[scope.tableId] =-1; return e; }) } },
                    renderEnd: function(e){      }
                 
                },
                "width": null,
                "height": null,
                "xDomain": null,
                "yDomain": null,
                "pointDomain": [
                  16,
                  256
                ],
                "xRange": null,
                "yRange": null,
                "pointRange": null,
                "forceX": [],
                "forceY": [],
                "forcePoint": [],
                "interactive": true,
                "padDataOuter": 0.1,
                "padData": true,
                "clipEdge": true,
                "clipVoronoi": false,
                "showVoronoi": false,
                 
                "interactiveUpdateDelay": 300,
                "showLabels": true,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 0,
                "useVoronoi": true,
                "interpolate": $rootScope.lineType
              },
              "lines2": {
                "dispatch": {  
                  elementClick: function(e){   },
                  
                  renderEnd: function(e){   }
               
              }, 
                 
                "width": null,
                "height": null,
                "xDomain": null,
                "yDomain": null,
                "pointDomain": [
                  16,
                  256
                ],
                "xRange": null,
                "yRange": null,
                "pointRange": null,
                "forceX": [],
                "forceY": [],
                "forcePoint": [],
                "interactive": false,
                "padDataOuter": 0.1,
                "padData": true,
                "clipEdge": false,
                "clipVoronoi": true,
                "showVoronoi": false,
          
                "interactiveUpdateDelay": 0,
                "showLabels": false,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 250,
                "useVoronoi": true,
                "interpolate": $rootScope.lineType
              }, 
              "legend": {
                dispatch: {
                  legendClick: function(e) { scope.selections.searchRows[scope.tableId] = '';  window.dispatchEvent(new Event('resize'));  },
                  legendDblclick: function(e) {  scope.selections.searchRows[scope.tableId] = (e.key+'').split(' :- ')[0];  window.dispatchEvent(new Event('resize')); },
                  legendMouseover: function(e) {  },
                  legendMouseout: function(e) { },
                  stateChange: function(e) { }
                  
                },
                "width": 400,
                "height": 20,
                "align": true,
                "maxKeyLength": 20,
                "rightAlign": false,
                "padding": 32,
                "updateState": true,
                "radioButtonMode": false,
                "expanded": false,
                "vers": "classic",
                "margin": {
                  "top": 5,
                  "right": 0,
                  "bottom": 5,
                  "left": 0
                }
              }, 
              "interactiveLayer": {
                "dispatch": {
                
 
                  elementMousemove: function(d){  $timeout(function(){     var useNumber =  Math.round(d['pointXValue']);  $rootScope.overCol[scope.tableId] = useNumber; return d;  }) }
                  
                },
                "tooltip": {
                  "duration": 100,
                  "gravity": "w",
                  "distance": 50,
                  "snapDistance": 0,
                  "classes": null,
                  "chartContainer": 'chartRow'+scope.tableId, 
                  "enabled": true,
                  "hideDelay": 0, 
                  "valueFormatter": function(d,i){   return  formatComma(d)},
                  "headerFormatter": function(d){  if(scope.chartName === 'Pie' ){return d;}else{return scope.formatToHeaderName(d);}  },
                  "headerEnabled": true,
                  "fixedTop": null, 
                  "hidden": false,
                  "data": null,
                  "id": null
                },
                "margin": {
                  "left": 0,
                  "top": 0
                },
                "width": null,
                "height": null,
                "showGuideLine": true,
                "svgContainer": 'chart'+scope.tableId
              },
              "multibar": {
                "dispatch": {},
                "width": 960,
                "height": 500,
                "forceY": [
                  0
                ],
                "stacked": false,
                "stackOffset": "zero",
                "clipEdge": true,
                "id": 2362,
                "hideable": false,
                "groupSpacing": 0.1, 
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "duration": 500,
                "barColor": null
              },
              "pie": {
                "dispatch": {},
                "arcsRadius": [],
                "width": 500,
                "height": 500,
                "showLabels": true,
                "title": false,
                "titleOffset": 0,
                "labelThreshold": 0.02,
                "id": 9266,
                "endAngle": false,
                "startAngle": false,
                "padAngle": false,
                "cornerRadius": 0,
                "donutRatio": 0.3,
                
                "labelsOutside": false,
                "labelSunbeamLayout": false,
                "donut": true,
                "growOnHover": true,
                "pieLabelsOutside": false,
                "donutLabelsOutside": false,
                "margin": {
                  "top": 0,
                  "right": 0,
                  "bottom": 0,
                  "left": 0
                },
                "labelType": "key"
              },
              "tooltip": {
                "duration": 100,
                  "gravity": "w",
                  "distance": 50,
                  "snapDistance": 10,
                  "classes": null,
                  "chartContainer": null, 
                  "enabled": true,
                  "hideDelay": 50, 
                  "valueFormatter": function(d,i){   return  formatComma(d)},
                  "headerFormatter": function(d){  if(scope.chartName === 'Pie' ){return d;}else{return scope.formatToHeaderName(d);}  },
                  "margin": {
                    "left": 0,
                    "top": 0
                  },
                  "headerEnabled": true,
                  "fixedTop": null, 
                  "hidden": false,
                  "data": null,
                  "id": null
              },
              "width": null,
              "interpolate": $rootScope.lineType,
              "clipEdge": true,
              "duration": 0,
              "clipVoronoi": true,
              "forcePoint": [],
              "forceX": [],
              "forceY": [],
              "interactive": true,
              "interactiveUpdateDelay": 300,
              "padData": true,
              "padDataOuter": 0.1,
              "pointDomain": [
                16,
                256
              ],
              "pointRange": null,
              "showLabels": false,
              "showVoronoi": false,
              "useVoronoi": true,
              "xDomain": null,
              "xRange": null,
              "yDomain": null,
              "yRange": null,
              "showLegend": false,
              "legendPosition": "top",
              "showXAxis": false,
              "showYAxis": true,
              "focusEnable": false,
              "focusShowAxisX": false,
              "focusShowAxisY": false,
              "brushExtent": null,
              "defaultState": null,
              "noData": null,
              "focusMargin": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "rightAlignYAxis": false, 
            }, 
            "title": {
              "enable": false,
              "text": "Title for Line Chart",
              "className": "h4",
              "css": {
                "width": "nullpx",
                "textAlign": "center"
              }
            },
            "subtitle": {
              "enable": false,
              "text": "Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.",
              "css": {
                "width": "nullpx",
                "textAlign": "center",
                "text-align": "center",
                "margin": "10px 13px 0px 7px"
              }
            },
            "caption": {
              "enable": false,
              "text": "Figure 1. Write Your Caption text.",
              "css": {
                "width": "nullpx",
                "textAlign": "center",
                "text-align": "justify",
                "margin": "10px 13px 0px 7px"
              },
              "html": "<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style=\"text-decoration: underline;\">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style=\"color: darkred;\">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href=\"https://github.com/krispo/angular-nvd3\" target=\"_blank\">2</a>, 3]</sup>."
            },
            "styles": {
              "classes": {
                "with-3d-shadow": true,
                "with-transitions": true,
                "gallery": false
              },
              "css": {}
            }
          }
          scope.data = [];
          scope.charRowCount = 0;
          scope.consolidatedRowsOnly = false;
          scope.randomColor = [];
          
        scope.config = {
            visible: true, // default: true
            extended: false, // default: false
            disabled: false, // default: false
            refreshDataOnly: false, // default: true
            deepWatchOptions: false, // default: true
            deepWatchData: false, // default: true
            deepWatchDataDepth: false, // default: 2
            debounce: 10 // default: 10
        };
        function listenTotheChart(element){ 
    //console.log(element, "line dispatch");
          if(element['point'] && element && element['point']['key'] != 'undefined'){
             
            scope.selections.searchRows[scope.tableId] = (element['point']['key']+'').split(' :- ')[0];
          }
           
          
       
        }

        if(scope.suppressZerosUrlValue != null && scope.suppressZerosUrlValue != 'undefined'  ){
    //console.log(scope.suppressZerosUrlValue); 
          if(scope.suppressZerosUrlValue === 'true'){
            scope.options.suppressZeros = true;
          }else{
            scope.options.suppressZeros = false;
          }
          
        }else{
    //console.log("no url suppress zeros so default to false"); 
          scope.options.suppressZeros = false;
          
        }
        scope.runTi = function(tiName){
          $tm1Ui.processExecute(scope.tm1Instance, tiName).then(function(result){
            if(result.success){
              
              scope.refresh(scope.cubeName, scope.cubeView);
            }else{
              alert("Ti Failed:" + result.message);
            }
          }
          )
        }
       
        scope.gotoTop = function(){
            scope.tableHide = !scope.tableHide;
            if(scope.tableHide != null && scope.tableHide != 'undefned' && !scope.tableHide){
              $location.search('tableHide', 'true') 
            }else{
              $location.search('tableHide', 'false') 
            } 
            if(scope.chartVisible != null && scope.tableHide != 'undefined' && !scope.tableHide){
              $location.search('chartView', 'true');

            }else{
              $location.search('chartView', 'false') 
            }
             
          }
         
          scope.callback = function(scope, element){
            // this code will be applied once directive has been created
            // scope - is the directive internal scope
            // element - directive DOM element
            scope.api = scope.api;
            scope.chart = scope.chart;
            scope.svg = scope.svg;
           
             

            // ... do smth
        };
        scope.getFormatColVal = function(val, index){
          //console.log(scope.data[index],val,index);
          return val;
        } 
     
        scope.doResizeChart = function(bool){
           
             $rootScope.chartLoading = true;
             $timeout(
               function(){
                 scope.options.chart.width= document.getElementById('af1'+scope.tableId).getBoundingClientRect().width;
                 $rootScope.chartLoading = false;
                 scope.dispatchResize();
               },1600
             )
              
           
           
        }
  
         
            scope.changeUrl = function(hideCol, index ){
              $location.search('hideCol', index+'-'+hideCol);
            }
            $rootScope.allCollapsed = false;
            scope.collapseAll = function(decider){
              if(decider){
               scope.dataset.collapseAll();
              }else{
                scope.dataset.expandAll();
              }
             
              scope.table.refresh();
             
              $timeout(
                function(){
                  if(scope.api){
                   scope.dispatchResize();
                  }
                },1000
              )
               
            }
          
            scope.READ = function(workbook) {
               
                      
              $tm1Ui.cubeDimensions(scope.tm1Instance, scope.cubeName).then(function(result){
                if(result){
                   
                  scope.sheetsUploaded = [];
              scope.workbookUploadedSheetsData = [];
              scope.workbookUploadedSheetsColumnData = [];
              var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
              var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
               if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {  
                xlsxflag = true;  
               } 
              var reader = new FileReader();  
              reader.onload = function (e) {  
                var data = e.target.result;  
                if (xlsxflag) {  
                  var workbook = XLSX.read(data, { type: 'binary' });  
                }  
                else {  
                  var workbook = XLS.read(data, { type: 'binary' });  
                }    
                 
                var sheet_name_list = workbook.SheetNames;
               
                sheet_name_list.forEach(function(y) {
                
               
                  if (xlsxflag) {  
                    var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
                  }  
                  else {  
                    var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
                  }   
                  if (exceljson.length > 0) {  
                    for (var i = 0; i < exceljson.length; i++) {  
                   //   console.log("push data to use",i, exceljson[i], exceljson)
                      scope.workbookUploadedSheetsData.push(exceljson[i]);  
                      scope.$apply();  
                    }  
                  } 
                  
                  
                  scope.tableRowDimensions = scope.table.data()[0].elements[0]['dataset']['dimensions']['rows'];
                  scope.tableColumnDimensions = scope.table.data()[0].elements[0]['dataset']['dimensions']['columns'];
                  
                  
                     
                     
                   // console.log(scope.table.data()[0].cells[0].reference(), scope.cubeName, scope.workbookUploadedSheetsData, scope.workbookUploadedSheetsColumnData, "ROW AND COLUMNS excel DATA" );
                 
                   _.forEach(scope.workbookUploadedSheetsData, function(vvv, kkk) {
                     var colCount = -1;
                     scope.finalRowCellArrayToCapture[kkk] = [];
                     
                    if(kkk >= scope.tableColumnDimensions.length-1){

                     //console.log( kkk,  "kkk");
                     if( ((scope.tableRowDimensions).toString() ).indexOf(kkk) === -1  && ((scope.tableColumnDimensions).toString() ).indexOf(kkk) === -1 ){
                       var currentRow = kkk-(scope.tableColumnDimensions.length-1);
                      _.forEach(vvv, function(vv, kk) {
                          
                             
                           if( ((scope.tableRowDimensions).toString()).indexOf(kk) === -1){
                              
                                  if( ((scope.tableColumnDimensions).toString()).indexOf(kk) === -1){
                             
                               // console.log('####', ((scope.tableColumnDimensions).toString()).indexOf(kk), kk,"  Col", "ROW # : ",kkk, vv)
                              
                                if(scope.table.data()[currentRow] != undefined && scope.table.data()[currentRow] != null ){
                                 
                                  colCount++;
                                   if(scope.table.data()[currentRow].cells[colCount] != undefined && !scope.table.data()[currentRow]['cells'][colCount].isReadOnly){
                                     var ref = scope.table.data()[currentRow].cells[colCount].reference();
                                    // console.log(vv, currentRow, ref, "currentRow");
                                     //console.log('ref', ref, vv, kkk, "$$$")
                                    if( !vv  || vv === '-' || vv === '' || vv == 0 ){

                                    }else{
                                      scope.createRequest = true;
                                      for(var tyt = 0; tyt < scope.consolidatedColumnsElementNames.length;tyt++ ){
                                         if( ((ref).toString()).indexOf(scope.consolidatedColumnsElementNames[tyt]) > -1){
                                         scope.createRequest = false;
                                         //  console.log("DONT SEND THE REQUEST FOR THE COLUMN",scope.consolidatedColumnsElementNames[tyt], ((refer).toString()).indexOf(scope.consolidatedColumnsElementNames[tyt]) )
                                         }else{
                                           
                                         }
                                      }
                                      
                                      if(scope.createRequest === true && (((vv+'').split('(').join('-')).split(')').join('')).split(',').join('') !=  scope.table.data()[currentRow].cells[colCount].value ){
                                        console.log(scope.table.data()[currentRow].cells[colCount].value, "@@@@");
                                        scope.table.data()[currentRow].cells[colCount].cellUpdate = true;
                                        scope.table.data()[currentRow].cells[colCount].cellUpdateVal = ((vv+'').split('(').join('-')).split(')').join('');
                                        scope.table.data()[currentRow].rowToUpdate = true;
                                        console.log(currentRow, colCount, "saving value into the cube", ((vv+'').split('(').join('-')).split(')').join(''))
                                        scope.sendValueToCube(ref, ((vv+'').split('(').join('-')).split(')').join(''), currentRow, colCount);
                                        scope.sent++;
                                           
                                           
                                       }
                                      }
                                     
                                  
                                   }
                                   
                                }
                              }
                                 
                            }
                               // console.log(scope.table.data()[kkk].cells[colCount].reference(), scope.rowElementArrayToCapture[kkk]['Account'], scope.rowElementArrayToCapture[kkk]['Value'], scope.rowElementArrayToCapture[kkk][scope.tableColumnDimensions[coldimension]], "column"); 
                             
                               
                             
                         
                      
                         
                       
                      });
                     }
                    }
                     // console.log( scope.finalRowCellArrayToCapture[kkk] , "$$$$");

                   });
                   
                    
                   //console.log( scope.rowElementArrayToCapture, key, value "$$$$");
                     
                        
                        
                 
              
                  
                  });
                     
               
                   
                   
              };
              if (xlsxflag) {
                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);  
              }  
              else {  
                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);  
              }

                }
               
            });
          
               
            }
            scope.saving = 0;
            scope.lists.cellPutRequests = [];
            scope.sendValueToCube = function(reference, v, index, column){
               
              var refer = reference 
              scope.saving++;
              //  console.log( v, index, "index to save")
           
            
             
                
             
                 
              
                
                  //console.log( scope.table.data()[index]['cells'][0].isReadOnly);
                 
                        
                      var request = {
                        value: v, 
                        instance:$rootScope.defaults.settingsInstance, 
                        cube: scope.cubeName, 
                        cubeElements:refer
                        };
                        scope.lists.cellPutRequests.push(request);
                       // console.log("send to the cube", scope.lists.cellPutRequests)
                        
                        
                     
                  
                  
                 
                   // console.log(request);

                
                 
              
                
            }
            $rootScope.saveAllElements = function(){
            //console.log(scope.lists.cellPutRequests, scope.lists.cellPutRequests.length, "save");
              if( scope.lists.cellPutRequests.length > 0){
                    $tm1Ui.cellSetPut(scope.lists.cellPutRequests).then(function(result){
                                        
                                  if(result.success){
                                    
                                        $ngBootbox.alert('Data Saved to TM1 '+scope.cubeName+' Cube, Success!')
                                          .then(function() {
                                            scope.alertOpen = false;
                                            $timeout(
                                              function(){
                                                scope.lists.cellPutRequests = [];
                                                $tm1Ui.dataRefresh();
                                                $("#ngexcelfile")[0].files[0].name = '';
                                                scope.refresh(scope.cubeName,scope.cubeView);
                                              },2000
                                            )
                                            
                                          });
                                          
                                    //console.log("SAVED")
                                      
                                      

                                  }else{
                                    $ngBootbox.alert('Data FAILED to SAVE to TM1 Cube:'+scope.cubeName+'!')
                                          .then(function() {
                                            scope.alertOpen = false;
                                            $timeout(
                                              function(){
                                                scope.lists.cellPutRequests = [];
                                                $tm1Ui.dataRefresh();
                                                $("#ngexcelfile")[0].files[0].name = '';
                                                
                                              },2000
                                            )
                                            
                                          });
                                        
                                 //console.log("FAILED");
                                      
                                  }
                              });
              }else{
                $ngBootbox.alert('All Cells in view are read only cells, no data entry allowed!')
                .then(function() {
                  scope.alertOpen = false;
                  $timeout(
                    function(){
                      scope.lists.cellPutRequests = [];
                      $tm1Ui.dataRefresh();
                      $("#ngexcelfile")[0].files[0].name = '';
                      
                    },2000
                  )
                  
                });
              }
           
            }
            scope.cancelFileUpload = function(){
              $("#ngexcelfile")[0].files = [];
            }
            scope.getFileLoaded = function(){
            if($("#ngexcelfile")[0] != undefined && $("#ngexcelfile")[0] != null){
              if($("#ngexcelfile")[0].files[$("#ngexcelfile")[0].files.length-1] && $("#ngexcelfile")[0].files[$("#ngexcelfile")[0].files.length-1].name != '' ){
                //  console.log($("#ngexcelfile")[0].files[$("#ngexcelfile")[0].files.length-1].name);
                //  return 'Upload : '+$("#ngexcelfile")[0].files[$("#ngexcelfile")[0].files.length-1].name;
                if($("#ngexcelfile")[0].files[0].name != ''){
                  return 'PREVIEW';
                }else{
                  return '';
                }

                  
                  

                }else{
                  return '';
                }
            }
                  
                
               
               
            }
            $rootScope.collapseColumn = function(elemnt, row,index){
            //console.log(elemnt, row,index);
               
            }
            scope.filter = function(row){
    	
              // if(value.yearTotal == null){
              //   // Data isn't ready so don't display row
              //   return false;
              // }
              if(scope.options.suppressZeros){
                var zeroCounted = 0;
                for(cell in row['cells']){
                   
                  if(row['cells'][cell].value === 0 || (row['cells'][cell].value+'').indexOf('5e-') > -1 || row['cells'][cell].value === 'undefined' || row['cells'][cell].value === '-' || row['cells'][cell].value === '' ){
                    zeroCounted++;
                  }else{
                     console.log(zeroCounted, row['cells'].length, row.elements[0].element['attributes'].Description,  row.cells, "decide to show row ")
                  }
                  
                }
                if(zeroCounted === row['cells'].length){
                  
                  return false;
                  
                }
              } 
              return true;
              
             
           
        
              
            };
            scope.rowCells = [];
            scope.getCellComments = function(cell,cellref, parent, index){
              scope.rowCells[parent] = [];
             
              console.log(parent,index)
              $tm1Ui.cellAnnotationGet(scope.tm1Instance,scope.cubeName, ((cellref).toString()+'').split(',')).then(function(result){
              if(result){
                scope.rowCells[parent][index] = true;
                console.log('cell Comments' ,scope.rowCells);
              }else{
                scope.rowCells[parent][index] = false;

              }
                 
                //return result
              });
            }
                scope.seeDataNew = function(d){
                console.log(d)
                }

                scope.getTablePosition = function(){
                    return scope.tablePosition;
                }
                scope.getTableLeft = function(){
                    return scope.tableLeft;
                }
                scope.getTableTop = function(){
                    return scope.tableTop;
                }
                 
                scope.getMathMax = function(arr){
                    if(arr){
                       var max = arr.reduce(function(a, b) {
                           return Math.max(a, b);
                       });
                       return 'tm1-ui-element-consol tm1-ui-element-consol-'+(max+'') ;
                    }else{
                        return 'tm1-ui-element-consol tm1-ui-element-consol-'+(0+'');
                    }
                   
                   
                }
                
                scope.getMyChartClick = function(event){
                 // console.log(event.target.parentNode.parentNode, "EVENT CHART CLICKED ")
                }
                scope.applySaturationToHexColor =  function(hex, saturationPercent) {
                  if (!/^#([0-9a-f]{6})$/i.test(hex)) {
                      throw('Unexpected color format');
                  }
              
                  if (saturationPercent < 0 || saturationPercent > 100) {
                      throw('Unexpected color format');
                  }
              
                  var saturationFloat   = saturationPercent / 100,
                      rgbIntensityFloat = [
                          parseInt(hex.substr(1,2), 16) / 255,
                          parseInt(hex.substr(3,2), 16) / 255,
                          parseInt(hex.substr(5,2), 16) / 255
                      ];
              
                  var rgbIntensityFloatSorted = rgbIntensityFloat.slice(0).sort(function(a, b){ return a - b; }),
                      maxIntensityFloat       = rgbIntensityFloatSorted[2],
                      mediumIntensityFloat    = rgbIntensityFloatSorted[1],
                      minIntensityFloat       = rgbIntensityFloatSorted[0];
              
                  if (maxIntensityFloat == minIntensityFloat) {
                      // All colors have same intensity, which means 
                      // the original color is gray, so we can't change saturation.
                      return hex;
                  }
              
                  // New color max intensity wont change. Lets find medium and weak intensities.
                  var newMediumIntensityFloat,
                      newMinIntensityFloat = maxIntensityFloat * (1 - saturationFloat);
              
                  if (mediumIntensityFloat == minIntensityFloat) {
                      // Weak colors have equal intensity.
                      newMediumIntensityFloat = newMinIntensityFloat;
                  }
                  else {
                      // Calculate medium intensity with respect to original intensity proportion.
                      var intensityProportion = (maxIntensityFloat - mediumIntensityFloat) / (mediumIntensityFloat - minIntensityFloat);
                      newMediumIntensityFloat = (intensityProportion * newMinIntensityFloat + maxIntensityFloat) / (intensityProportion + 1);
                  }
              
                  var newRgbIntensityFloat       = [],
                      newRgbIntensityFloatSorted = [newMinIntensityFloat, newMediumIntensityFloat, maxIntensityFloat];
              
                  // We've found new intensities, but we have then sorted from min to max.
                  // Now we have to restore original order.
                  rgbIntensityFloat.forEach(function(originalRgb) {
                      var rgbSortedIndex = rgbIntensityFloatSorted.indexOf(originalRgb);
                      newRgbIntensityFloat.push(newRgbIntensityFloatSorted[rgbSortedIndex]);
                  });
              
                  var floatToHex = function(val) { return ('0' + Math.round(val * 255).toString(16)).substr(-2); },
                      rgb2hex    = function(rgb) { return '#' + floatToHex(rgb[0]) + floatToHex(rgb[1]) + floatToHex(rgb[2]); };
              
                  var newHex = rgb2hex(newRgbIntensityFloat);
              
                  return newHex;
              }
              scope.gatherColumnsHiden = function(){
              var totalhidden = 0; 
                for(var ddss = 0; ddss < scope.hideColumn[scope.tableId].length; ddss++ ){
                  if(scope.hideColumn[scope.tableId][ddss]){
                //    console.log(scope.hideColumn[scope.tableId][ddss], "true");
                    totalhidden++;
                  }
                }
                return totalhidden;
              }
                scope.rowTotalConsolidationArray = [];
                scope.refreshNew = function(newdataset){ 
                  if(scope.chartName === 'Pie'){
                    
                    scope.options.chart.x =  function(d){ if(d){ console.log("pie",d); return d.key; } }
                      
                  }else{
                    scope.options.chart.x =  function(d){  if(d){  return d.x;}}
                     
                  }
                            if(scope.cubeMdx != null && scope.cubeMdx != 'undefined' || scope.mdxId[scope.tableId] != null){
                              if($rootScope.useMdxNow){
                                $tm1Ui.cubeExecuteMdx(scope.tm1Instance,$rootScope.mdxString ).then(function(result){
                                  if(!result.failed){
                                     
                                    scope.parseTableResultNew(result);
                                        
                                } else {
                                   scope.message = result.message; 
                               } 
                              
                                })

                              }else{

                              $tm1Ui.cubeExecuteNamedMdx(scope.tm1Instance, scope.mdxId[scope.tableId],  JSON.parse($attributes.cubeMdxParams) ).then(function(result){
                                if(!result.failed){
                                  scope.parseTableResultNew(result);
                              } else {
                                 scope.message = result.message; 
                             } 
                            
                              })
                            }
                            }else{
                              
                            $tm1Ui.cubeExecuteView(scope.tm1Instance,scope.cubeName,scope.cubeView).then(function(result){
                                if(!result.failed){
                                     
                                    scope.parseTableResultNew(result);
                                } else {
                                   scope.message = result.message; 
                               } 
                              
                           })

                          }
                      
                }
                scope.focusedInputElementArray =[];
                scope.getFocus = function($event) {           
                   scope.focusObj = $event.target.id;
                   ////may be better to get the element array another way instead of from the dom
                   var focusObjId = $event.target.getAttribute('cellref');
                   scope.focusedInputElementArray =  document.getElementById($event.target.id).getAttribute('cellref');
                 // console.log("add paste event listener",$event.target.id, focusObjId, scope.focusedInputElementArray , document.getElementById($event.target.id).getAttribute('cellref'))
                }
                scope.addEventListerToInput = function(id){
                   // document.getElementById(id).addEventListener('paste', scope.handlePaste);
                }
                scope.getLastFocus = function() {  
                    if(document.getElementById(scope.focusObj)){
                       document.getElementById(scope.focusObj).focus(); 
                    }  
                }
                scope.lostFocus = function($event) {  

                   var focusObjOut = $event.target.id;
                   scope.focusObj = ''; 
                  // document.getElementById(focusObjOut).removeEventListener('paste', scope.handlePaste);
           
                }   
                scope.updateDimensionElementWidth = function(elid){
                  if(document.getElementById(elid)){
                    scope.dimensionElementWidth = document.getElementById(elid).getBoundingClientRect().width+'px';
                  }
                 
                }
                scope.getContainerWidthClass = function(idName){
                    if(document.getElementsByClassName(idName).length > 0){
                        var tempObj = document.getElementsByClassName(idName)[0];
                        if(tempObj != null || tempObj != 'undefined' ){
                           return tempObj.getBoundingClientRect().width;
                        }
                    } 
                }
                scope.getTableRowLength = function(){
                    return scope.table.data().length;
                }
           
                scope.cellreferenceArray = [];
                scope.dimensionArray = [];
                scope.openRefModel = function(elementString){
                    
                    if((elementString+'').split(',').length > 0){
                        // console.log(elementString, "elementString")

                        scope.cellreferenceArray = (elementString+'').split(',')
                        $tm1Ui.cubeDimensions(scope.tm1Instance,scope.cubeName).then(function(result){
                            scope.dimensionArray = result;
                            scope.getCellDrill(scope.cellreferenceArray);
                             
                        })
                    }
                   
                     
                }
                if($rootScope.isPrinting){
                  scope.currentRowCount = 10000;
                 }else{
                  scope.currentRowCount = scope.rowsToLoad;
                 }
                 
                scope.tablerowLength = 0;
                scope.ledgendsToUse = {
                 
                    "0": {
                    "color": $rootScope.applicationHeaderColorSelect,
                    "name": "Actual"
                    },
                    "1": {
                    "color": $rootScope.applicationHeaderColorBudget,
                    "name": "Budget"
                    },
                    "2": {
                    "color":  $rootScope.applicationHeaderColorLastYear,
                    "name": "Last Year"
                    }
                }
               
                scope.getCellData = function(elements, row, col){
               // console.log( scope.tm1Instance+','+scope.cubeName+','+(elements).toString());
               scope.myCellData[row] = [];
                $tm1Ui.cellGet(scope.tm1Instance, scope.cubeName, elements.toString(),{} ).then(function(data){ 
                     if(data){
                       //console.log(row, col, data);
                       scope.myCellData[row][col] = data;
                     }
                 });
                }
                scope.refresh = function(cube,cubeview){
                    
                  if(scope.cubeMdx != null && scope.cubeMdx != 'undefined' ||  scope.mdxId[scope.tableId] != null){
                    
                    scope.charRowCount = 0;
                    if($rootScope.useMdxNow){
                      $rootScope.setMdx($rootScope.mdxString);
                    }else{
                     
              //console.log("id to load ##### ",scope.mdxId[scope.tableId], "    ##### table = ", scope.tableId,  "   useMdx  = " , $rootScope.useMdxNow)
                     
                    $tm1Ui.cubeExecuteNamedMdx(scope.tm1Instance, scope.mdxId[scope.tableId],   scope.cubeMdxParams ).then(function(result){
                        if(!result.failed){
                       //console.log(result, "scope.tablescope.table")
                       scope.parseTableResult(result, cube);
                        } else {
                            scope.message = result.message;
                            
                           
                        }		
                       
                    })
                  }
                  }else{


                    scope.charRowCount = 0;
                    $tm1Ui.cubeExecuteView(scope.tm1Instance,cube,scope.cubeView).then(function(result){
                          if(!result.failed){
                          //console.log(result, "scope.tablescope.table")
                          scope.parseTableResult(result, cube);
                          } else  {
                              scope.message = result.message;
                              
                        }            
                    })
                  }    
                }

                scope.tableData = [];
                scope.tableRowCollapseData = [];
                scope.collapsedRowArray = [];
                





              scope.parseTableResultNew = function(result){
                
                scope.datasetNew[scope.tableId] = $tm1Ui.resultsetTransform(scope.tm1Instance, scope.cubeName, result, scope.attributeOptions);
                                      
                scope.dataset = scope.dataset;
                    
                    scope.optionsNew[scope.tableId] = {preload: false, watch: false, pageSize: scope.currentRowCount, filter: scope.filter};
                    
                   scope.tableNew[scope.tableId] = $tm1Ui.tableCreate(scope, scope.datasetNew[scope.tableId].rows, scope.optionsNew[scope.tableId]);
                   
                   scope.tablerowLength = scope.tableNew[scope.tableId].data().length;
                   scope.tableNew[scope.tableId].pageSize(1000)
                  // console.log(scope.table.data(), scope.tableNew.data());  
                   var tableRows = scope.table.data();

                    for(newrow in scope.tableNew[scope.tableId].data()){
                        for(row in scope.table.data()){
                          
                            if( scope.tableNew[scope.tableId].data()[newrow].index === scope.table.data()[row].index){
                              
                              //console.log(scope.tableNew[scope.tableId].data()[newrow].index, scope.table.data()[row].index, scope.table.data()[row]['cells'], scope.tableNew[scope.tableId].data()[newrow]['cells'], "same row");
                              
                               
                               scope.table.data()[row]['cells'] = scope.tableNew[scope.tableId].data()[newrow]['cells'];
                            } 
                          

                        }
                    }
                     
                    
                   //scope.options.chart.margin.left  = (250)*(scope.table.data()[0].elements.length)
                    var jsonRowData = [];
                    var colNameArray = [];
                    var rowNameArray = [];
                    
                    for(ggh = 0; ggh < scope.dataset.headers.length; ggh++){
                        var myColObj = scope.dataset.headers[ggh];
                        var arrayToUse= [];
                         
                        for(jjk = 0; jjk < myColObj.columns.length; jjk++){
                            if(colNameArray[jjkk] === undefined || !colNameArray){
                                colNameArray[jjk] =  (myColObj.columns[jjk].element['attributes']['Caption_Default']);
                            }else{
                                colNameArray[jjk] +=   (myColObj.columns[jjk].element['attributes']['Caption_Default']);
                            }
                            
                        }
                    }
                    var rowNameFinalArray = [];

                    for(gggh = 0; gggh < scope.table.data().length; gggh++){
                        var myRowObjElement = scope.table.data()[gggh];
                        
                         
                        for(jjjk = 0; jjjk < myRowObjElement.elements.length; jjjk++){
                            if(myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]){
                                if(rowNameArray[gggh]){
                                    rowNameArray[gggh] +=  ' :- ' + (myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]);
                                  }else{
                                    rowNameArray[gggh] =   (myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]);
                                  }
                            }else{
                                if(rowNameArray[gggh]){
                                    rowNameArray[gggh] +=  ' :- ' + (myRowObjElement.elements[jjjk].element.name);
                                  }else{
                                    rowNameArray[gggh] =   (myRowObjElement.elements[jjjk].element.key);
                                  }
                            }
                               
                                 
                          
                        }
                        rowNameFinalArray[gggh] = rowNameArray[gggh];
                        
                        if(scope.randomColor[(rowNameFinalArray[gggh]+'').split(' :- ')[0]]){
                            //scope.randomColor[(rowNameFinalArray[gggh]).split('-')[0]] =  '#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6);
                        }else{
                          var newSatColor = scope.applySaturationToHexColor('#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6), 50);
                          scope.randomColor[(rowNameFinalArray[gggh]+'').split(' :- ')[0]] =  newSatColor ;
                        
                        }   
                        rowNameArray = [];
                    }
                    
                    //console.log(colNameArray, "colNameArray")
                    for(row in scope.table.data()){
                        //var scope.randomColor =  '#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6);
                        
                           
                            
                            var cellArrayFromJson = [];
                            scope.charRowCount++;
                            if(scope.chartName === 'Pie'){
                              jsonRowData[row] =  {"key": '' ,
                              "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], };
                            }else{
                              jsonRowData[row] =  {"key": '',
                              "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], "values":[]};
                            }
                            
                            for(var gss = 0; gss < scope.table.data()[row].cells.length; gss++){
                               
                              if( scope.hideColumn[scope.tableId][gss]  ){  
                                //console.log("HIDE COLUMN",gss);
                                
                              }else{
                                if(scope.table.data()[row].elements.length){
                                  jsonRowData[row].key = rowNameFinalArray[row] ;
                              }
                               
                              if( $rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]  || scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gss]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gss]['dimension'])+'']]  ){

                                if( (scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes'][$rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]] +'').indexOf('%') > -1 || (scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gss]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gss]['dimension'])+'']]+'' ).indexOf('%') > -1 ){
                                  if(scope.chartName === 'Pie'){
                                    cellArrayFromJson.push({"key":rowNameFinalArray[row],  "format":"%",  "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], "y":    Math.round((scope.table.data()[row].cells[gss].value)*100).toFixed(2)   });
                                  }else{
                                    cellArrayFromJson.push({"type":scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['type'],"format":"%","key":rowNameFinalArray[row],"label":"Column-"+gss,"x":gss,"y":  Math.round((scope.table.data()[row].cells[gss].value)*100).toFixed(2)    });
                                  }
                                 // console.log(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gss]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gss]['dimension'])+'']], "headers if percentage")
                                }else{
                                  if(scope.chartName === 'Pie'){
                                    cellArrayFromJson.push({ "key":rowNameFinalArray[row], "format":"$","color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], "y":   Math.round(scope.table.data()[row].cells[gss].value)  });
                                  }else{
                                  cellArrayFromJson.push({"type":scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['type'],"format":"$","key":rowNameFinalArray[row],"label":"Column-"+gss,"x":gss,"y": Math.round(scope.table.data()[row].cells[gss].value)});
                                  }
                                }
                              } 

                              
                              
                           
                               // console.log("dont hide",gss);
                              }
                               
                      
                                
                                        
                                    
                                    
                                  
                                    
                                    
                            }

                            var tt = JSON.stringify(cellArrayFromJson) 
                            if(scope.chartName === 'Pie'){
                              var ttT = JSON.stringify(cellArrayFromJson[scope.selectedColumnForPieChart]) 
                              jsonRowData[row]= JSON.parse(ttT);
                            }else{
                              jsonRowData[row]["values"] = JSON.parse(tt);
                            }
                            
                           
                         
                        
                      ////console.log(jsonRowData[row]) 
                    }
                  
                   

                   //scope.tableData = scope.table.data();
                   scope.data[scope.tableId] = jsonRowData;
                //   console.log(scope.data)
                   if( scope.api){
                    scope.api.update();
                   }
                   jsonRowData = [];
                   scope.getLastFocus(); 
                   

              }




              scope.columnSortedRev= [];
              scope.selectColumnForPieChart = function(col, index){
                scope.selectedColumnForPieChart = index;
                scope.refreshNew(scope.cubeName, scope.cubeView);
          //console.log("Column selected to use in the chart")
              }
              scope.sortTableBy = function(alias,name){
                if(alias){
                  scope.table.sort(alias);
                  scope.columnSorted = alias;
                  scope.columnSortedRev = scope.table['_sortReverse'] ;
                  
                      
                //console.log(scope.columnSortedRev, "table");
                      $timeout(
                        function(){
                         
                        }
                      )
                     
                    
                }else{
                  scope.table.sort(name);
                  scope.columnSorted = name;
                  scope.columnSortedRev = scope.table['_sortReverse'] ;
                  
                      
                 //console.log(scope.columnSortedRev, "table")
                       $timeout(
                        function(){
                           
                        }
                      )
                }
                
                 
              }





                scope.parseTableResult = function(result, cube){
                  
                  scope.dataset = $tm1Ui.resultsetTransform(scope.tm1Instance, cube, result, scope.attributeOptions);
                                      
                  scope.options[scope.tableId] = {preload: false, index: 0, pageSize: scope.currentRowCount, watch: false, filter: scope.filter};
                  if(scope.table){
                      if(scope.table.options){
                       //console.log(scope.table, "scope.tablescope.table")
                       scope.options[scope.tableId].index = scope.table.options.index;
                       scope.options[scope.tableId].pageSize = scope.table.options.pageSize;
                       scope.tablerowLength = scope.table.data().length;
                      }
                      
                       
                    
                       
                  }
                   scope.table = $tm1Ui.tableCreate(scope, scope.dataset.rows, scope.options[scope.tableId]);
             //console.log("table columns", scope.table, scope.table['dataSource'][0]['cells'][0]['dataset']['dimensions']['columns'][0]);
                   
                    scope.tableColumnDimensionArray = scope.table['dataSource'][0]['cells'][0]['dataset']['dimensions']['columns'];
                    for(var gxs = 0; gxs < scope.tableColumnDimensionArray.length; gxs++){
                       $tm1Ui.dimensionElements(scope.tm1Instance, scope.tableColumnDimensionArray[gxs]).then(function(result){
                   //console.log("RESULT COLUMN DIMENSION ELEMENTS", result);
                        for(var tte = 0; tte < result.length; tte++)
                        {  
                          if(result[tte]['Type'] === 'Consolidated'){ 
                          
                            scope.consolidatedColumnsElementNames.push(result[tte]['Name']);
                         
                            
                          }
                        }
                  //console.log('scope.consolidatedColumnsElementNames',  scope.consolidatedColumnsElementNames);
                        
                     });
                    }
                    
                   scope.table.pageSize(scope.currentRowCount);
                  
               
                   if(scope.table.data()[0] != undefined && !scope.table.data()[0]){
                     
                     scope.tableDimensionLength =  scope.table.data()[0].elements.length;
                    }else{
                     scope.tableDimensionLength = 0;
                    }
                 //console.log(scope.tableDimensionLength ,"scope.tableDimensionLength ");
                  
                   
                   //scope.table = scope.table;
                   scope.table.refresh();
                    
                   $rootScope.table = scope.table;
                  
                   $rootScope.dimensionsOnRows = scope.dataset['dimensions']['rows'];
                   $rootScope.dimensionsOnColumns = scope.dataset['dimensions']['columns'];
                   $rootScope.dimensionsOnTitles = scope.dataset['dimensions']['titles'];
                   //console.log($rootScope.dimensionsOnRows, $rootScope.dimensionsOnColumns, $rootScope.dimensionsOnTitles + "table dimensions")
                   var jsonRowData = [];
                   var colNameArray = [];
                   var rowNameArray = [];
       
                   for(ggh = 0; ggh < scope.dataset.headers.length; ggh++){
                       var myColObj = scope.dataset.headers[ggh];
                       var arrayToUse= [];
                        
                       for(jjkk = 0; jjkk < myColObj.columns.length; jjkk++){
                         if(colNameArray[jjkk] === undefined || !colNameArray){
                           colNameArray[jjkk] =  (myColObj.columns[jjkk].element['attributes']['Caption_Default']);
                        }else{
                           colNameArray[jjkk] +=   (myColObj.columns[jjkk].element['attributes']['Caption_Default']);
                        }
                           
                       }
                   }
                   var rowNameFinalArray = [];
                   for(gggh = 0; gggh < scope.table.data().length; gggh++){
                       var myRowObjElement = scope.table.data()[gggh];
                        
                       for(jjjk = 0; jjjk < myRowObjElement.elements.length; jjjk++){
                         //console.log(  myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]] , "DIMENSION" );
                           if(myRowObjElement.elements[jjjk].element.attributes['Description']){
                               if(rowNameArray[gggh]){
                                   rowNameArray[gggh] +=  ' :- ' + (myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]);
                                 }else{
                                   rowNameArray[gggh] =   (myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]);
                                 }
                           }else{
                               if(rowNameArray[gggh]){
                                   rowNameArray[gggh] +=  ' :- ' + (myRowObjElement.elements[jjjk].element.name);
                                 }else{
                                   rowNameArray[gggh] =   (myRowObjElement.elements[jjjk].element.key);
                                 }
                           }
                              
                                
                         
                       }
                       rowNameFinalArray[gggh] = rowNameArray[gggh];
                       if(scope.randomColor[(rowNameFinalArray[gggh]+'').split(' :- ')[0]]){
                         //scope.randomColor[(rowNameFinalArray[gggh]).split('-')[0]] =  '#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6);
                     }else{
                       var newSatColor = scope.applySaturationToHexColor('#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6), 50);
                       scope.randomColor[(rowNameFinalArray[gggh]+'').split(' :- ')[0]] =  newSatColor ;
                     
                     }    
                       rowNameArray = [];
                   }
                  // console.log(colNameArray, "colNameArray", scope.randomColor);
                    
                   for(row in scope.table.data()){
                    // console.log(scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes']['Color'], "Color of element")
                    
                                                      
                       var cellArrayFromJson = [];
                       scope.charRowCount++;
                       if(scope.chartName === 'Pie'){
                         jsonRowData[row] =  {"key": '' ,
                         "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])],};
                       }else{
                       jsonRowData[row] =  {"key": '',
                       "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], "values":[]};
                       }
                         for(var gs = 0; gs < scope.table.data()[row].cells.length; gs++){
                        
                           if( scope.hideColumn[scope.tableId][gs] ){  
                            // console.log("HIDE COLUMN",gs);
                             
                           }else{
                             if(scope.table.data()[row].elements.length){
                               jsonRowData[row].key = rowNameFinalArray[row] ;
                                 
                                   
                             }
                             //console.log((scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes'][$rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]] ).indexOf('%'),         scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']]         );


                             if( $rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]  || scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']]  ){

                               if( (scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes'][$rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]] +'').indexOf('%') > -1 || (scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']]+'' ).indexOf('%') > -1 ){
                                 if(scope.chartName === 'Pie'){
                                   cellArrayFromJson.push({ "key":rowNameFinalArray[row], "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])],  "y":    Math.round(Math.round(scope.table.data()[row].cells[gs].value)*100).toFixed(2)  });
                                 }else{
                                   cellArrayFromJson.push({"type":scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['type'],"key":rowNameFinalArray[row],"label":"Column-"+gs,"x":gs,"y":  Math.round((scope.table.data()[row].cells[gs].value)*100).toFixed(2)    });
                                 }
                                // console.log(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']], "headers if percentage")
                               }else{
                                 if(scope.chartName === 'Pie'){
                                   cellArrayFromJson.push({ "key":rowNameFinalArray[row], "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])],  "y":   Math.round(scope.table.data()[row].cells[gs].value) });
                                 }else{
                                   cellArrayFromJson.push({"type":scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['type'],"key":rowNameFinalArray[row],"label":"Column-"+gs,"x":gs,"y": Math.round(scope.table.data()[row].cells[gs].value)});
                                 }
                                
                               }
                             } 

                           } 
                        }   
                      
                       var tt = JSON.stringify(cellArrayFromJson) 
                       if(scope.chartName === 'Pie'){
                          var ttT = JSON.stringify(cellArrayFromJson[scope.selectedColumnForPieChart]); 
                          jsonRowData[row]= JSON.parse(ttT);
                       }else{
                         jsonRowData[row]["values"] = JSON.parse(tt);
                       }
                     
                   } 
                 
                  scope.data[scope.tableId] = jsonRowData; 
               
                  $timeout(
                    function(){
                      if( scope.api){
                        
                        scope.api.update();
                          
                      }
                    },1000
                  )
                  scope.refreshNew(scope.dataset);
                  jsonRowData = [];
                }



                
                scope.seeNewData = function(data){
                  //console.log(data)
                }
                scope.getColType = function(data){
                    return data;
                }
                scope.formatPercentage = function(total){
                  return  parseFloat(total*100).toFixed(2); 
                   
                }
                scope.formatPercentageString = function(total, d){
                  return  parseFloat(total*100).toFixed(2); 
                   
                }
                scope.seeData = function(rowindex, index,table){
                    $rootScope.allCollapsed = undefined; 
                    scope.dataset.rows[(rowindex)][scope.dataset['dimensions']['rows'][index]]['element'].toggle();
                    //console.log( scope.dataset.rows[(rowindex)][scope.dataset['dimensions']['rows'][index]]['element'].collapsed)
                    scope.table.refresh(); 
                    scope.refreshNew(scope.dataset);
            
                };
               
                scope.containerishere = false;
           scope.scrollAmountTop = 0;
            scope.setUpFreezePane = function(){
              //console.log("setting up freeze pane", scope.tableId, document.querySelector('#stickyContainer'))
              if(scope.tableUrlValue != null &&  scope.tableUrlValue != 'undefined'  ){
              //console.log(scope.tableUrlValue,scope.chartUrlValue, "URL VALUES TRACKED" )
                //scope.tableHide= scope.tableUrlValue;  
                
               $rootScope.parametersVisible = false;
              }else{
                //scope.tableHide= $attributes.tableHide;
                
               
              }
              if(scope.chartUrlValue != null && scope.chartUrlValue != 'undefined' ){
              //console.log(scope.tableUrlValue,scope.chartUrlValue, "URL VALUES TRACKED" )
              if(scope.chartUrlValue === 'true'){
                scope.chartVisible = true;
                
              }else{
                scope.chartVisible = false;  
                 
              }
                
               $rootScope.parametersVisible = false;
              }else{
                scope.chartVisible= $attributes.chartVisible;
                
               
              }
                
                if( document.querySelector('#stickyContainer'+scope.tableId)){
                    scope.containerishere = true;
                    if(scope.excelReformated === false){
                        scope.formatUploadButton();
                    }
                  
                    angular.element(document.querySelector('#stickyContainer'+scope.tableId)).bind('scroll', function(){
                      
                       
                        var el = $('#stickyContainer'+scope.tableId);
                        $body = $(el);  
                        $stickyHeader = $(el).find('#sticky-header'+scope.tableId);
                        $fixedHeader = $(el).find('.fixed-container');
                        $fixedHeaderContainer = $(el).find('#fixedFirstColHeader');
                        
                        $fixedFirstColHeader = $(el).find('.fixedFirstColHeader');
                        $chartContent = $(el).find('#chartRow'+scope.tableId);
                        $sideContent = $(el).find('#sideContent'+scope.tableId); 
                        $tableContent = $(el).find('#af1'+scope.tableId); 
                         
                        scope.scrolling = true;
                        $($stickyHeader).css('display','none'); 
                        
                      
                            
                       
                             scope.scrollAmountTop =  $($body).scrollTop();
                             if(scope.chartVisible  ){
                              scope.offsetTop = ((scope.chartHeight) );
      
                            }else{
                              
                              scope.offsetTop = 1;
                            }
                            var valuetoEval = scope.offsetTop;
                            if(scope.tableHide){
                                $($sideContent).css('display', 'none');
                              }else{
                                $($sideContent).css('display', 'block');
                            }
                           

                            if($($body).scrollTop() >= parseInt(valuetoEval)  ){
                              $($fixedHeader).css('display','block'); 
                              $($stickyHeader).css('display','block'); 
                               
                              scope.headerOutOffView = true;
                              //console.log("view header")
                                if($($stickyHeader)){
                                    $($stickyHeader).css('display','block !important'); 
                                    $($stickyHeader).css('opacity','1'); 
                                    $($stickyHeader).css('pointer-events','auto'); 
                                }
                                if($($fixedHeader) && $($fixedHeaderContainer)){
                                    $($fixedHeader).css('pointer-events','auto'); 
                                    $($fixedHeaderContainer).css('display','block');
                                    
                                     
                                }
                                if($($fixedFirstColHeader)){
                                  $($fixedFirstColHeader).css('display','block');
                                }
                               
                               
                                 
                                 
                                window.dispatchEvent(new Event('resize')); 
                            }else{
                              $($stickyHeader).css('display','none'); 
                                $($fixedHeaderContainer).css('display','none'); 
                                scope.headerOutOffView = false;
                              //console.log("hide header")
                                if($($stickyHeader)){
                                   
                                   $($stickyHeader).css('display','none !important'); 
                                    $($stickyHeader).css('opacity','0'); 
                                    $($stickyHeader).css('pointer-events','none'); 
                                }
                                if($($fixedHeader) && $($fixedHeaderContainer)){
                                  $($fixedHeader).css('pointer-events','auto'); 
                                  $($fixedHeaderContainer).css('display','none');
                                  
                                   
                              }
                                

                                   
                             
                                 
                                 
                                 
                                  
                            } 
                            if( $($sideContent) && document.getElementById('searchColumn'+scope.tableId)){
                            
                              $($sideContent).css('margin-top', -$($body).scrollTop());
                              
                              if(scope.chartVisible){
                                //console.log((document.getElementById('chartRow'+scope.tableId).getBoundingClientRect().height ) )+(document.getElementById('head'+scope.tableId).getBoundingClientRect().height);
                                if(scope.tableHeight > 0){
                            //console.log(scope.tableHeight, " - ",scope.tableHeightBottomOffset, "- ",(document.getElementById('optionSection'+scope.tableId).getBoundingClientRect().top) , "########");
                                  
                                  $($sideContent).css('height', ((scope.tableHeight) - (scope.tableHeightBottomOffset)-((( (38) )  + (document.getElementById('chartRow'+scope.tableId).getBoundingClientRect().height ) -(3)  )) + document.getElementById('searchColumn'+scope.tableId).getBoundingClientRect().height ) + $($body).scrollTop() );
                                }else{
                                  $($sideContent).css('height', ((window.innerHeight) - (scope.tableHeightBottomOffset)-((( (38) )  + (document.getElementById('chartRow'+scope.tableId).getBoundingClientRect().height ) -(3)  )) + document.getElementById('searchColumn'+scope.tableId).getBoundingClientRect().height ) + $($body).scrollTop() );
                                
                                }
                                 
                              }else{
                                if(scope.tableHeight ){
                                 
                                $($sideContent).css('height', ((scope.tableHeight) - (scope.tableHeightBottomOffset)-((( (38) ) )) + document.getElementById('searchColumn'+scope.tableId).getBoundingClientRect().height ) + $($body).scrollTop() );
                                }else{
                                  $($sideContent).css('height',((window.innerHeight) - (scope.tableHeightBottomOffset)-((( (38) ) )) + document.getElementById('searchColumn'+scope.tableId).getBoundingClientRect().height ) + $($body).scrollTop() );
                               
                                }
                              }
                               
                                                              
                              }
                            
                             if($($stickyHeader)){
                                $($stickyHeader).css('margin-left', -$($body).scrollLeft());
                             }
                             
                      });
                      $timeout(
                        function(){
                          var ele = $('#stickyContainer'+scope.tableId);
                          $chartContent = $(ele).find('#chartRow'+scope.tableId);
                          $tableContent = $(ele).find('#af1'+scope.tableId); 
                           if( $tableContent && $chartContent){
                          //console.log($tableContent.css('width'));
                             
                              $($chartContent).css('width',  $tableContent.css('width') );
                             
                             
                            
                         
                           }
                            
                          
                        },100)
                }else{
                    if(scope.containerishere === true){

                    }else{
                        scope.waitTillContainerArives();
                    }
                    
                }
                
            }
            scope.waitTillContainerArives = function(){
                $timeout(
                    function(){
                        //console.log("looking for freezepane");
                        scope.setUpFreezePane();
                       
                    },100
                )
                
            }
            scope.decideRowToHideRow = function(tableinview, searchfield, searchexists, rowtoUpdate){

               // console.log(tableinview,searchfield, (searchexists+'').indexOf(scope.selections.searchRows[scope.tableId]), "function to decide row view")
                if(tableinview === true){
                   
                    return true;
                
                   
                 
                }else{
                  if(scope.selections.searchRows[scope.tableId] != null && scope.selections.searchRows[scope.tableId] !='undefined' && ((searchexists+'').toLowerCase()).indexOf((scope.selections.searchRows[scope.tableId]).toLowerCase()) === -1){
                   // console.log("hide row")
                    return true;
                  }else{
                    if(scope.lists.cellPutRequests.length > 0 && !rowtoUpdate){
                      return true;
                    }else{
                      return false;
                    }
                    //console.log("show row")
                     
                  }
                 
                }
                 
                 
            }
            scope.removeRecordFromList = function(cell){
              var currentCell =  (cell.reference()).toString();
               
              for(var cellinList = 0 ; cellinList < scope.lists.cellPutRequests.length; cellinList++ ){
                if((scope.lists.cellPutRequests[cellinList].cubeElements).toString() === currentCell){
                   
                  scope.lists.cellPutRequests.splice(cellinList, cellinList+1);
                  
                }else{

                }

                console.log(cell.reference());
              }
              if(scope.lists.cellPutRequests.length === 0){
                scope.cancelFileUpload();
              }
            }
            scope.decideRowToHideFreezePane = function(tableinviewfreeze, searchfieldfreeze, searchexistsfreeze, rowtoUpdate){

              // console.log(tableinview,searchfield, (searchexists+'').indexOf(scope.selections.searchRows[scope.tableId]), "function to decide row view")
               if(tableinviewfreeze === false){
                  
                   return true;
               
                  
                
               }else{
                 if(scope.selections.searchRows[scope.tableId] != null && scope.selections.searchRows[scope.tableId] !='undefined' ){
                    
                    if( ((searchexistsfreeze+'').toLowerCase()).indexOf((scope.selections.searchRows[scope.tableId]).toLowerCase()) > -1){
                      //console.log("show row with same name as", scope.selections.searchRows[scope.tableId],  searchexistsfreeze, ((searchexistsfreeze+'').toLowerCase()).indexOf((scope.selections.searchRows[scope.tableId]).toLowerCase()));
                      return true;
                    }else{
                      return false
                    }
                
                 }else{
                   //console.log("show row")
                   if(scope.lists.cellPutRequests.length > 0 && !rowtoUpdate){
                    return false;
                  }else{
                   return true;
                  }
                 }
                
               }
                
                
           }
           $(window).focus(function() {
        
            
            scope.refreshNew(scope.dataset);
             
        });
           $rootScope.setMdx = function(mdxPassed){
             $timeout(
               function(){
                $tm1Ui.cubeExecuteMdx(scope.tm1Instance,mdxPassed).then(function(result){
                  if(!result.failed){
                     
                    //console.log(result, "scope.tablescope.table")
                         scope.dataset = $tm1Ui.resultsetTransform(scope.tm1Instance, scope.cubeName, result, scope.attributeOptions);
                        
                         scope.options[scope.tableId] = {preload: false, watch: false, index: 0, pageSize: scope.currentRowCount,  filter: scope.filter};
                         if(scope.table){
                             if(scope.table.options){
                              //console.log(scope.table, "scope.tablescope.table")
                              scope.options[scope.tableId].index = scope.table.options.index;
                              scope.options[scope.tableId].pageSize = scope.table.options.pageSize;
                              scope.tablerowLength = scope.table.data().length;
                             }
                             
                              
                           
                              
                         }
                          scope.table = $tm1Ui.tableCreate(scope, scope.dataset.rows, scope.options[scope.tableId]);
                         
                          scope.table.pageSize(scope.currentRowCount);
                         
                          if(scope.table.data()[0] != undefined && !scope.table.data()[0]){
                            scope.tableDimensionLength =  scope.table.data()[0].elements.length;
                           }else{
                            scope.tableDimensionLength = 0;
                           }
                        //console.log(scope.tableDimensionLength ,"scope.tableDimensionLength ");
                         
                          
                          //scope.table = scope.table;
                        //  scope.table.refresh();
                          
                           
                          $rootScope.dimensionsOnRows = scope.dataset['dimensions']['rows'];
                          $rootScope.dimensionsOnColumns = scope.dataset['dimensions']['columns'];
                          $rootScope.dimensionsOnTitles = scope.dataset['dimensions']['titles'];
                          //console.log($rootScope.dimensionsOnRows, $rootScope.dimensionsOnColumns, $rootScope.dimensionsOnTitles + "table dimensions")
                          var jsonRowData = [];
                          var colNameArray = [];
                          var rowNameArray = [];
              
                          for(ggh = 0; ggh < scope.dataset.headers.length; ggh++){
                              var myColObj = scope.dataset.headers[ggh];
                              var arrayToUse= [];
                               
                              for(jjkk = 0; jjkk < myColObj.columns.length; jjkk++){
                                if(colNameArray[jjkk] === undefined || !colNameArray){
                                  colNameArray[jjkk] =  (myColObj.columns[jjkk].element['attributes']['Caption_Default']);
                               }else{
                                  colNameArray[jjkk] +=   (myColObj.columns[jjkk].element['attributes']['Caption_Default']);
                               }
                                  
                              }
                          }
                          var rowNameFinalArray = [];
                          for(gggh = 0; gggh < scope.table.data().length; gggh++){
                              var myRowObjElement = scope.table.data()[gggh];
                               
                              for(jjjk = 0; jjjk < myRowObjElement.elements.length; jjjk++){
                                //console.log(  myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]] , "DIMENSION" );
                                  if(myRowObjElement.elements[jjjk].element.attributes['Description']){
                                      if(rowNameArray[gggh]){
                                          rowNameArray[gggh] +=  ' :- ' + (myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]);
                                        }else{
                                          rowNameArray[gggh] =   (myRowObjElement.elements[jjjk].element.attributes[$rootScope.attributeOptions['alias'][myRowObjElement.elements[jjjk]['dimension']]]);
                                        }
                                  }else{
                                      if(rowNameArray[gggh]){
                                          rowNameArray[gggh] +=  ' :- ' + (myRowObjElement.elements[jjjk].element.name);
                                        }else{
                                          rowNameArray[gggh] =   (myRowObjElement.elements[jjjk].element.key);
                                        }
                                  }
                                     
                                       
                                
                              }
                              
                              rowNameFinalArray[gggh] = rowNameArray[gggh];
                              if(scope.randomColor[(rowNameFinalArray[gggh]+'').split(' :- ')[0]]){
                                //scope.randomColor[(rowNameFinalArray[gggh]).split('-')[0]] =  '#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6);
                              }else{
                                var newSatColor = scope.applySaturationToHexColor('#' + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1,6), 50);
                                scope.randomColor[(rowNameFinalArray[gggh]+'').split(' :- ')[0]] =  newSatColor ;
                              
                              }    
                              //console.log(rowNameFinalArray);
                              rowNameArray = [];
    
                          }
                         // console.log(colNameArray, "colNameArray", scope.randomColor);
                           
                          for(row in scope.table.data()){
                           // console.log(scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes']['Color'], "Color of element")
                         
                                                             
                              var cellArrayFromJson = [];
                              scope.charRowCount++;
                              if(scope.chartName === 'Pie'){
                                jsonRowData[row] =  {"key": '' ,
                                "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])],};
                              }else{
                              jsonRowData[row] =  {"key": '',
                              "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], "values":[]};
                              }
                                for(var gs = 0; gs < scope.table.data()[row].cells.length; gs++){
                                  
                                  if( scope.hideColumn[scope.tableId][gs] ){  
                                   // console.log("HIDE COLUMN",gs);
                                    
                                  }else{
                                    if(scope.table.data()[row].elements.length){
                                      jsonRowData[row].key = rowNameFinalArray[row] ;
                                        
                                          
                                    }
                                    //console.log((scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes'][$rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]] ).indexOf('%'),         scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']]         );
    
    
                                    if( $rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]  || scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']]  ){
    
                                      if( (scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['attributes'][$rootScope.attributeOptions['alias'][scope.table.data()[row].elements[scope.table.data()[row].elements.length-1]['dimension']]] +'').indexOf('%') > -1 || (scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']]+'' ).indexOf('%') > -1 ){
                                        if(scope.chartName === 'Pie'){
                                          cellArrayFromJson.push({"key":rowNameFinalArray[row], "format":"%",  "color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])], "y":  Math.round((scope.table.data()[row].cells[gs].value)*100).toFixed(2)   });
                                        }else{
                                          cellArrayFromJson.push({"type":scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['type'],"format":"%","key":rowNameFinalArray[row],"label":"Column-"+gs,"x":gs,"y":   Math.round((scope.table.data()[row].cells[gs].value)*100).toFixed(2)    });
                                        }
                                        // console.log(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['element']['attributes'][$rootScope.attributeOptions['alias'][(scope.dataset.headers[(scope.dataset.headers.length-1)]['columns'][gs]['dimension'])+'']], "headers if percentage")
                                      }else{
                                        if(scope.chartName === 'Pie'){
                                          cellArrayFromJson.push({"key":rowNameFinalArray[row],"format":"$","color": scope.randomColor[((rowNameFinalArray[row]+'').split(' :- ')[0])],  "y": Math.round(scope.table.data()[row].cells[gs].value)});
                                        }else{
                                          cellArrayFromJson.push({"type":scope.table.data()[row].elements[scope.table.data()[row].elements.length-1].element['type'],"format":"$","key":rowNameFinalArray[row],"label":"Column-"+gs,"x":gs,"y": Math.round(scope.table.data()[row].cells[gs].value)});
                                        }
                                      }
                                    } 
    
    
                                     
                                     
                                    
                                    //console.log("dont hide",gs); $rootScope.attributeOptions[] 
                                  }
                                
                                    
                                  
                                  
                                        
                                          
                                      
                                      
                                    
                                      
                                      
                              }
                            
                              var tt = JSON.stringify(cellArrayFromJson) 
                              if(scope.chartName === 'Pie'){
                                 var ttT = JSON.stringify(cellArrayFromJson[scope.selectedColumnForPieChart]); 
                                 jsonRowData[row]= JSON.parse(ttT);
                              }else{
                                jsonRowData[row]["values"] = JSON.parse(tt);
                              }
                              //console.log(jsonRowData[row]) 
                          }
                          
                       
                           
                        
                         //scope.tableData = scope.table.data();
                        scope.data[scope.tableId] = jsonRowData; 
                     
                        $timeout(
                          function(){
                            if( scope.api){
                              scope.api.update();
                               
                            }
                          },1000
                        )
                        scope.refreshNew(scope.dataset)
                        jsonRowData = [];
                     } else {
                        scope.message = result.message;
                         
                        
                     }		
                    
                 })
               },1000
             )
             
          }
          
          scope.formatToHeaderName = function(number){
         //   console.log(number)
            var useNumberNew =  number ;
            if(scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['element'].attributes[$rootScope.attributeOptions['alias'][((  scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['dimension']  )+'')]]){
              if(scope.dataset.headers.length-1 != 0){
                return scope.dataset.headers[0]['columns'][useNumberNew]['element'].attributes[$rootScope.attributeOptions['alias'][((  scope.dataset.headers[0]['columns'][useNumberNew]['dimension']  )+'')]] +' / '+scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['element'].attributes[$rootScope.attributeOptions['alias'][((  scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['dimension']  )+'')]]
              }else{
                return scope.dataset.headers[0]['columns'][useNumberNew]['element'].attributes[$rootScope.attributeOptions['alias'][((  scope.dataset.headers[0]['columns'][useNumberNew]['dimension']  )+'')]]  ;

              }
                
             
            }else{
             
               if(scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['element']['attributes']['Caption_Default'] ){
                if(scope.dataset.headers.length-1 != 0){
                  return scope.dataset.headers[0]['columns'][useNumberNew]['element']['attributes']['Caption_Default'] +' / '+scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['element'].attributes['Caption_Default']
                }else{
                  return scope.dataset.headers[0]['columns'][useNumberNew]['element']['attributes']['Caption_Default']
  
                }  
                 
               }else{
                if(scope.dataset.headers.length-1 != 0){
                  return scope.dataset.headers[0]['columns'][useNumberNew]['element'].key +' / '+scope.dataset.headers[scope.dataset.headers.length-1]['columns'][useNumberNew]['element'].key
                }else{
                  return  scope.dataset.headers[0]['columns'][useNumberNew]['element'].key
  
                }  
                  
                
               }
               
               
            }
            
          }

            scope.formatUploadButton = function(){
                
                if(document.getElementsByClassName('tm1-ui-export').length){
                   // console.log(document.getElementsByClassName('tm1-ui-export')[0].innerHTML)
                   
                    for(ff = 0; ff < document.getElementsByClassName('tm1-ui-export').length; ff++){
                         
                        document.getElementsByClassName('tm1-ui-export')[ff].innerHTML = (document.getElementsByClassName('tm1-ui-export')[ff].innerHTML+'').split('Excel').join('');
                        document.getElementsByClassName('tm1-ui-export')[ff].innerHTML = (document.getElementsByClassName('tm1-ui-export')[ff].innerHTML+'').split('CSV').join('');
                        document.getElementsByClassName('tm1-ui-export')[ff].innerHTML = (document.getElementsByClassName('tm1-ui-export')[ff].innerHTML+'').split(' | ').join('');
                        document.getElementsByClassName('tm1-ui-export')[ff].text = '';
                        if(ff === document.getElementsByClassName('tm1-ui-export').length-1){
                            scope.scexcelReformated = true;
                        }
                    }
                    
                }
            }
           
            scope.getTableWidth = function(){
                 return scope.tableWidth ;
                
         
            }
            scope.getTableWidthinPx = function(){
                if(document.getElementById('stickyContainer'+scope.tableId)){
                  if(scope.tableDimensionLength >0){
                    return document.getElementById('stickyContainer'+scope.tableId).getBoundingClientRect().width +(scope.getContainerWidth('rowHieghtElement'+(scope.tableId+'')+0+'-'+0)*(scope.tableDimensionLength)) ;
                  }else{
                    return document.getElementById('stickyContainer'+scope.tableId).getBoundingClientRect().width +(scope.getContainerWidth('rowHieghtElement'+(scope.tableId+'')+0+'-'+0)) ;
                  }
                    
                }
                 
            }
         
               
              scope.getContainerWidth = function(idName){
                  if(document.getElementById(idName)){
                      var tempObj = document.getElementById(idName);
                      if(tempObj != null || tempObj != undefined ){
                          return tempObj.getBoundingClientRect().width;
                      }
                  }
                  
           
              }
              scope.getContainerLeft = function(idName){
                if(document.getElementById(idName)){
                    var tempObj = document.getElementById(idName);
                    if(tempObj != null || tempObj != undefined ){
                        return tempObj.getBoundingClientRect().left;
                    }
                }
                
         
            }
           
              scope.getContainerHeight = function(idName){
                  if(document.getElementById(idName)){
                      var tempObjTwo = document.getElementById(idName);
                      if(tempObjTwo != null || tempObj != undefined ){
                          return tempObjTwo.getBoundingClientRect().height;
                      }
                  }
              }
              scope.addContainerHeight = function(className){
                if( document.getElementById(className)){
                  if(document.getElementById(className).length){
                    var tempObjTwoArray = document.getElementById(className);
                    var sumNum = 0;
                    for(var tthh = 0;  tthh < tempObjTwoArray.length; tthh++){
                      sumNum += tempObjTwoArray[tthh].getBoundingClientRect().height();
                           
                   
                    }
                    return sumNum;
                     
                }
                }
                
            }
              scope.getContainerTop = function(id){
                  if(document.getElementById(id)){
                      var tempObjTop = document.getElementById(id);
                      if(tempObjTop != null || tempObjTop != undefined ){
                          return tempObjTop.getBoundingClientRect().top;
                      }
                  }
              }
              scope.setTableHeightChart= function(id){
                if(document.getElementById(id)){
                    var tempObjToTrack = document.getElementById(id);
                    if(tempObjToTrack != null || tempObjToTrack != undefined ){
                      if(scope.chartHeight){
                        scope.options.chart.height = scope.chartHeight;
                      }else{
                        scope.options.chart.height = window.innerHeight/2;
                     
                      }
                   }
                }
             }
            scope.setTableHeight = function(id){
                if(document.getElementById(id)){
                    var tempObjToTrack = document.getElementById(id);
                    if(tempObjToTrack != null || tempObjToTrack != undefined ){
                      if(scope.tableHeight  && $rootScope.tablesHeight != 0){
                        return (((( scope.tableHeight))));
                      }else{
                        return ((((window.innerHeight  ) - (scope.tableHeightBottomOffset)) - tempObjToTrack.getBoundingClientRect().top));
                    
                      }
                    }
                }
              }
            scope.workOutContainerHeight = function(id){
               
                         
                        if(document.getElementById(id)  ){
                        // console.log(((document.getElementById(id).getBoundingClientRect().height - document.getElementById(id).getElementsByClassName('fixed-container')[0].getBoundingClientRect().height)  +  Math.abs(scope.scrollAmountTop) ))
                               // return  ((document.getElementById(id).getBoundingClientRect().height - document.getElementById(id).getElementsByClassName('fixed-container')[0].getBoundingClientRect().height)  +  Math.abs(scope.scrollAmountTop) )+'px';
                             
                        }
                    
                
            }
               scope.toggleRow = function(){
                   for(row in scope.tableData){
                       var obbj = scope.tableData[row];
           
                               //console.log(obbj['elements'][0]['element']); 
                               scope.tableData[row]['elements'][0]['element'].toggle()
                             
                   }
                   scope.table.refresh();
                }
                scope.saveValue = function(value, id){
                    var sendValue = [];
                    

                        var tempO = document.getElementById(id)
                        
                        var request = {
                            value: value, 
                            instance:scope.tm1Instance, 
                            cube: scope.cubeName, 
                            cubeElements:(scope.focusedInputElementArray).split(',') 
                            }
                            sendValue.push(request);
                              console.log(request, "######## saved")
                            $tm1Ui.cellsetPut(sendValue).then(function(result){
                              
                                 if(result.success){
                                   console.log(result, "######## saved")
                                    if(scope.api){
                                      scope.api.refresh()
                                    }
                                    
                                       
                                        scope.refreshNew(scope.dataset);
                                     
                                   

                                 }else{
                    
                                 }
                            });
                 
                    
                     

                }
                scope.sendCellSetPutArray = [];
                
                scope.handlePaste = function($event) {
                   var clipboardData, pastedData;
                   var mainArrayObj = [];
                   scope.sendCellSetPutArray = [];
                   // Stop data actually being pasted into div
                   $event.stopPropagation();
                   $event.preventDefault();
                 //console.log(scope.focusObj)
                   var startRow = (scope.focusObj+'').split('-')[2];
                   var columnRow = (scope.focusObj+'').split('-')[3];
                   // Get pasted data via clipboard API
                   
                   clipboardData = $event.clipboardData || window.clipboardData || $event.originalEvent.clipboardData;
                    if(clipboardData ){
                    pastedData = clipboardData.getData('Text');
                    newpasteDataArray = pastedData.split(String.fromCharCode(13));

                    // split rows into columns
                
                    
                    //var newpasteDataArray = (pastedData).split(/\r\n|\r|\n/g)
                    
                    // Do whatever with pasteddata
                    for (i=0; i<newpasteDataArray.length; i++) {
                        
                        newpasteDataArray[i] = (newpasteDataArray[i]).split(String.fromCharCode(9));
                         
                    }
                     
                    for (pp=0; pp<newpasteDataArray.length; pp++) {
                        
                       var aray = newpasteDataArray[pp]
                       
                        for (cell=0; cell< aray.length; cell++) {

                             if(document.getElementById('input-'+scope.tableId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))){
                                var tempElement = document.getElementById('input-'+scope.tableId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))
                                 //console.log((parseInt(startRow)+parseInt(item)), (parseInt(columnRow)+parseInt(cell)), aray[cell] )
                               // console.log(tempElement);
                                if(tempElement != undefined && tempElement != null){
                                    //console.log(tempElement.getAttribute("cellref") );
                                    var elementArrayToUse = tempElement.getAttribute("cellref")
                                    scope.addRequest(aray,cell,tempElement)
                                }else{
                                row = scope.nextAvailable(parseInt(startRow)+parseInt(pp), (parseInt(columnRow)+parseInt(cell)) )
                                if(row === 'none'){
                
                                }else{
                                        var tempElement = document.getElementById('input-'+scope.tableId+'-'+(row)+'-'+(parseInt(columnRow)+parseInt(cell)))
                                        if(tempElement != undefined && tempElement != null){
                                        scope.addRequest(aray,cell,tempElement)
                                        }
                                }
                                
                                }
                             }
                             
                             
                             
                        }
                         
                    }
            
                    $tm1Ui.cellsetPut(scope.sendCellSetPutArray).then(function(result){
                        // console.log(result, "######## saved")
                         if(result.success){
                             
                            
                            scope.refreshNew(scope.dataset);
                
                         }else{
            
                         }
                    });
                   }
                   
           
                    
           }
           scope.handlePasteText = function($event) {
            var clipboardData, pastedData;
            var mainArrayObj = [];
            scope.sendCellSetPutArray = [];
            // Stop data actually being pasted into div
            $event.stopPropagation();
            $event.preventDefault();
          //console.log(scope.focusObj)
            var startRow = (scope.focusObj+'').split('-')[2];
            var columnRow = (scope.focusObj+'').split('-')[3];
            // Get pasted data via clipboard API
            
            clipboardData = $event.clipboardData || window.clipboardData || $event.originalEvent.clipboardData;
            if(clipboardData ){
              newpasteDataArray = [];
             pastedData = clipboardData.getData('Text');
             newpasteDataArray = pastedData.split(String.fromCharCode(13));

             // split rows into columns
         
             
             //var newpasteDataArray = (pastedData).split(/\r\n|\r|\n/g)
             
             // Do whatever with pasteddata
             for (i=0; i<newpasteDataArray.length; i++) {
                 
                 newpasteDataArray[i] = (newpasteDataArray[i]).split(String.fromCharCode(9));
                  
             }
              
             for (pp=0; pp<newpasteDataArray.length; pp++) {
                 
                var aray = newpasteDataArray[pp]
                
                 for (cell=0; cell< aray.length; cell++) {

                      if(document.getElementById('input-'+scope.tableId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))){
                         var tempElement = document.getElementById('input-'+scope.tableId+'-'+(parseInt(startRow)+parseInt(pp))+'-'+(parseInt(columnRow)+parseInt(cell)))
                          //console.log((parseInt(startRow)+parseInt(item)), (parseInt(columnRow)+parseInt(cell)), aray[cell] )
                        // console.log(tempElement);
                         if(tempElement != undefined && tempElement != null){
                             //console.log(tempElement.getAttribute("cellref") );
                             var elementArrayToUse = tempElement.getAttribute("cellref")
                             scope.addRequest(aray,cell,tempElement)
                         }else{
                         row = scope.nextAvailable(parseInt(startRow)+parseInt(pp), (parseInt(columnRow)+parseInt(cell)) )
                         if(row === 'none'){
         
                         }else{
                                 var tempElement = document.getElementById('input-'+scope.tableId+'-'+(row)+'-'+(parseInt(columnRow)+parseInt(cell)))
                                 if(tempElement != undefined && tempElement != null){
                                 scope.addRequest(aray,cell,tempElement)
                                 }
                         }
                         
                         }
                      }
                      
                      
                      
                 }
                  
             }
     
             $tm1Ui.cellsetPut(scope.sendCellSetPutArray).then(function(result){
                 // console.log(result, "######## saved")
                  if(result.success){
                      
                     
                     scope.refreshNew(scope.dataset);
         
                  }else{
     
                  }
             });
            }
            
    
             
    }
    $rootScope.setMdxId = function(mdxId, cube){
//console.log("setMdxId", mdxId, "indide the directive after the custom page is changed")
          scope.mdxId[scope.tableId] =  mdxId; 
          scope.cubeName = cube;
          scope.refresh(scope.cubeName,scope.cubeView);
        
      
    }
           scope.nextAvailable = function(row, col){
               var tempElementTwo = document.getElementById('input-'+scope.tableId+'-'+(row+1)+'-'+col )
               if(tempElementTwo === undefined && tempElementTwo === null){
                   tempElementThree = document.getElementById('input-'+scope.tableId+'-'+(row+2)+'-'+col )
                   if(tempElementThree === undefined && tempElementTwo === null){
                        return 'none'
                   }else{
                       return ((row)+2)
                   }
               }else{
                   return ((row)+1)
               }
           }
           scope.addRequest = function(aray,cell,tempElement){
               var request = {
                   value: aray[cell], 
                   instance:scope.tm1Instance, 
                   cube: scope.cubeName, 
                   cubeElements:(tempElement.getAttribute("cellref")+'').split(',') 
                   }
                   
                   scope.sendCellSetPutArray.push(request);
          }
           
           
          scope.dispatchResize = function(){
            $timeout(
                function(){
                  if(scope.tableHide){
                    if(scope.chartHeight){
                      scope.options.chart.height = ( scope.chartHeight);
                    }else{
                     scope.options.chart.height = (window.innerHeight/2);
                    }
                  }
                 
                
                  window.dispatchEvent(new Event('resize'));
                  $('#stickyContainer'+scope.tableId).animate({
                    scrollTop: 1
                 });
                 $('#stickyContainer'+scope.tableId).animate({
                  scrollLeft:  1
               });
                },1000
            )
             
                    
               
            
          }
          $(document).ready(function(){
            // Wrap each tr and td's content within a div
            // (todo: add logic so we only do this when printing)
            scope.refresh(scope.cubeName,scope.cubeView);
            scope.setUpFreezePane();
           
             //scope.dispatchResize();
            $timeout(
              function(){

                if(scope.tableHide){
                  if(scope.chartHeight){
                    scope.options.chart.height = ( scope.chartHeight);
                  }else{
                   scope.options.chart.height = (window.innerHeight/2);
                  }
                }
                if(scope.api){
                  scope.api.update();
                }
                
                $('#stickyContainer'+scope.tableId).animate({
                  scrollTop: 1
               });
               $('#stickyContainer'+scope.tableId).animate({
                scrollLeft:  1
             });
              },1000
            )
           
             scope.dragStated = false;
            
            

        })
        
        
        scope.increaseDataWidth = function(){
          scope.dataWidth += (20);
   //   console.log(scope.dataWidth , "stat drag");

        }
        scope.reduceDataWidth = function(){
          
           
          scope.dataWidth -= (20);
        //  console.log(scope.dataWidth , "stat drag");

        }
          scope.updateUrlChart = function(){
            $timeout(
              function(){
                if(scope.chartVisible  ){
                  
                   $location.search('chartView', 'true');
                }else{ 
                   
                  $location.search('chartView', 'false');
                }
              },100
            )
            
            

          }
          scope.updateUrlTable = function(decider){
           
              //   console.log(decider);
                 if(!decider){
                   $location.search('tableHide', decider+'');
                 }else{
                  $location.search('tableHide', 'true');
                 }
                   
               
            

          }
          
          scope.updateUrl = function(urlName, decider){
           
            //   console.log(decider);
               if(!decider){
                 $location.search(urlName, 'false');
               }else{
                 $location.search(urlName, 'true');
               }
                 
             
          

        }
        
          
          scope.drillNames = [];
           
          
          scope.getCellDrill = function(cubeElements){
            scope.drillNames = [];
            $tm1Ui.cellGetDrillNames(scope.tm1Instance,scope.cubeName,cubeElements).then(function(data){
                scope.tableDrillSource = [];
                scope.tableDrillCol = [];
                scope.datasetDrill= [];
                scope.tableDrill = [];
                 scope.drillNames = data;
               //console.log(data, "Transactional data")
                 $("#refModal"+scope.tableId).modal({show: true});
            });
           }
           scope.getDrillTable = function(cubeElements, name){
               scope.drillNameChosen = name;
                $tm1Ui.cellGetDrillNameTransactions(scope.tm1Instance,scope.cubeName, cubeElements, name).then(function(data){
                    if(data){
                        if(name === "Transactions"){
                            scope.datasetDrill = $tm1Ui.resultsetTransform(scope.tm1Instance, scope.cubeName, data);
                           
                            var options = {preload: false, watch: false,  index: 0, pageSize: scope.currentRowCount,   filter: scope.filter};
                            if(scope.tableDrill){
                                
                              //  options.pageSize = scope.tableDrill.options.pageSize;
                                    
                            }
                            scope.tableDrill = $tm1Ui.tableCreate(scope, scope.datasetDrill.rows, options);
                        
                            scope.tableDrill.pageSize(scope.rowsToLoad)
                        }else{
                            scope.tableDrillSource = [];
                            scope.tableDrillCol = [];
                           // scope.tableDrill = data.value;
                           _.forEach(data.value[0], function(colvalue, colkey) {
                            scope.tableDrillCol.push(colkey);
                            //console.log(rowkey, rowvalue);
                             
                            });
                            _.forEach(data.value, function(value, key) {
                                scope.tableDrillSource[key] = [];
                                scope.tableDrillSource[key] = value;
                                 
                            });
                        }
                      //console.log(data, "Transactional data")
                        //scope.datasetDrill = $tm1Ui.resultsetTransform(scope.tm1Instance, scope.cubeName, data);
                        //var optionsDrill = {preload: false, watch: false};
                        //if(scope.tableDrill){
                         //   optionsDrill.index = scope.tableDrill.options.index;
                          //  optionsDrill.pageSize = scope.tableDrill.options.pageSize;
                                
                        //}
                        //scope.tableDrill = $tm1Ui.tableCreate(scope, scope.datasetDrill.rows, optionsDrill);
                    
                       // scope.tableDrill.pageSize(1000)
                    }  
                
                });
           }
          
        scope.mouseUp = function(tableid, rowindex, colindex) {
          scope.dragging = false;
          scope.startCellTableId = tableid;
          //console.log(tableid, rowindex, colindex);
          
          // Select or deselect the all class switchers

          // Make sure that headers are not selected for weekdays
            
         
          // Make sure that headers are not selected for hours
         // scope.setEndCell(tableid, rowindex, colindex);
          

        }

        scope.mouseDown = function(tableid, rowindex, colindex, rowIndex) {
            scope.dragging = true;
            scope.startCellTableId = tableid;
            scope.setStartCell(tableid, rowindex, colindex, rowIndex);
            
            //console.log(tableid, rowindex, colindex);
            
             
            
        }

      
        scope.isKeyShift = false;
         scope.isKeyAlt = false;
        angular.element(document).bind('keydown', function (ev) {
          console.log( "Event Shift is pressed", 'DOWN' ,ev.key);
          $timeout(
            function(){
              if(ev.key ==="Shift"){
                scope.isKeyShift = true;
                
              }else{
                
                scope.isKeyShift = false;
              }
              if(scope.isKeyShift  && ev.key ==="Alt"){
                scope.isKeyAlt = true;
                //console.log("Alt is pressed Down")
              }else{
                
                scope.isKeyAlt = false;
              }
            }
          )
          
         
        });
        angular.element(document).bind('keyup', function (ev) {
          console.log( "Event Shift is pressed", "UP", ev.key);
          $timeout(
            function(){
          if(ev.key ==="Shift"){
            scope.isKeyShift = false;
            
          }else{
         
            scope.isKeyShift = false;
          }
          if(ev.key ==="Alt"){
            scope.isKeyAlt = false;
           // console.log("Alt is Up")
          }else{
            
            scope.isKeyAlt = false;
          }
        });
         
        });
        scope.mouseMove = function(tableid, rowindex, colindex, rowIndex) {
          if( scope.isKeyShift === true){
            scope.isKeyPressed(tableid, rowindex, colindex, rowIndex); 
          }else{
           
          }
        };

        scope.selectAllInRow = function(table,index, rowindex, decider){
          
          scope.selectedCellArray[index] = [];
         
              if(!decider){
                console.log(scope.selectedCellArray, "scope.selectedCellArrayscope.selectedCellArrayscope.selectedCellArray");
                scope.selectedCellArray[index].selected = true;
                if(scope.isKeyShift === true){
                  scope.isKeyPressed(table,index,(scope.table.data()[row].cells.length)-1 ,rowindex)
                }else{
                  scope.startCellRowIndex =  index;
                  scope.startCellColIndex =  0;
                  scope.startRowIndex = rowindex;
                  scope.isKeyShift = true;
                  
                 
                }
              
                
                
              }else{
                scope.selectedCellArray[index].selected = null;
                scope.startCellRowIndex =  null;
                scope.startCellColIndex =  null;
                scope.startRowIndex = null;
                  
                scope.isKeyShift = false;
               
                scope.mouseUp(table,index,(scope.table.data()[row].cells.length)-1 ,rowindex)
                 
                  
                    
                
              }
              
              $timeout(
                function(){
                  scope.exportF(); 
                    scope.isKeyShift = false;
                },100
              )
           
          
       
        }
       

        
       
        scope.isKeyPressed = function(tableid, rowindex, colindex, rowIndex){
          scope.startCellTableId = tableid;
          scope.arrayCellsSelected = []; 	
          scope.selectedCellArray = []; 
          scope.arrayRowSelected = [];

          if( scope.isKeyShift === true ){
              
            scope.arrayCellsSelected.pop();
            scope.setEndCell(tableid, rowindex, colindex, rowIndex);
            console.log(rowIndex, "row index @@@@@@@@@@@@@@@@@");
            //console.log( "Event Shift is pressed", scope.startRowIndex,scope.endRowIndex,  "start", scope.startCellTableId, scope.startCellRowIndex, scope.startCellColIndex,"     End: " ,scope.endCellTableId, scope.endCellRowIndex, scope.endCellColIndex, );
            for(row in scope.table.data()){
              var rowInd = scope.table.data()[row]['index'];
             
              scope.selectedCellArray[row] = [];
              scope.arrayRowSelected[row] = [];
              scope.arrayRowSelected[row].selected = false;
              if(parseInt(scope.startCellRowIndex) < parseInt(scope.endCellRowIndex) ){
                // is start selected row lower than end
               
                if(parseInt(row) >=  parseInt(scope.startCellRowIndex) && parseInt(row)  <= parseInt(scope.endCellRowIndex) && parseInt(scope.endCellColIndex) >= parseInt(scope.startCellColIndex)   ){
                  // need to take in values in another way
                  scope.arrayCellsSelected.push(scope.table.data()[row]['elements'][0].alias);
                  for(col in scope.table.data()[row].cells){
                    scope.selectedCellArray[row][col] = [];
                    scope.selectedCellArray[row][col].selected = false;
                
                    if(parseInt(scope.startCellRowIndex) != parseInt(scope.endCellRowIndex)){
                     
                      if( parseInt(row) != parseInt(scope.startCellRowIndex) && parseInt(row) != parseInt(scope.endCellRowIndex) ){ 
                        //console.log(scope.table.data()[row].cells[col].value, row, col)
                       
                            if(parseInt(col) >= parseInt(scope.startCellColIndex)  && parseInt(col) <= parseInt(scope.endCellColIndex)    ){
                              // console.log(scope.table.data()[row].cells[col].value, row, col)
                              scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                              scope.selectedCellArray[row][col].selected = true;
                              scope.arrayRowSelected[row].selected = true;
                            }else{

                            }
                          
                      }else{
                        
                      if(parseInt(col) >= parseInt(scope.startCellColIndex)  && parseInt(col) <= parseInt(scope.endCellColIndex)   && parseInt(row) === parseInt(scope.startCellRowIndex) ){
                      // console.log(scope.table.data()[row].cells[col].value, row, col)
                          scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                          scope.selectedCellArray[row][col].selected = true;
                          scope.arrayRowSelected[row].selected = true;
                      }else{
                        if( parseInt(col) >= parseInt(scope.startCellColIndex)  && parseInt(col) <= parseInt(scope.endCellColIndex)   && parseInt(row) === parseInt(scope.endCellRowIndex) ){
                          // console.log(scope.table.data()[row].cells[col].value, row, col)
                          scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                          scope.selectedCellArray[row][col].selected = true;
                          scope.arrayRowSelected[row].selected = true;
                        } 
                      }
                    }
                  }else{
                    console.log(parseInt(scope.startCellRowIndex), parseInt(scope.endCellRowIndex), "if startrow == endrow");
                    if(parseInt(col) >= parseInt(scope.startCellColIndex) && parseInt(col) <= parseInt(scope.endCellColIndex)  ){
                    // console.log(scope.table.data()[row].cells[col].value, row, col)
                    scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                    scope.selectedCellArray[row][col].selected = true;
                    scope.arrayRowSelected[row].selected = true;
                    } 

                  } 
                }
                }else{
                  if(parseInt(row) >=  parseInt(scope.startCellRowIndex) && parseInt(row)  <= parseInt(scope.endCellRowIndex) && parseInt(scope.endCellColIndex) < parseInt(scope.startCellColIndex)   ){
                    scope.arrayCellsSelected.push(scope.table.data()[row]['elements'][0].alias);
                    for(col in scope.table.data()[row].cells){
                      scope.selectedCellArray[row][col] = [];
                      scope.selectedCellArray[row][col].selected = false;
                  
                      if(parseInt(scope.startCellRowIndex) != parseInt(scope.endCellRowIndex)){
                       
                        if( parseInt(row) != parseInt(scope.startCellRowIndex) && parseInt(row) != parseInt(scope.endCellRowIndex) ){ 
                          //console.log(scope.table.data()[row].cells[col].value, row, col)
                         
                              if(parseInt(col) <= parseInt(scope.startCellColIndex)  && parseInt(col) >= parseInt(scope.endCellColIndex)    ){
                                // console.log(scope.table.data()[row].cells[col].value, row, col)
                                scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                                scope.selectedCellArray[row][col].selected = true;
                                scope.arrayRowSelected[row].selected = true;
                              }else{
  
                              }
                            
                        }else{
                          
                        if(parseInt(col) <= parseInt(scope.startCellColIndex)  && parseInt(col) >= parseInt(scope.endCellColIndex)   && parseInt(row) === parseInt(scope.startCellRowIndex) ){
                        // console.log(scope.table.data()[row].cells[col].value, row, col)
                            scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                            scope.selectedCellArray[row][col].selected = true;
                            scope.arrayRowSelected[row].selected = true;
                        }else{
                          if( parseInt(col) <= parseInt(scope.startCellColIndex)  && parseInt(col) >= parseInt(scope.endCellColIndex)   && parseInt(row) === parseInt(scope.endCellRowIndex) ){
                            // console.log(scope.table.data()[row].cells[col].value, row, col)
                            scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                            scope.selectedCellArray[row][col].selected = true;
                            scope.arrayRowSelected[row].selected = true;
                          } 
                        }
                      }
                    }else{
                      console.log(parseInt(scope.startCellRowIndex), parseInt(scope.endCellRowIndex), "if startrow == endrow");
                      if(parseInt(col) >= parseInt(scope.startCellColIndex) && parseInt(col) <= parseInt(scope.endCellColIndex)  ){
                      // console.log(scope.table.data()[row].cells[col].value, row, col)
                      scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                      scope.selectedCellArray[row][col].selected = true;
                      scope.arrayRowSelected[row].selected = true;
                      } 
  
                    } 
                  }
                  }
                  
                }
              }else{
             
                if( parseInt(scope.endCellRowIndex) < parseInt(scope.startCellRowIndex)  ){
                 
                //is start selected row is higher than end
                if(parseInt(row) >= parseInt(scope.endCellRowIndex) && parseInt(row) <= parseInt(scope.startCellRowIndex ) && parseInt(scope.endCellColIndex) <= parseInt(scope.startCellColIndex)  ){
                  
                  for(col in scope.table.data()[row].cells){
                    scope.selectedCellArray[row][col] = [];
                    
                    scope.selectedCellArray[row][col].selected = false;
                    
                      if( parseInt(row) != parseInt(scope.endCellRowIndex) && parseInt(row) != parseInt(scope.startCellRowIndex)    ){ 
                        
                        if(parseInt(col) <= parseInt(scope.startCellColIndex)  && parseInt(col) >= parseInt(scope.endCellColIndex)    ){
                            //console.log(scope.table.data()[row].cells[col].value, row, col)
                            
                            scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                            scope.selectedCellArray[row][col].selected = true;
                            scope.arrayRowSelected[row].selected = true;
                        } 
                      }else{
                        
                        if( parseInt(row) === parseInt(scope.endCellRowIndex) && parseInt(col) >= parseInt(scope.endCellColIndex) && parseInt(col) <= parseInt(scope.startCellColIndex)   ){
                        // console.log(scope.table.data()[row].cells[col].value, row, col)
                            scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                            scope.selectedCellArray[row][col].selected = true;
                            scope.arrayRowSelected[row].selected = true;
                        }else{
                          if(  parseInt(row) === parseInt(scope.startCellRowIndex) && parseInt(col) <= parseInt(scope.startCellColIndex) && parseInt(col) >= parseInt(scope.endCellColIndex)  ){
                            // console.log(scope.table.data()[row].cells[col].value, row, col)
                            scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                            scope.selectedCellArray[row][col].selected = true;
                            scope.arrayRowSelected[row].selected = true;
                          }
                        }
                      }
                    } 
                  }else{
                    if(parseInt(row) >= parseInt(scope.endCellRowIndex) && parseInt(row) <= parseInt(scope.startCellRowIndex ) && parseInt(scope.endCellColIndex) >= parseInt(scope.startCellColIndex)  ){
                      
                      
                        for(col in scope.table.data()[row].cells){
                        scope.selectedCellArray[row][col] = [];
                        
                        scope.selectedCellArray[row][col].selected = false;
                        
                          if( parseInt(row) != parseInt(scope.endCellRowIndex) && parseInt(row) != parseInt(scope.startCellRowIndex)    ){ 
                            
                            if(parseInt(col) >= parseInt(scope.startCellColIndex)  && parseInt(col) <= parseInt(scope.endCellColIndex)    ){
                                //console.log(scope.table.data()[row].cells[col].value, row, col)
                                
                                scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                                scope.selectedCellArray[row][col].selected = true;
                                scope.arrayRowSelected[row].selected = true;
                            } 
                          }else{
                            
                            if( parseInt(row) === parseInt(scope.endCellRowIndex) && parseInt(col) >= parseInt(scope.startCellColIndex) && parseInt(col) <= parseInt(scope.endCellColIndex)   ){
                            // console.log(scope.table.data()[row].cells[col].value, row, col)
                                scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                                scope.selectedCellArray[row][col].selected = true;
                                scope.arrayRowSelected[row].selected = true;
                            }else{
                              if(  parseInt(row) === parseInt(scope.startCellRowIndex) && parseInt(col) >= parseInt(scope.startCellColIndex) && parseInt(col) <= parseInt(scope.endCellColIndex)  ){
                                // console.log(scope.table.data()[row].cells[col].value, row, col)
                                scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                                scope.selectedCellArray[row][col].selected = true;
                                scope.arrayRowSelected[row].selected = true;
                              }
                            }
                          }
                        } 


                    }
                  }
                }else{
                  console.log('start =  end');
                  //even start selected and finish row
                  if( parseInt(row) === parseInt(scope.startCellRowIndex) && parseInt(row) === parseInt(scope.endCellRowIndex)   ){
                    for(col in scope.table.data()[row].cells){
                      scope.selectedCellArray[row][col] = [];
                      scope.selectedCellArray[row][col].selected = false;
                     
                    
                      if(parseInt(scope.startCellColIndex)  <= parseInt(scope.endCellColIndex)  ){
                        if(parseInt(col) >= parseInt(scope.startCellColIndex) && parseInt(col) <= parseInt(scope.endCellColIndex) ){
                          // console.log(scope.table.data()[row].cells[col].value, row, col)
                              scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                              scope.selectedCellArray[row][col].selected = true;
                              scope.arrayRowSelected[row].selected = true;
                          } 
                      }else{
                        if(parseInt(scope.startCellColIndex) > parseInt(scope.endCellColIndex)  ){
                          if(parseInt(col) >= parseInt(scope.endCellColIndex) && parseInt(col) <= parseInt(scope.startCellColIndex)     ){
                          // console.log(scope.table.data()[row].cells[col].value, row, col)
                              scope.arrayCellsSelected.push(scope.table.data()[row].cells[col].value);
                              scope.selectedCellArray[row][col].selected = true;
                              scope.arrayRowSelected[row].selected = true;
                          }
                        }
                      }  
                    }
                  }
                }
              } 
            }
          } 
          //scope.writeClipboard( scope.arrayCellsSelected );
          //console.log(scope.arrayCellsSelected, scope.selectedCellArray)
          if(scope.arrayCellsSelected.length > 0 && scope.arrayCellsSelected.length  ){
            scope.exportF(); 
          }else{ 
          }
         
        }
        scope.exportF = function(elem) {
            var table = document.getElementById('excelCopy');
            var html = table.outerHTML;
            //var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
            scope.writeClipboard( html);
            //window.open(url);
             

           // return false;
          
        }
        scope.writeClipboard = function(text){
            
              if (!navigator.clipboard) {
                //fallbackCopyTextToClipboard(text);
                return;
              }
              
              navigator.clipboard.writeText(text).then(function() {
                console.log('Async: Copying to clipboard was successful!');
              }, function(err) {
                console.error('Async: Could not copy text: ', err);
              });
          
        }
        scope.setStartCell = function(tableid, rowindex, colindex, rowIndex) {
            if( scope.isKeyShift === true){
          
            }else{
              scope.startCellTableId = tableid;
              scope.startCellRowIndex =  rowindex;
              scope.startCellColIndex =  colindex;
              scope.startRowIndex = rowIndex;
            }
              // (1) determine if we're removing or adding based on the start cell
              //isRemoving = el.hasClass(cls);
        }

        scope.mouseEnter = function(tableid, rowindex, colindex, rowIndex) { 
            if (!scope.dragging){
              return; 
            }else{
              scope.setEndCell(tableid, rowindex, colindex, rowIndex); 
            }
        }


        scope.setEndCell = function(tableid, rowindex, colindex, rowIndex) {
              
              scope.endCellTableId = tableid;
              scope.endCellRowIndex =  rowindex;
              scope.endCellColIndex =  colindex;
              scope.endRowIndex = rowIndex;
              //console.log(tableid, rowindex, colindex, "element");
        }
          
        scope.goToNewPage = function(url){
            location.assign(url)
        }
        scope.rowsToDisplay = function(){
            var count = 0;
            var obg = scope.table.data();
            var arrayOfAliasAndNames = [];
            for(row in obg){
                
                if(obg[row].elements[0].element.attributes['Description']){
                      arrayOfAliasAndNames = obg[row].elements[0].element.attributes['Description'].toLowerCase()+" "+obg[row].elements[0].element.name +''+obg[row].elements[0].element.alias;
                }else{
                    arrayOfAliasAndNames = ""+obg[row].elements[0].element.name+" ";
                }
                  
                if(scope.selections.searchRows[scope.tableId] && (arrayOfAliasAndNames).indexOf((scope.selections.searchRows[scope.tableId]).toLowerCase()) > -1){
                    
                    count++;
                    // console.log("rows to display",  arrayOfAliasAndNames, (arrayOfAliasAndNames).indexOf((scope.selections.searchRows[scope.tableId]).toLowerCase()) );
                }else{
                    
                }
            }
            
            return count;
        }
        

        $(window).resize(function() { 
          if( scope.api){
            scope.api.refresh()
          }
          if(scope.chartVisible  ){
            if(scope.chartHeight){
              scope.offsetTop = (( scope.chartHeight));
            }else{
              scope.offsetTop = ((window.innerHeight /2));
            }
            

          }else{
            scope.offsetTop = 1;
          }
          
                    scope.innerHeight = window.innerHeight;
                    scope.innerWidth =  window.innerWidth;
            
        });
        
        scope.$watch(function () {
        return $attributes.attributeOptions;
        
        }, function (newValue, oldValue) { 
            if(newValue != oldValue && oldValue != 'undefined' && oldValue != null){
            //console.log(newValue, "attribute changes inside directive");
              scope.attributeOptions = newValue;
              scope.refresh(scope.cubeName, scope.cubeView)
            }
            
                    
        })

        scope.$watch(function () {
        return $attributes.cubeMdxParams;
        
        }, function (newValue, oldValue) { 
          if(newValue != oldValue && oldValue != 'undefined' && oldValue != null){
          //   console.log(newValue, "mdx attributes changed inside directive");
              
              scope.cubeMdxParams = JSON.parse(newValue)
              scope.refresh(scope.cubeName, scope.cubeMdx)
          }
                    
        })

        scope.$watch(function () {
          return $attributes.tableWidth;
          
        }, function (newValue, oldValue) { 
            if(newValue != oldValue && oldValue != 'undefined' && oldValue != null){
              //console.log(newValue, "Year changes inside directive");

            }
            
                      
        })
        scope.$watch(function () {
            return $attributes.cubeView;
            
            }, function (newValue, oldValue) { 
                if(newValue != oldValue && oldValue != 'undefined' && oldValue != null){
                  //console.log(newValue, "cube View has changed inside watch");
                    scope.cubeView = newValue;
                    scope.selections.searchRows[scope.tableId] = '';
                    if($rootScope.isPrinting){
                      scope.currentRowCount = 10000;
                      
                      }else{
                      scope.currentRowCount = scope.rowsToLoad;
                      }
                    scope.refresh(scope.cubeName, newValue);
                }
                
                        
          })

        scope.$watch(function () {
          return $attributes.cubeName;
          
          }, function (newValue, oldValue) { 
              if(newValue != '' && newValue != oldValue && oldValue != 'undefined' && oldValue != null){
                //console.log(newValue, "cube Name has changed inside watch");
                  scope.cubeName = newValue;
                  $location.search('cubeName', newValue); 
                  scope.selections.searchRows[scope.tableId] = '';
                  if($rootScope.isPrinting){
                  scope.currentRowCount = 10000;
                  }else{
                  scope.currentRowCount = scope.rowsToLoad;
                  }
                  
                  scope.refresh(newValue, scope.cubeView)
              }
              
                      
        })
 
      }           
    };
  }]);

})();
