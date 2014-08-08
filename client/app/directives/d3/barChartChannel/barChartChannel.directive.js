'use strict';

angular.module('tophemanDatavizApp')
        .directive('barChartChannel', function($window, d3Helpers) {
          return {
            template: '<style>bar-chart-channel{display:block;}bar-chart-channel svg{display:block;margin:0 auto;}bar-chart-channel ul{padding-left:0;text-align:center;}bar-chart-channel ul li{list-style:none;display:inline;}bar-chart-channel ul li:after{content:", "}bar-chart-channel ul li:last-child:after{content:""}</style>',
            restrict: 'E',
            scope: {
              aspectRatio: '=',
              channel: '='
            },
            link: function(scope, element, attrs) {

              var DEFAULT_ASPECT_RATIO = 1.25;

              var d3 = $window.d3;

              var d3Data = [];//global to the whole directive because used in both resize and render

              var svg = null;
              var axis = null;
              var heightScale = null;
              var widthScale = null;

              var barChartChannel = {
                barsGroup: null,
                axisGroup: null,
                legendGroup: null,
                padding: 5,
                duration: 300,
                delay: 300
              };

              var barGroupSize = {
                height: null,
                width: null,
                marginLeftForAxis: 30 //static
              };

              var color = d3.scale.category10();

              var init = function() {
                barChartChannel.legendGroup = d3.select(element[0]).append('ul')
                        .attr("class", "legend-group");

                svg = d3.select(element[0]).append('svg');

                barChartChannel.barsGroup = svg.append("g")
                        .attr("class", "bar");

                barChartChannel.axisGroup = svg.append("g")
                        .attr("class", "axis-group");

              };

              var resize = function(width) {

                //to make the directive responsive, rely on aspectRatio (can't use height:100% because of possible overflow divs)
                var height = parseInt(width / (typeof scope.aspectRatio === 'undefined' ? DEFAULT_ASPECT_RATIO : scope.aspectRatio));
                svg
                        .attr('height', height)
                        .attr('width', width);

                barGroupSize.height = height - 2 * barChartChannel.padding;
                barGroupSize.width = width - 2 * barChartChannel.padding - barGroupSize.marginLeftForAxis;

                barChartChannel.axisGroup
                        .attr('transform', 'rotate(-90), translate(-' + (barGroupSize.height + barChartChannel.padding) + ')');

                barChartChannel.barsGroup
                        .attr('transform', 'translate(' + (barGroupSize.marginLeftForAxis) + ',' + (barChartChannel.padding) + ')');
              };

              //callback to use on resize event (debounced first to prevent multiple unnecessary calls)
              var onResize = d3Helpers.debounce(resize, barChartChannel.delay);

              var render = function(channelKeywords) {

                //preprocess data to d3Data
                d3Data = [];
                for (var keyword in channelKeywords) {
                  d3Data.push({name: keyword, count: channelKeywords[keyword].count});
                }

                heightScale = d3.scale.linear()
                        .domain([0, d3.max(d3Data.map(function(item) {
                            return item.count;
                          }))])
                        .range([0, barGroupSize.height]);

                widthScale = d3.scale.linear()
                        .domain([0, d3Data.length])
                        .range([0, barGroupSize.width]);

                axis = d3.svg.axis()
                        .ticks(5)
                        .scale(heightScale);

                barChartChannel.axisGroup.call(axis);

                var bars = barChartChannel.barsGroup.selectAll('rect').data(d3Data);

                bars.enter()
                        .append('rect')
                        .attr('width', widthScale(0.8))
                        .attr('height', 10)
                        .attr('fill', function(d) {
                          return color(d.name);
                        })
                        .attr('stroke', 'black');

                bars.transition()
                        .attr('width', widthScale(0.8))
                        .attr('x', function(d, i) {
                          return widthScale(i);
                        })
                        .attr('y', function(d) {
                          return barGroupSize.height - heightScale(d.count);
                        })
                        .attr('height', function(d) {
                          return heightScale(d.count);
                        });

                bars.exit().remove();

                var legends = barChartChannel.legendGroup.selectAll('li').data(d3Data);

                legends.enter()
                        .append('li')
                        .attr('style', function(d) {
                          return 'opacity:0;color:' + color(d.name);
                        })
                        .transition()
                        .duration(300)
                        .attr("style", function(d) {
                          return 'opacity:1;color:' + color(d.name);
                        })

                legends
                        .text(function(d) {
                          return d.name+'('+d.count+')';
                        });


              };

              init();
              resize(element[0].clientWidth, element[0].clientHeight);

              $window.addEventListener('resize', function() {
                onResize(element[0].clientWidth, element[0].clientHeight);
              });

              scope.$watch('channel.keywords', function() {
                render(scope.channel.keywords);
              }, true);

            }
          };
        });