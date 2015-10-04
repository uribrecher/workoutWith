(function () {
    'use strict';

    function mailbox_service(domain) {
        var root_ref = new Firebase(domain);
        
        // promisify the push method
        var pushp = function(ref, param) {
            return new Promise(function(resolve,reject){
                ref.push(param,function(err){
                    if(err) return reject(err);
                    resolve();
                });
            });
        };
        
        this.sendMessage = function(target_uid, message) {
            var target_ref = root_ref.child('mailbox').child(target_uid);
            return pushp(target_ref, message);
        }
    };
    
    angular.module('mainApp').service("mailbox_service", ['domain', mailbox_service]);
})();
