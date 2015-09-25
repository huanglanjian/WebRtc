/**
 * Created by lenovo on 15-9-24.
 */
angular.module('left_func',['ui.bootstrap']).
    controller('html5Demo', ['$scope','$http',function ($scope,$http) {
        $scope.oneAtATime = true;
        $scope.group = {
            title : '当前用户',
            content : 'content'
        };
        $scope.items = [];
        $scope.status = {
            //isFirstOpen: true,
        }
        $http({
            url:'/getUserName',
            method:'POST',
        }).success(function(data, status, headers, config) {
            if(status == '200'){
                $scope.group.content = data;
                globalclientUser = data;
                getfriedname(data);
            }
        }).error(function (data, status, headers, config) {
            if(status == "404"){

            }
        });
        getfriedname = function(username){
            var data = {"uname":username};
            $http({
                url:'/getFriends',
                method:'POST',
                data:data,
            }).success(function(data, status, headers, config) {
                $scope.items = [];
                if(status == '200'){
                    for(var i=0;i<data.length;i++) {
                        $scope.items.push(data[i]);
                    }
                }
            }).error(function (data, status, headers, config) {
                if(status == "404"){

                }
            });
        };
    }])
    .controller('Share_file', function ($scope) {
        connection.body = document.getElementById('file_area');
        $scope.addItem = function(){
            var fileSelector = new FileSelector();
            fileSelector.selectSingleFile(function(file) {
                connection.send(file);
            });
        }
    });