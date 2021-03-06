
angular.module('userControllers', ['ngAnimate','ngTouch','userServices','clientServices','businessOwnerServices', 'authServices','pagingServices'])
//this controller is responsible for registeration of clients, it takes the regData from user and forward it to the services
//responsible to send this data to the backend and then it checks if there is an error forwarded from the backend and show it to
//user if exists.
.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;

	app.regUser = function(regData){
		app.successMsg = false;
		app.errors = false;
		User.createUser(app.regData).then(function(data){

			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				$location.path('/');
				app.sucessMsg=false;
			}
			else{
				if(data.data.errors){
					app.errors=data.data.errors;
				}
				else {
					app.errMsg=data.data.message;
				}
			}
		},function(err)
		{
			if(err.data){
				Authentication.handleError();
			}
		});
	};

})
// this controller is responsible for Updating information for the client, it takes the infomation going to be updated and forwards it
// to the service responsible for forwarding it to the backend and then if it sucesses it will direct the user to the homepage
// else it will show the error
.controller('updateCtrl',function($http,$location,$timeout,User, Authentication, AuthenticationToken){
	var app=this;
	User.getUser().then(function(data){
		if(data.data.success){
			app.user=data.data.user;
			app.client=data.data.client;
		}
	},function(err)
	{
		if(err.data){
		Authentication.handleError();
		}
	});
	app.updateUser=function(updateData){
		app.successMsg = false;
		app.errMsg = false;
		User.updateInfo(app.updateData).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				$location.path('/');
				app.sucessMsg=false;

			}else {
				app.errMsg=data.data.message;

			}




		},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});
	}

})


// this controller is responsible for updating the username of the user it forwards the new username to the service responsible
// for updating the username in the backend and then any error message will be forwarded to html file to be shown to the user
.controller('usernameCtrl',function($http,$location,User, Authentication, AuthenticationToken){
	var app=this;
	app.updateUsername=function(Edata){
		app.successMsg = false;
		app.errMsg = false;

		User.updateUsername(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				app.sucessMsg=false;
				AuthenticationToken.setUsername(app.Edata.username);
				$location.path('/updateInfo');
				location.reload();

			}else {
				app.errMsg=data.data.message;

			}
		},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});
	}

})
// this controller is responsible for handling the password update for the user, after the user enters the old password and new password
// also the confirm of the password it sends this data to the service responsible for forwarding this data to the backend to update it

.controller('PasswordCtrl',function($http,$location,User, Authentication, AuthenticationToken){
	var app=this;
	app.updatePassword=function(Edata){
		app.successMsg = false;
		app.errMsg = false;
		app.errors= false;
		User.updatePassword(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				if(Authentication.isClient()){
				$location.path('/updateInfo');
				}
					else {
						$location.path('/business/update-info');

					}
				app.sucessMsg=false;

			}else {
				if(data.data.errors){
					app.errors=data.data.errors
				}else {
					app.errMsg=data.data.message;
				}

			}
		},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});
	}


})

// this controller is responsible for viewing ths summaries of all business Owners on the website, just gets all the business owners
// from the back end using the service in client services
.controller('viewCtrl',function($http,$location,$timeout,Client,Pager,$scope){
		var app=this;
		app.BusinessOwners=[];
		app.errMsg=false;
		Client.viewSummaries().then(function(data){
			if(data.data.success){
				app.BusinessOwners=data.data.BusinessOwners;
				app.pager = {};
				$scope.itemsPerPage = 9;
		    	app.setPage = function (page) {

                	if (page < 1 || page > app.pager.totalPages) {

                    return;

                	}
	                // get pager object from service
	                app.pager = Pager.getPager(app.BusinessOwners.length, page,$scope.itemsPerPage);
	                // get current page of items
	                app.items = app.BusinessOwners.slice(app.pager.startIndex, app.pager.endIndex + 1);

            	};
            // initialize to page 1
            app.setPage(1);
            //end of pagination logic for controller

			}
			else {
					app.errMsg=data.data.message;
			}
		});
})
// this controller used to view a detailed view of a specific business owner by giving the id to the service and getting this data from
// the back end and if it successes it will view this data otherwise an error will come up

