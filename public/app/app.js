//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes','passwordController','reservationController', 'userControllers', 'reservationServices','userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'reviewServices','businessOwnerServices','businessOwnerController','commentController','pagingServices', 'ui.bootstrap', 'activityController', 'activityServices', 'ratingController', 'adminBusinessController' , 'adminServices', 'viewReviewController','modalDialog','businessActivitiesController','businessActivitiesServices','nonRepeatableActivityFormController','repeatableActivityFormController','nonRepeatableReservationsController','nonRepeatableReservationsServices','repeatableReservationsController','repeatableReservationsServices'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});
