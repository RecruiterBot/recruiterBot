angular.module('recruiterBot')
.directive('slackNavDir', function(){
    return {
      templateUrl: 'directives/navigation-tmpl.html',
      controller: 'navigationCtrl'
    }
})
