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
    //分享文件的控制器
    .controller('Share_file', function ($scope) {
        connection.body = document.getElementById('file_area');
        $scope.addItem = function(){
            var fileSelector = new FileSelector();
            fileSelector.selectSingleFile(function(file) {
                connection.send(file);
            });
        }
    })
    //右键菜单的控制器
    .controller('ListController', ['$scope',
        function ($scope) {
          /*  $scope.player = {
                gold: 100
            };
            $scope.items = [
                { name: 'Small Health Potion', cost: 4 },
                { name: 'Small Mana Potion', cost: 5 },
                { name: 'Iron Short Sword', cost: 12 }
            ];*/
            $scope.menuOptions = [
                ['删除', function ($itemScope) {
                    $scope.items.splice($itemScope.$index,1);
                }],
                null,
                ['添加', function ($itemScope) {
                    $scope.items.push('lilei');
                }]
            ];
        }
    ])
    // 右键菜单的指令
    .directive('contextMenu', function ($parse) {
        var renderContextMenu = function ($scope, event, options) {
            if (!$) { var $ = angular.element; }
            $(event.currentTarget).addClass('context');
            var $contextMenu = $('<div>');
            $contextMenu.addClass('dropdown clearfix');
            var $ul = $('<ul>');
            $ul.addClass('dropdown-menu');
            $ul.attr({ 'role': 'menu' });
            $ul.css({
                display: 'block',
                position: 'absolute',
                left: event.pageX + 'px',
                top: event.pageY + 'px'
            });
            angular.forEach(options, function (item, i) {
                var $li = $('<li>');
                if (item === null) {
                    $li.addClass('divider');
                } else {
                    $a = $('<a>');
                    $a.attr({ tabindex: '-1', href: '#' });
                    $a.text(typeof item[0] == 'string' ? item[0] : item[0].call($scope, $scope));
                    $li.append($a);
                    $li.on('click', function ($event) {
                        $event.preventDefault();
                        $scope.$apply(function () {
                            $(event.currentTarget).removeClass('context');
                            $contextMenu.remove();
                            item[1].call($scope, $scope);
                        });
                    });
                }
                $ul.append($li);
            });
            $contextMenu.append($ul);
            var height = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );
            $contextMenu.css({
                width: '100%',
                height: height + 'px',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999
            });
            $(document).find('body').append($contextMenu);
            $contextMenu.on("mousedown", function (e) {
                if ($(e.target).hasClass('dropdown')) {
                    $(event.currentTarget).removeClass('context');
                    $contextMenu.remove();
                }
            }).on('contextmenu', function (event) {
                $(event.currentTarget).removeClass('context');
                event.preventDefault();
                $contextMenu.remove();
            });
        };
        return function ($scope, element, attrs) {
            element.on('contextmenu', function (event) {
                $scope.$apply(function () {
                    event.preventDefault();
                    var options = $scope.$eval(attrs.contextMenu);
                    if (options instanceof Array) {
                        renderContextMenu($scope, event, options);
                    } else {
                        throw '"' + attrs.contextMenu + '" not an array';
                    }
                });
            });
        };
    });
