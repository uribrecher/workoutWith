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
        
        this.send_session_request = function(trainee, trainer, time, workout) {
            var new_session_ref = sessions_ref.child(trainee).child(trainer).push();
            var trainer_index_ref = sessions_index_ref.child(trainer).child(new_session_ref.key());

            var def1 = q_fb_set(new_session_ref, {
                time: time,
                workout: workout,
                state: "pending"
            });
            
            var def2 = q_fb_set(trainer_index_ref, trainee);
            return $q.all([def1,def2]);
        };
        
        this.get_session_reference = function(trainer, session_id) {
            var trainee_ref = sessions_index_ref.child(trainer).child(session_id);  
            return sessions_ref.child(trainee_ref.val()).child(trainer).child(session_id);
        }
        
        this.confirm_session_request = function(trainer, session_id) {
            var session_ref = this.get_session_reference(trainer, session_id);
            return q_fb_transaction(session_ref.child('state'), function(currentState) {
                if (currentState === "pending") {
                    return "confirmed";
                }
                
                return;
            });
        };
        
        this.reject_session_request = function(trainer, session_id) {
            var session_ref = this.get_session_reference(trainer, session_id);
            return q_fb_transaction(session_ref.child('state'), function(currentState) {
                if (currentState === "pending") {
                    return "rejected";
                }
                
                return;
            });
        };

        this.cancel_session_request = function(trainer, session_id) {
            var session_ref = get_session_reference(trainer, session_id);
            return q_fb_transaction(session_ref.child('state'), function(currentState) {
                if (currentState === "pending" || currentState === "confirmed") {
                    return "cancelled";
                }
                
                return;
            });
        };
                
    };
    
    angular.module('mainApp').service("session_service", ['domain', '$q', session_service]);
})();
