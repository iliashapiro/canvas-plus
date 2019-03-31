(function(){
        var app = angular.module('app');
        app.directive('superCubeView', ['$log','$rootScope','$tm1Ui', '$timeout', function($log, $rootScope, $tm1Ui, $timeout ) {
            return {
                templateUrl: 'html/SuperCubeView.html',
                scope:{
                    tm1Instance: '@',  
                    cubeName:'@',
                    cubeView:'@',
                    attributeOptions:'@'
                   
                }, 
                link:function(scope, $elements, $attributes, directiveCtrl, transclude){
                    scope.defaults = {  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
                    monthkey: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
                };
                scope.selections = {};
                scope.firstDayPosition = {};
                scope.tm1Instance = $attributes.tm1Instance;
                scope.cubeView = $attributes.cubeView;
                scope.cubeName = $attributes.cubeName;
                scope.attributeOptions = $attributes.attributeOptions;
                
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
                scope.refreshNew = function(newdataset){ 
                    $timeout( 
                        function(){
                            $rootScope.isLoading = true;
                            $tm1Ui.cubeExecuteView(scope.tm1Instance,scope.cubeName, scope.cubeView).then(function(result){
                                if(!result.failed){
                                   scope.datasetNew =    $tm1Ui.resultsetTransform(scope.tm1Instance, scope.cubeName, result, scope.attributeOptions);
                                      
                                    scope.dataset = newdataset;
                                       var options = {preload: false, watch: false};
                                        
                                       scope.tableNew = $tm1Ui.tableCreate(scope, scope.datasetNew.rows, options);
                                       scope.tablerowLength = scope.table.data().length;
                                       if(scope.tablerowLength > 500){
                                            scope.tableNew.pageSize(50)
                                       }else{
                                            scope.tableNew.pageSize(1000)
                                       }
                                       
                                      // console.log(scope.table.data(), scope.tableNew.data());  
                                       var tableRows = scope.table.data();
                                        for(newrow in scope.tableNew.data()){
                                            for(row in scope.table.data()){
                                                if(scope.tableNew.data()[newrow].index === scope.table.data()[row].index){
                                                  // console.log(scope.tableNew.data()[newrow].cells, "same row");
                                                   scope.table.data()[row].cells = scope.tableNew.data()[newrow].cells;
                                                } 
                                            }
                                        }
                                       scope.getLastFocus(); 
                                } else {
                                   scope.message = result.message; 
                               }	$rootScope.isLoading = false;
                              
                           })
                        },500
                    )
                }
           
                scope.getFocus = function($event) {           
                   scope.focusObj = $event.target.id;
                   document.getElementById($event.target.id).addEventListener('paste', scope.handlePaste);
                   console.log("add paste event listener",$event.target.id)
                }

                scope.getLastFocus = function() {  
                    if(document.getElementById(scope.focusObj)){
                       document.getElementById(scope.focusObj).focus(); 
                    }  
                }
                scope.lostFocus = function($event) {  

                   var focusObjOut = $event.target.id;
                   scope.focusObj = ''; 
                   document.getElementById(focusObjOut).removeEventListener('paste', scope.handlePaste);
           
                }   
           
                scope.getContainerWidthClass = function(idName){
                    if(document.getElementsByClassName(idName).length > 0){
                        var tempObj = document.getElementsByClassName(idName)[0];
                        if(tempObj != null || tempObj != undefined ){
                           return tempObj.getBoundingClientRect().width;
                        }
                    } 
                }
           
           
                scope.cellreferneceArray = [];
                scope.dimensionArray = [];
                scope.openRefModel = function(elementString){
                   scope.cellreferneceArray = (elementString+'').split(',')
                   $tm1Ui.cubeDimensions(scope.tm1Instance,scope.cubeName).then(function(result){
                       scope.dimensionArray = result;
                       $("#refModal").modal({show: true});  
                   })
                     
                }
                scope.tablerowLength = 0;
                scope.refresh = function(){
                        $timeout(
                           function(){
                               $rootScope.isLoading = true;
                               $tm1Ui.cubeExecuteView(scope.tm1Instance,scope.cubeName, scope.cubeView).then(function(result){
                                   if(!result.failed){
                                    $rootScope.isLoading = false;
                                       scope.dataset = $tm1Ui.resultsetTransform(scope.tm1Instance, scope.cubeName, result, scope.attributeOptions);
                                       var options = {preload: false, watch: false};
                                       if(scope.table){
                                           options.index = scope.table.options.index;
                                           options.pageSize = scope.table.options.pageSize;
                                            
                                       }
                                        scope.table = $tm1Ui.tableCreate(scope, scope.dataset.rows, options);
                                        scope.tablerowLength = scope.table.data().length;
                                         
                                        if(scope.tablerowLength > 500){
                                            scope.table.pageSize(50)
                                       }else{
                                            scope.table.pageSize(1000)
                                       }   
                                            
                                       
                                        scope.loading = false;
                                        console.log("loadded new from old rows")
                                        scope.table.refresh();
                                       //scope.tableData = scope.table.data();
                                        
                                   } else {
                                       scope.message = result.message;
                                       scope.loading = false;
                                       $rootScope.isLoading = false;
                                   }		
                                  
                               })
                           },2000
                    )
                        
                }
                scope.tableData = [];
                scope.tableRowCollapseData = [];
                scope.collapsedRowArray = [];
                scope.refresh();
                
                scope.seeNewData = function(data){
                    console.log(data)
                }
                scope.getColType = function(data){
                    return data;
                }
                
                scope.seeData = function(rowindex,table){
                    
                   scope.dataset.rows[(rowindex)]['Account']['element'].toggle();
                   scope.table.refresh();
                   scope.refreshNew(scope.dataset);
            
                };
               
                 
           
           
                
              angular.element(document.querySelector('#stickyContainer')).bind('scroll', function(){
                scope.offsetTop = 0;
                var el = $('#stickyContainer');
                $body = $(el);  
                $stickyHeader = $(el).find('#sticky-header');
                $fixedHeader = $(el).find('.fixed-container');
                $fixedFirstColHeader = $(el).find('.fixedFirstColHeader');
                //$headerContent = $(el).find('#headerContent');
                $sideContent = $(el).find('#sideContent');           
                scope.scrolling = true;
                $($stickyHeader).css('display','block'); 
                $($sideContent).css('display', 'block');
                     var valuetoEval = scope.offsetTop;
               
                
                    if($($body).scrollTop() >= parseInt(valuetoEval) || $($body).scrollLeft() != 0){

                        scope.headerOutOffView = true;
                        console.log("view header")
                        $($stickyHeader).css('display','block'); 
                        $($stickyHeader).css('opacity','1'); 
                        $($stickyHeader).css('pointer-events','auto'); 
                        $($fixedHeader).css('pointer-events','auto'); 
                       
                          
                        $($sideContent).css('display', 'block');
                        $($sideContent).css('margin-top', -$($body).scrollTop());
                        $($fixedFirstColHeader).css('display','block !important'); 
                    }else{
                         
                        scope.headerOutOffView = false;
                        console.log("hide header")
                        $($stickyHeader).css('opacity','0'); 
                        $($stickyHeader).css('pointer-events','none'); 
                         $($fixedHeader).css('pointer-events','none'); 
                         
                         
                          $($fixedFirstColHeader).css('display','none !important'); 
                    } 
                     
                     $($stickyHeader).css('margin-left', -$($body).scrollLeft());
              });
           
              scope.getTableWidth = function(){
                 return window.innerWidth -20;
                
         
            }
         
               
              scope.getContainerWidth = function(idName){
                  if(document.getElementById(idName)){
                      var tempObj = document.getElementById(idName);
                      if(tempObj != null || tempObj != undefined ){
                          return tempObj.getBoundingClientRect().width;
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
              scope.getContainerTop = function(id){
                  if(document.getElementById(id)){
                      var tempObjTop = document.getElementById(id);
                      if(tempObjTop != null || tempObjTop != undefined ){
                          return tempObjTop.getBoundingClientRect().top;
                      }
                  }
              }
               
              scope.setTableHeight = function(id){
                  if(document.getElementById(id)){
                      var tempObjToTrack = document.getElementById(id);
                      if(tempObjToTrack != null || tempObjToTrack != undefined ){
                          return ((window.innerHeight - tempObjToTrack.getBoundingClientRect().top));
                      }
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
                scope.sendCellSetPutArray = [];
                scope.handlePaste = function(e) {
                   var clipboardData, pastedData;
                   var mainArrayObj = [];
                   // Stop data actually being pasted into div
                   e.stopPropagation();
                   e.preventDefault();
                   var startRow = (scope.focusObj+'').split('-')[1];
                   var columnRow = (scope.focusObj+'').split('-')[2];
                   // Get pasted data via clipboard API
                   clipboardData = e.clipboardData || window.clipboardData;
                   pastedData = clipboardData.getData('Text');
                   var newpasteDataArray = (pastedData).split(/\r\n|\r|\n/g)
                   // Do whatever with pasteddata
                   for(item in newpasteDataArray){
                       var tempal = (newpasteDataArray[item]).split('	');
           
                       mainArrayObj[item] = [tempal];
                   }
                   for(item in mainArrayObj){
                      // console.log(parseInt(startRow), parseInt(columnRow) )
                      var aray = (mainArrayObj[item]+'').split(',')
                       for(cell in aray){
                            
                           var tempElement = document.getElementById('input-'+(parseInt(startRow)+parseInt(item))+'-'+(parseInt(columnRow)+parseInt(cell)))
                           //console.log((parseInt(startRow)+parseInt(item)), (parseInt(columnRow)+parseInt(cell)), aray[cell] )
                           //console.log(tempElement.getAttribute("cellref") );
                           if(tempElement != undefined && tempElement != null){
                               //console.log(tempElement.getAttribute("cellref") );
                               scope.addRequest(aray,cell,tempElement)
                           }else{
                              row = scope.nextAvailable(parseInt(startRow)+parseInt(item), (parseInt(columnRow)+parseInt(cell)) )
                              if(row === 'none'){
           
                              }else{
                                   var tempElement = document.getElementById('input-'+(row)+'-'+(parseInt(columnRow)+parseInt(cell)))
                                   if(tempElement != undefined && tempElement != null){
                                   scope.addRequest(aray,cell,tempElement)
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
           scope.nextAvailable = function(row, col){
               var tempElementTwo = document.getElementById('input-'+(row+1)+'-'+col )
               if(tempElementTwo === undefined && tempElementTwo === null){
                   tempElementThree = document.getElementById('input-'+(row+2)+'-'+col )
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
            
                
               
                
           
               
         
                 
                scope.goToNewPage = function(url){
                    location.assign(url)
                }
                scope.rowsToDisplay = function(){
                    var count = 0;
                    for(row in scope.table.data()){
                        if(scope.selections.searchRows && ((scope.table.data()[row].elements[0].element.attributes['Description']).toLowerCase()).indexOf((scope.selections.searchRows).toLowerCase()) > -1){
                            console.log("rows to display");
                            count++;
                        }else{
                            
                        }
                    }
                    return count;
                }
                scope.dispatchResize = function(){
                    window.dispatchEvent(new Event('resize'));
                }

                $(window).resize(function() { 
                    
                            scope.innerHeight = window.innerHeight;
                            scope.innerWidth = window.innerWidth ;
                    
                });
                
 

                scope.$watch(function () {
                    return $attributes.cubeView;
                    
                    }, function (newValue, oldValue) { 
                        if(newValue != oldValue && oldValue != 'undefined' && oldValue != null){
                            console.log(newValue, "Year changes inside directive");
                        }
                       
                                
                    })
 
                }
            };
        }]);
        
   
})();