// also this controller is used to view the summaries of all activities of this specific business owner and also controls the gallery of images of the business owner
.controller('viewDetailedCtrl',function($scope,$http,$location,$timeout,Client,$routeParams, AuthenticationToken, Authentication){
	var app=this;
	app.errMsg=false;
	app.errAMsg=false;

	app.activities=[];
	app.client = Authentication.isClient();
	app.id=$routeParams.id;
	Client.viewDetailed(app.id).then(function(data){
		if(data.data.success){
			app.businessOwner=data.data.businessOwner;


			$scope.photos = app.businessOwner.images;
			// initial image index
			$scope._Index = 0;
			// if a current image is the same as requested image
			$scope.isActive = function (index) {
			return $scope._Index === index;
			};
			// show prev image
			$scope.showPrev = function () {
			$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
			};
			// show next image
			$scope.showNext = function () {
			$scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
			};
			// show a certain image
			$scope.showPhoto = function (index) {
			$scope._Index = index;
			};







			if(data.data.activities)
			{

				app.activities=data.data.activities;

			}else{
				app.errAMsg=data.data.message;
		}
		}
		else {
			app.errMsg=data.data.message;
		}
	},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});

	$scope.checkDate=function(activity){
		if(activity.type=="Trip"||activity.type=="Safari"){
		var date=new Date();
		date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
		var Adate=new Date(activity.travelingDate);
		Adate.setHours(0);
        Adate.setMinutes(0);
        Adate.setSeconds(0);
        Adate.setMilliseconds(0);


		return Adate>date;
	}
	return true;

	}

})

.controller('viewActivityCtrl',function($http,AuthenticationToken,Client,$routeParams,Authentication){
// this controller is responsible for viewing all the details of an activity by taking the id of this activity and give it to the
	// service responsible for forwarding the id to the backend and get all the details and then it show this details if it successes
	var app=this;
	var flag=false;
	app.activityID=$routeParams.id;
	app.errMsg=false;
	app.errRelatedActivities=true;
	Client.viewActivity(app.activityID).then(function(data){
		if(data.data.success){
			app.activity=data.data.activity;
			app.offer=data.data.activity.offer;
			Client.getRelatedActivities(app.activity.type).then(function(data){
				if(data.data.success){
					app.Ractivities=data.data.activities;
				}
				else{
					app.errRelatedActivities=false;
				}
			});
			if(data.data.type=='N'){
				app.type=false;
			}
			else {
				app.type=true;
			}
		}else {
			app.errMsg=data.data.message;
		}
	},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});





})
.controller('searchCtrl',function($http,BusinessOwner,Pager,$scope)
{	//This Contoller calles businessOwnerServices to perform the search query
	//based on the keyword entered by the user which is now found in the url of the
	//page then it takes the returned results and put them in properties of the 
	//controller to be used in the HTML file accordingly.
	var app = this;
	BusinessOwner.getResults().then(function(data)
	{
		app.errMsg = false;
		app.venues=[];
		
		if(data.data.success)
		{
			if(data.data.businesses.length == 0)
			{
				app.errMsg = data.data.message;
			}
			else{
				app.venues = data.data.businesses;
			}
			app.pager = {};
			$scope.itemsPerPage = 9;
		    app.setPage = function (page) {

                if (page < 1 || page > app.pager.totalPages) {

                    return;

                }
                // get pager object from service
                app.pager = Pager.getPager(app.venues.length, page,$scope.itemsPerPage);
                // get current page of items
                app.items = app.venues.slice(app.pager.startIndex, app.pager.endIndex + 1);

            };
            // initialize to page 1
            app.setPage(1);
            //end of pagination logic for controller

		}
		else{
			app.errMsg = data.data.message;
		}
	});
	

})
.controller('adminCtrl',function($http,Admin,$location)
{	//This controller ensures that the admin of the website is created only once
	//Its link is known only by the team members and anyone tries to hack it
	//It will be give him/her access denied
	var app = this;

	app.doReg=function(regData){
		app.errMsg = false;
		Admin.addAdmin(app.regData).then(function(data)
		{
			if(data.data.success)
			{

				$location.path('/');
			}
			else{
				app.errMsg = data.data.message;
				app.regData={};
			}
		});
	}

});
