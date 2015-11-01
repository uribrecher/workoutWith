(function () {
    'use strict';

    function session_service(domain, $q, $firebaseObject) {
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
        
        var q_fb_update = function(ref, param) {
            var deferred = $q.defer();
            
            ref.update(param,function(err) {
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
            if (trainee === trainer) {
                return $q.reject("trainer and trainee are the same person");
            }
            var new_session_ref = sessions_ref.push();
            var trainer_index_ref = sessions_index_ref.child("as_trainer").child(trainer).child(new_session_ref.key());
            var trainee_index_ref = sessions_index_ref.child("as_trainee").child(trainee).child(new_session_ref.key());

            // first establish write permissions
            var def1 = q_fb_set(new_session_ref.child('trainee'), trainee);
            
            // then update additional fields
            var def2 = q_fb_update(new_session_ref, {
                trainer: trainer,
                time: time,
                workout: workout,
                state: "pending"
            });
            
            var def3 = q_fb_set(trainer_index_ref, trainee);
            var def4 = q_fb_set(trainee_index_ref, trainer);
            return $q.all([def1,def2,def3,def4]);
        };
        
        this.confirm_session_request = function(session_id) {
            var session_ref = sessions_ref.child(session_id);

            return q_fb_transaction(session_ref.child('state'), function(currentState) {
                if (currentState === "pending") {
                    return "confirmed";
                }

                return;
            }); 
        };
        
        this.reject_session_request = function(session_id) {
            var session_ref = sessions_ref.child(session_id);
            return q_fb_transaction(session_ref.child('state'), function(currentState) {
                if (currentState === "pending") {
                    return "rejected";
                }

                return;
            }); 
        };

        this.cancel_session_request = function(session_id) {
            var session_ref = sessions_ref.child(session_id);
            return q_fb_transaction(session_ref.child('state'), function(currentState) {
                if (currentState === "pending" || currentState === "confirmed") {
                    return "cancelled";
                }

                return;
            }); 
        };
        
        this.get_all_sessions_of_trainee = function(trainee_id, added_cb, removed_cb) {
            var session_of_trainee_ref = sessions_index_ref.child('as_trainee').child(trainee_id);
            
            session_of_trainee_ref.on('child_added', function(snap) {
                added_cb(snap.key(), {
                    session: $firebaseObject(sessions_ref.child(snap.key())),
                    trainer: $firebaseObject(root_ref.child('users_public').child(snap.val()))
                })
            });
            
            session_of_trainee_ref.on('child_removed', function(snap) {
                removed_cb(snap.key());
            });
        };
        
        this.get_all_sessions_of_trainer = function(trainer_id, added_cb, removed_cb) {
            var session_of_trainer_ref = sessions_index_ref.child('as_trainer').child(trainer_id);
            
            session_of_trainer_ref.on('child_added', function(snap) {
                added_cb(snap.key(), {
                    session: $firebaseObject(sessions_ref.child(snap.key())),
                    trainee: $firebaseObject(root_ref.child('users_public').child(snap.val()))
                })
            });
            
            session_of_trainer_ref.on('child_removed', function(snap) {
                removed_cb(snap.key());
            });
        };
    };
    
    angular.module('mainApp').service("session_service", ['domain', '$q', '$firebaseObject', session_service]);
})();
