(function () {
    'use strict';

    function auth_service($firebaseAuth, $firebaseObject, $firebaseArray, $modal, $q, domain) {
        var root_ref = new Firebase(domain);
        var fb_auth = $firebaseAuth(root_ref);
        var signup_func = null;
        var self = {};
        
        self.fb_user = {
            private: null,
            public: null,
            uid: null
        };
        
        self.set_default_value = function(ref, newVal) {
            ref.transaction(function(oldVal) {
                if (oldVal === null) {
                    return newVal;
                }
                return;
            });
        };
        
        self.init = function() {
            fb_auth.$onAuth(function(authdata) {
                if (authdata)
                {                   
                    var public_user_ref = root_ref.child("users_public").child(authdata.uid);
                    var private_user_ref = root_ref.child("users_private").child(authdata.uid);
                    self.fb_user.private = $firebaseObject(private_user_ref);
                    self.fb_user.public = $firebaseObject(public_user_ref);
                    self.fb_user.uid = authdata.uid;

                    // fill some default values from the authdata when necessary
                    self.set_default_value(public_user_ref.child('name'), self.get_display_name(authdata));
                    self.set_default_value(public_user_ref.child('avatar'), self.get_avatar(authdata));
                    self.set_default_value(private_user_ref.child('email'), self.get_email(authdata));
                    
                    private_user_ref.child("registered").on("value", function(snap) {
                        if (snap.val() === null) {
                            signup_func(snap);
                        }
                    });
                }
                else
                {
                    self.fb_user.uid = null;
                }
            });  
        };
        
        self.get_fb_user = function() {
            return self.fb_user;
        }
        
        self.login = function (provider_name) {
            fb_auth.$authWithOAuthPopup(provider_name, {scope: "email"});
        };
        self.logout = function () {
            fb_auth.$unauth();
        };
        
        self.update_user = function() {
            return $q.all(
                [self.fb_user.public.$save(),
                self.fb_user.private.$save()]);
        };
        
        self.set_signup_func = function(signup) {
            signup_func = signup;
        };
        
        self.get_auth_object = function () {
            return fb_auth;
        };
        
        self.open_auth_modal = function () {
            var modalInstance = $modal.open(
                {
                    animation: true,
                    templateUrl: 'html/login_dialog.html',
                    controller: 'AuthModalCtrl',
                    size: 'sm'
                });    
        };
        
        self.get_display_name = function(authdata) {
            if (authdata.provider === 'google') {
                return authdata.google.displayName;
            }
            else if (authdata.provider === 'facebook') {
                return authdata.facebook.displayName;
            }
        };
        
        self.get_email = function(authdata) {
            if (authdata.provider === 'google') {
                return authdata.google.email;
            }
            else if (authdata.provider === 'facebook') {
                return authdata.facebook.email;
            }
        };
        
        self.get_avatar = function(authdata) {
            if (authdata.provider === 'google') {
                return authdata.google.profileImageURL;
            }
            else if (authdata.provider === 'facebook') {
                return authdata.facebook.profileImageURL;
            }
        };
        
        return self;
    };
    
    angular.module('mainApp').factory("auth_service", ['$firebaseAuth', '$firebaseObject', '$firebaseArray', '$modal', '$q', 'domain', auth_service]);
  
  })();