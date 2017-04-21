angular.module('commentController', ['businessOwnerServices','authServices'])
.controller('commentCtrl',function($http,$location,BusinessOwner,Authentication,AuthenticationToken)
{	//This Contoller calles businessOwnerServices to perform the search query
	//based on the keyword entered by the user which is now found in the url of the
	//page then it takes the returned results and put them in properties of the 
	//controller to be used in the HTML file accordingly.
	if(!AuthenticationToken.getId())
	{		
		$location.path('/error404');
		
	}
	var app = this;
	app.reply=function(replyData,reviewID){
		app.errMsg = false ; 
		BusinessOwner.reply({reply: app.replyData},reviewID).then(function(data){
			if(data.data.success){
				$location.path('/reviews');
				location.reload();

			}
			else{
				
				app.errMsg = data.data.message;
			}
	});
}

	BusinessOwner.getReviews(AuthenticationToken.getId()).then(function(data)
	{
		app.errMsg = false;
		app.reviews=[];
		if(data.data.success)
		{
			app.reviews = data.data.reviews;
			
		}
		else{
			app.errMsg = data.data.message;
		}
	},function(err)
		{	if(err.data){
				
				if(err.data){
				Authentication.handleError();
				}
		}
		});

});
