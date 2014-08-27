'use strict';

angular.module('tophemanDatavizApp')
        .directive('treeChartChannels', function($window, d3Helpers) {
          return {
            template: '<style>tree-chart-channels{display:block;}tree-chart-channels svg{display:block;margin : 0 auto;}tree-chart-channels svg text{/**/}tree-chart-channels circle.clickable:hover{stroke : black;stroke-width : 2px;}@media screen and (max-width: 420px){tree-chart-channels text{font-size:80%;}}</style>',
            restrict: 'E',
            scope: {
              aspectRatio: '=',
              data: '=',
              breakPoint: '=?'
            },
            link: function(scope, element, attrs) {

              var DEFAULT_ASPECT_RATIO = 1.25;
              var aspectRatio = scope.aspectRatio || DEFAULT_ASPECT_RATIO;
              var breakPoint = scope.breakPoint || 430;

              var d3 = $window.d3;

              var elemCurrentWidth = 500;//default;

              var svg = null;
              var tree = null;
              var diagonal = null;

              var rectsSizes = [];

              var treeChartChannels = {
                rects: null,
                texts: null,
                links: null,
                transition: 300,
                delay: 300
              };

              var treeChartSize = {
                height: null,
                width: null,
                margin: 5,
                rectsHeight: 20,
                rectsMargin: 10
              };

              var color = function(depth) {
                var map = {
                  0: "#FFECEC",
                  1: "#FFBCBC",
                  2: "white"
                };
                return map[depth];
              };

              var rectsHeight = function() {
                if (elemCurrentWidth > breakPoint) {
                  return 20;
                }
                else {
                  return 15;
                }
              };

              var rectsMargin = function() {
                if (elemCurrentWidth > breakPoint) {
                  return 10;
                }
                else {
                  return 7;
                }
              }

              var d3TreeDataStatic = null;

              //attach the static elements in the DOM
              var init = function() {
                svg = d3.select(element[0]).append('svg');

                treeChartChannels.links = svg.append('g')
                        .attr('class', 'link-group');

                treeChartChannels.rects = svg.append('g')
                        .attr('class', 'rect-group');

                treeChartChannels.texts = svg.append('g')
                        .attr('class', 'text-group');
              };

              //bind the size attributes (will be triggered on resize event)
              var resize = function(width) {
//                console.log('resize', width);
                elemCurrentWidth = width;
                var height = parseInt(width / aspectRatio);
                svg
                        .attr('height', height)
                        .attr('width', width);

                treeChartSize.height = height - 2 * treeChartSize.margin;
                treeChartSize.width = width - 2 * treeChartSize.margin;

                var transform = 'translate(' + treeChartSize.margin + ',' + treeChartSize.margin + ')';

                treeChartChannels.links
                        .attr('transform', transform);

                treeChartChannels.rects
                        .attr('transform', transform);

                treeChartChannels.texts
                        .attr('transform', transform);

                tree = d3.layout.tree()
                        .size([treeChartSize.width, treeChartSize.height]);

                diagonal = d3.svg.diagonal()
                        .projection(function(d) {
                          return [d.y - treeChartSize.margin, (d.x - treeChartSize.margin) / aspectRatio];
                        });

              };

              var onResize = d3Helpers.debounce(resize, treeChartChannels.delay);

              var render = function(data) {

                if (d3TreeDataStatic === null) {
                  if (data.channelsDescription && data.channelsDescription.length > 0) {
                    d3TreeDataStatic = d3Helpers.channelsDescriptionToD3TreeDataStatic(data.channelsDescription);
                  }
                  else {
                    return false;
                  }
                }

                var d3Data = d3Helpers.updateD3TreeDataStatic(d3TreeDataStatic, data);

                var nodes = tree.nodes(d3Data);
                var links = tree.links(nodes);

                var links = treeChartChannels.links.selectAll('.link').data(links);

                links.enter()
                        .append('path');

                links
                        .attr('class', 'link')
                        .attr('stroke', 'gray')
                        .attr('fill', 'none')
                        .attr('d', diagonal);

                links.exit().remove();

                var rects = treeChartChannels.rects.selectAll('rect').data(nodes);

                rects.enter()
                        .append('rect');
                
                rects
                        .attr('x', function(d) {
                          return d.y - rectsMargin();
                        })
                        .attr('y', function(d) {
                          return d.x / aspectRatio + treeChartSize.margin - rectsHeight();
                        });

                rects.transition()
                        .attr('class', function(d) {
                          return 'rect depth-' + d.depth;
                        })
                        .attr('height', function(d) {
                          return rectsHeight();
                        })
                        .attr('width', function(d) {
                          return rectsSizes[d.name + d.depth] ? rectsSizes[d.name + d.depth] + 2 * rectsMargin() : 0;
                        })
                        .style('fill', function(d) {
                          return color(d.depth);
                        })
                                .attr('rx',3)
                                .attr('ry',3)
                        .attr('stroke', 'black');

                rects.exit().remove();

                var text = treeChartChannels.texts.selectAll('text').data(nodes);

                text.enter()
                        .append('text');
                
                text
                        .attr('transform', function(d) {
                          return 'translate(' + (d.y) + ',' + (d.x / aspectRatio) + ')';
                        });

                text.transition()
                        .attr('class', function(d) {
                          rectsSizes[d.name + d.depth] = this.getComputedTextLength();//set the text length
                          return 'node depth-' + d.depth;
                        })
                        .text(function(d) {
                          return d.name + '(' + d.value + ')';
                        });

                text.exit().remove();

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