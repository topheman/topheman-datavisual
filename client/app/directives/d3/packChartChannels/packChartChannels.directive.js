'use strict';

angular.module('tophemanDatavizApp')
        .directive('packChartChannels', function($window, d3Helpers) {
          return {
            template: '<style>pack-chart-channels{display:block;}pack-chart-channels svg {display:block;margin : 0 auto;}</style>',
            restrict: 'EA',
            scope: {
              data: '='
            },
            link: function(scope, element, attrs) {

              var d3 = $window.d3;

              var channelsDescription = [];

              var svg = null;
              var pack = null;
              var scale = null;

              var packChartChannels = {
                circleGroup: null,
                labelGroup: null,
                duration: 300,
                delay: 300
              };
              
              var packChartSize = {
                width : null,
                height : null
              };

              //attach the static elements in the DOM
              var init = function() {
                svg = d3.select(element[0]).append('svg');

                packChartChannels.circleGroup = svg.append("g")
                        .attr("class", "circle-group");

                packChartChannels.labelGroup = svg.append("g")
                        .attr("class", "label-group");
              };

              //bind the size attributes (will be triggered on resize event)
              var resize = function(width, height) {
                console.log('resize', width, height);
                packChartSize.height = packChartSize.width = height = width;

                svg
                        .attr('width', width)
                        .attr('height', height);

                element[0].style.height = height + 'px';

                var transform = "translate(" + 0 + "," + 0 + ")";

                packChartChannels.circleGroup.attr("transform", transform);

                packChartChannels.labelGroup.attr("transform", transform);

                pack = d3.layout.pack()
                        .size([width, height])
                        .padding(10);

              };

              var onResize = d3Helpers.debounce(resize, packChartChannels.delay);

              var render = function(data) {
                console.log('render', data);
                var d3Data = d3Helpers.dataToD3TreeData(data, channelsDescription);

                var nodes = pack.nodes(d3Data);

                var circles = packChartChannels.circleGroup.selectAll('.node').data(nodes);

                circles.enter()
                        .append('circle')
                        .attr('class', function(d) {
                          return 'node depth-' + d.depth + ' ' + d.name;
                        })
                        .attr('transform', function(d) {
                          return 'translate(' + packChartSize.width/2 + ',' + packChartSize.height/2 + ')';
                        })
                        .attr('fill', 'none')
                        .attr('stroke', 'gray')
                        .attr('stroke-width', 1);

                circles.transition()
                        .attr('transform', function(d) {
                          return 'translate(' + d.x + ',' + d.y + ')';
                        })
                        .attr('r', function(d) {
                          return d.r
                        });

                circles.exit().remove();
              };

              init();
              resize(element[0].clientWidth, element[0].clientHeight);

              $window.addEventListener('resize', function() {
                onResize(element[0].clientWidth, element[0].clientHeight);
              });

              //make sure channelsDescription is loaded before rendering
              scope.$watch('data.channelsDescription', function(newVal) {
                if (newVal.length > 0) {
                  channelsDescription = newVal;
                }
              }, true);

              scope.$watch('data', function(data) {
                if (channelsDescription.length > 0) {
                  render(data);
                }
              }, true);

            }
          };
        });