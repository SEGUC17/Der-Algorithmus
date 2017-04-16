angular.module('reservationServices', [])
.factory('Reservation',function($http){
    reservationFactory = {};
    reservationFactory.getActivity = function(activity_id,activity_type){ //$routeParams.activity_id in controller; TODO : remove actiity type and zbtha .

      return $http.get('/reserve/activity/'+activity_type+'/'+activity_id);

    }

    reservationFactory.ReserveNR = function(activity_id,price,reservationData,client_id){
    var parameters = JSON.stringify ({activity_id :activity_id ,client_id:client_id,participants:reservationData,
    price:price});
      return $http.post('reserve/1/'+activity_id,parameters);
    }
    reservationFactory.ReserveR = function(activity_id,client_id,price,participants,slot_id,date){
    var parameters = JSON.stringify ({activity_id :activity_id ,client_id:client_id,participants:participants,
    price:price,slot_id:slot_id,date:date});
      return $http.post('reserve/0/'+activity_id,parameters);
    }
    return reservationFactory;
})