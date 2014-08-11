'use strict';

angular.module('tophemanDatavizApp')
        .directive('packChartChannels', function($window, d3Helpers) {
          return {
            template: '<style>pack-chart-channels{display:block;}pack-chart-channels svg{display:block;margin : 0 auto;}pack-chart-channels svg text{text-anchor:middle;}</style>',
            restrict: 'EA',
            scope: {
              data: '='
            },
            link: function(scope, element, attrs) {

              var d3 = $window.d3;

              var channelsDescription = [];

              var svg = null;
              var pack = null;

              var packChartChannels = {
                circleGroup: null,
                labelGroup: null,
                duration: 300,
                delay: 300
              };

              var packChartSize = {
                diameter: null,
                margin: 5
              };

              var color = d3.scale.linear()
                  .domain([0, 3])
                  .range(["#FFBCBC", "#900000"]);

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
                packChartSize.diameter = width;

                svg
                        .attr('width', packChartSize.diameter)
                        .attr('height', packChartSize.diameter);

                element[0].style.height = packChartSize.diameter + 'px';

                var transform = "translate(" + 0 + "," + 0 + ")";

                packChartChannels.circleGroup.attr("transform", transform);

                packChartChannels.labelGroup.attr("transform", transform);

                pack = d3.layout.pack()
                        .size([packChartSize.diameter - packChartSize.margin * 2, packChartSize.diameter - packChartSize.margin * 2])
                        .padding(10);

              };

              var onResize = d3Helpers.debounce(resize, packChartChannels.delay);

              var render = function(data) {
                console.log('render');
                var d3Data = d3Helpers.dataToD3TreeData(data, channelsDescription);

                var nodes = pack.nodes(d3Data);

                var circles = packChartChannels.circleGroup.selectAll('.node').data(nodes);

                circles.enter()
                        .append('circle')
                        .attr('transform', function(d) {
                          return 'translate(' + (packChartSize.margin + packChartSize.diameter / 2) + ',' + (packChartSize.margin + packChartSize.diameter / 2) + ')';
                        })
                        .attr('fill', 'white')
                        .attr('stroke', 'gray')
                        .attr('stroke-width', 1);

                circles.transition()
                        .attr('fill', function(d){
                          return d.parent && d.parent.parent ? 'white' : color(d.depth);
                        })
                        .attr('class', function(d) {
                          return 'node depth-' + d.depth + ' ' + d.name;
                        })
                        .attr('transform', function(d) {
                          return 'translate(' + (packChartSize.margin + d.x) + ',' + (packChartSize.margin + d.y) + ')';
                        })
                        .attr('r', function(d) {
                          return d.r;
                        });

                circles.exit().remove();

                var texts = packChartChannels.labelGroup.selectAll('.node').data(nodes);

                texts.enter()
                        .append('text')
                        .attr('class', function(d) {
                          return 'node depth-' + d.depth + ' ' + d.name;
                        })
                        .attr('transform', function(d) {
                          return 'translate(' + packChartSize.diameter / 2 + ',' + packChartSize.diameter / 2 + ')';
                        });

                texts.transition()
                        .attr('transform', function(d) {
                          return 'translate(' + (packChartSize.margin + d.x) + ',' + (packChartSize.margin + d.y) + ')';
                        })
                        .text(function(d) {
                          return d.depth === 1 ? d.name : "";
//                          return d.depth > 1 ? d.name : "";
//                          return d.name;
                        });


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