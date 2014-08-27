'use strict';

angular.module('tophemanDatavizApp')
        .directive('packChartChannels', function($window, d3Helpers) {
          return {
            template: '<style>pack-chart-channels{display:block;}pack-chart-channels svg{display:block;margin : 0 auto;}pack-chart-channels svg text{text-anchor:middle;}pack-chart-channels circle.clickable:hover{stroke : black;stroke-width : 2px;}</style>',
            restrict: 'E',
            scope: {
              data: '='
            },
            link: function(scope, element, attrs) {

              var d3 = $window.d3;

              var svg = null;
              var pack = null;

              var focusedChannelId = null;

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
              
              var color = function(depth){
                var map = {
                  0 : "#FFECEC",
                  1 : "#FFBCBC",
                  2 : "white"
                };
                if(focusedChannelId !== null){
                  depth++;
                }
                return map[depth];
              };

              var onClick = function(d) {
                if (focusedChannelId === null && typeof d.channelId !== 'undefined') {
                  focusedChannelId = d.channelId;
                }
                else {
                  focusedChannelId = null;
                }
                d3.event.stopPropagation();
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
//                console.log('resize', width, height);
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
                var d3Data;

                if (focusedChannelId === null) {
                  d3Data = d3Helpers.dataToD3TreeData(data);
                }
                else {
                  d3Data = d3Helpers.channelToD3TreeData(data, focusedChannelId);
                }
//                console.log('render',d3Data);

                var nodes = pack.nodes(d3Data);

                var circles = packChartChannels.circleGroup.selectAll('.node').data(nodes);

                circles.enter()
                        .append('circle')
                        .attr('transform', function(d) {
                          return 'translate(' + (packChartSize.margin + packChartSize.diameter / 2) + ',' + (packChartSize.margin + packChartSize.diameter / 2) + ')';
                        })
                        .attr('fill', '#FFECEC')
                        .attr('stroke', 'gray')
                        .attr('stroke-width', 1)
                        .on('click', onClick);

                circles.transition()
                        .attr('fill', function(d) {
                          return color(d.depth);
                        })
                        .attr('class', function(d) {
                          return d.children ? 'node clickable' : 'node';
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
                        })
                        .on('click', onClick);

                texts.transition()
                        .attr('transform', function(d) {
                          return 'translate(' + (packChartSize.margin + d.x) + ',' + (packChartSize.margin + d.y) + ')';
                        })
                        .text(function(d) {
                          return d.depth === 1 ? d.name + '('+d.value+')' : "";
                        });

                texts.exit().remove();


              };

              init();
              resize(element[0].clientWidth, element[0].clientHeight);

              $window.addEventListener('resize', function() {
                onResize(element[0].clientWidth, element[0].clientHeight);
              });

              scope.$watch('data', function(data) {
                render(data);
              }, true);

            }
          };
        });