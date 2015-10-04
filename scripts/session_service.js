(function () {
    'use strict';

    function session_service(domain, $q) {
        var root_ref = new Firebase(domain);
        var sessions_ref = root_ref.child('sessions');
        
        // promisify the push method
        var q_fb_set = function(ref, param) {
            var deferred = $q.defer();
            
            ref.set(param,function(err) {
                    if(err) return deferred.reject(err);
                    deferred.resolve();
            });
            return deferred;
        };
        
        this.send_session_request = function(trainee, trainer, time, workout) {
            var new_session_ref = root_ref.child('sessions').child(trainee).child(trainer).push();
            q_fb_set(new_session_ref, {
                time: time,
                workout: workout,
                state: "pending"
            });
            
            var trainer_request_ref = root_ref.child('trainers').child(trainer).child('session_refs').child(new_session_ref.key());
            q_fb_set(trainer_request_ref, trainee);
        };
        
        this.get_session_reference = function(trainer, session_id) {
            var ref_ref = root_ref.child('trainers').child(trainer).child('session_refs').child(session_id);  
            return sessions_ref.child(ref_ref.val()).child(trainer).child(session_id);
        }
        
        this.confirm_session_request = function(trainer, session_id) {
            var session_ref = get_session_reference(trainer, session_id);
            return q_fb_set(session_ref.child('state'), "confirmed");
        };
        
        this.reject_session_request = function(trainer, session_id) {
            var session_ref = get_session_reference(trainer, session_id);
            return q_fb_set(session_ref.child('state'), "rejected");
        };

        this.cancel_session_request = function(trainer, session_id) {
            var session_ref = get_session_reference(trainer, session_id);
            return q_fb_set(session_ref.child('state'), "cancelled");
        };
                
    };
    
    angular.module('mainApp').service("session_service", ['domain', '$q', session_service]);
})();
