(function () {
    'use strict';

    function session_service(domain, $q) {
        var root_ref = new Firebase(domain);
        var sessions_ref = root_ref.child('sessions');
        var sessions_index_ref = root_ref.child('sessions_index');
        
        // promisify the set method
        var q_fb_set = function(ref, param) {
            var deferred = $q.defer();
            
            ref.set(param,function(err) {
                    if(err) return deferred.reject(err);
                    deferred.resolve();
            });
            return deferred;
        };
        
        var q_fb_transaction = function(ref, update_func) {
            var deferred = $q.defer();
            
            ref.transaction(update_func, function(error, committed, snapshot) {
              if (error) {
                deferred.reject(error);
              } else if (!committed) {
                deferred.reject("aborted");
              } else {
                deferred.resolve(snapshot);
              }
            }, false);
            return deferred;
        };
        
        var get_val_of = function(ref) {
            var deferred = $q.defer();
            ref.once("value", function(snap) {
                deferred.resolve(snap.val());
            });
            return deferred.promise;
        };
        
        this.send_session_request = function(trainee, trainer, time, workout) {
            var new_session_ref = sessions_ref.child(trainee).child(trainer).push();
            var trainer_index_ref = sessions_index_ref.child("as_trainer").child(trainer).child(new_session_ref.key());
            var trainee_index_ref = sessions_index_ref.child("as_trainee").child(trainee).child(new_session_ref.key());

            var def1 = q_fb_set(new_session_ref, {
                time: time,
                workout: workout,
                state: "pending"
            });
            
            var def2 = q_fb_set(trainer_index_ref, trainee);
            var def3 = q_fb_set(trainee_index_ref, trainer);
            return $q.all([def1,def2,def3]);
        };
        
        
        var get_session_by_trainer = function(trainer_id, session_id) {
            var trainee_ref = sessions_index_ref.child("as_trainer").child(trainer_id).child(session_id);
            var promise = get_val_of(trainee_ref).then(function(value) {
                return sessions_ref.child(value).child(trainer_id).child(session_id);
            });
            return promise;
        };
        
        var get_session_by_trainee = function(trainee_id, session_id) {
            var trainers_ref = sessions_index_ref.child("as_trainee").child(trainee_id).child(session_id);
            var promise = get_val_of(trainers_ref).then(function(value) {
                return sessions_ref.child(trainee_id).child(value).child(session_id);
            });
            
            return promise;
        };
        
        this.confirm_session_request = function(trainer, session_id) {
            get_session_by_trainers(trainer, session_id).then(function(session_ref) {
                return q_fb_transaction(session_ref.child('state'), function(currentState) {
                    if (currentState === "pending") {
                        return "confirmed";
                    }

                    return;
                });
            });  
        };
        
        this.reject_session_request = function(trainer, session_id) {
            get_session_by_trainers(trainer, session_id).then(function(session_ref) {
                return q_fb_transaction(session_ref.child('state'), function(currentState) {
                    if (currentState === "pending") {
                        return "rejected";
                    }

                    return;
                });
            });  
        };

        this.cancel_session_request = function(trainee, session_id) {
            get_session_by_trainee(trainee, session_id).then(function(session_ref) {
                return q_fb_transaction(session_ref.child('state'), function(currentState) {
                    if (currentState === "pending" || currentState === "confirmed") {
                        return "cancelled";
                    }

                    return;
                });
            });  
        };
                
    };
    
    angular.module('mainApp').service("session_service", ['domain', '$q', session_service]);
})();
