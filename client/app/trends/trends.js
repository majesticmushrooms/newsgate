angular.module('newsgate.trends', [])
.controller('TrendsController', function($scope, $rootScope, $http, Data) {

  $scope.data = Data.process(Data.google[0]);
  $scope.data2 = Data.process(Data.google[1]);
  $scope.title = Data.google[0].query;

  $rootScope.$on('updateData', () => {
    console.log('Queried Trend Term:', Data.google[0].query);
    $scope.data = Data.process(Data.google[0]);
    $scope.keywords = Data.keywords.keywords;
    $scope.title = Data.google[0].query;
  });
})
.directive('trendGraph', function() {
  return {
    restrict: 'E', // only matches element name
    scope: { data: '=' }, // isolate scope. essentially removes the two way data binding
    replace: true,
    link: function(scope, element) {
      var title = scope.$parent.title.toUpperCase();

      console.log(scope.x);
      var dates = {};

      for (var i = 0; i < scope.data.length; i++) {

        var date = JSON.stringify(scope.data[i].date).split('T')[0].replace('"', '');
        if (dates[date] === undefined) {
          dates[date] = scope.data[i].value;
        } else {
          dates[date] += scope.data[i].value;
        }
      }

      var labelDate = [];
      var labelValue =[];

      for (var key in dates) {
        labelDate.push(key);
        labelValue.push(dates[key]/7);
      }


      var ctx = document.getElementById('myChart').getContext('2d');
      ctx.canvas.width = 450;
      ctx.canvas.height = 300;
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labelDate,
          datasets: [{
            label: title,
            data: labelValue,
            backgroundColor: "rgba(255,241,191,0.4)"
          }]
        },
        options: {
          resposive: true
          // scales: {
          //   yAxes: [{
          //       ticks: {
          //       max: 300
          //     }
          //   }]
          // }
        }
      });
    }
  };
});
