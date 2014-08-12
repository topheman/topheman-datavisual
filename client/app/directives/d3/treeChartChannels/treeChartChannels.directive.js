'use strict';

angular.module('tophemanDatavizApp')
        .directive('treeChartChannels', function($window, d3Helpers) {
          return {
            template: '<style>tree-chart-channels{display:block;}tree-chart-channels svg{display:block;margin : 0 auto;}tree-chart-channels svg text{text-anchor:middle;}tree-chart-channels circle.clickable:hover{stroke : black;stroke-width : 2px;}</style>',
            restrict: 'E',
            scope: {
              aspectRatio: '=',
              data: '='
            },
            link: function(scope, element, attrs) {

              var DEFAULT_ASPECT_RATIO = 1.25;

              var d3 = $window.d3;

              var svg = null;
              var tree = null;
              var heightScale = null;
              var widthScale = null;

              var focusedChannelId = null;

              var treeChartChannels = {
                transition : 300,
                delay : 300
              };

              var treeChartSize = {
                height: null,
                width: null,
                margin : 5
              };

              var color = d3.scale.category20();

              //attach the static elements in the DOM
              var init = function() {
                svg = d3.select(element[0]).append('svg');
              };

              //bind the size attributes (will be triggered on resize event)
              var resize = function(width, height) {
                console.log('resize', width, height);

                tree = d3.layout.tree()
                        .size([treeChartSize.width - treeChartSize.margin * 2, treeChartSize.height - treeChartSize.margin * 2])
                        .padding(10);

              };

              var onResize = d3Helpers.debounce(resize, treeChartChannels.delay);

              var render = function(data) {
                
                var d3Data = d3Helpers.dataToD3TreeData(data);
                
                console.log('render',d3Data);

                var nodes = tree.nodes(d3Data);

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