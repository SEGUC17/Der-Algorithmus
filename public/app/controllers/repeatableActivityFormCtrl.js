angular.module('repeatableActivityFormController',['businessActivitiesServices','fileModelDirective', 'fileUploadService'])

.controller('repeatableActivityFormCtrl',function($scope,$route, $routeParams,BusinessActivities,fileUpload){


   $scope.slots = [{id: 'slot1'}];
   $scope.pricePackages=[{id: 'pricePackage1'}];

   $scope.addNewSlot = function() {
     var newItemNo = $scope.slots.length+1;
     $scope.slots.push({'id' : 'slot' + newItemNo});
   };
   
   $scope.removeNewSlot = function() {
     var newItemNo = $scope.slots.length-1;
     if ( newItemNo !== 0 ) {
      $scope.slots.pop();
     }
   };
   
   $scope.showSlotButton = function(slot) {
     return slot.id === $scope.slots[$scope.slots.length-1].id;
   };

  $scope.addNewPricePackage = function() {
     var newItemNo = $scope.pricePackages.length+1;
     $scope.pricePackages.push({'id' : 'pricePackage' + newItemNo});
   };
   
   $scope.removeNewPricePackage = function() {
     var newItemNo = $scope.pricePackages.length-1;
     if ( newItemNo !== 0 ) {
      $scope.pricePackages.pop();
     }
   };
   
   $scope.showPricePackageButton = function(pricePackage) {
     return pricePackage.id === $scope.pricePackages[$scope.pricePackages.length-1].id;
   };

   $scope.addActivity = function() {

    $scope.loading=true;
    $scope.successMsg=false;
    $scope.errorMsg=false;
    $scope.activityData.type=$routeParams.activityType;
    
        fileUpload.upload($scope.file).then(function(data) {
            if (data.data.success) {
                $scope.file = {};
                $scope.activityData.image='gallery/'+data.data.name;
                
                BusinessActivities.create({
                  slots: $scope.slots,
                  pricePackages: $scope.pricePackages,
                  data: $scope.activityData}
                  ).then(function(data){

                  if(data.data.success){

                    $scope.successMsg=data.data.message;
                    $scope.loading=false;
                  }
                  else
                  {
                    $scope.errorMsg=data.data.message;
                    $scope.loading=false;
                  }

                });

            } 
            else 
            {
                $scope.errorMsg = data.data.message;
                $scope.loading=false;
                $scope.file = {};
            }


        });
		
	}

}) ;