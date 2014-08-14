'use strict';

angular.module('tophemanDatavizApp')
        .directive('treeChartChannels', function($window, d3Helpers) {
          return {
            template: '<style>tree-chart-channels{display:block;}tree-chart-channels svg{display:block;margin : 0 auto;}tree-chart-channels svg text{/**/}tree-chart-channels circle.clickable:hover{stroke : black;stroke-width : 2px;}</style>',
            restrict: 'E',
            scope: {
              aspectRatio: '=',
              data: '='
            },
            link: function(scope, element, attrs) {

              var DEFAULT_ASPECT_RATIO = 1.25;
              var aspectRatio = scope.aspectRatio || DEFAULT_ASPECT_RATIO;

              var d3 = $window.d3;

              var svg = null;
              var tree = null;
              var diagonal = null;
              var heightScale = null;
              var widthScale = null;

              var focusedChannelId = null;

              var treeChartChannels = {
                nodes: null,
                links: null,
                transition: 300,
                delay: 300
              };

              var treeChartSize = {
                height: null,
                width: null,
                margin: 5
              };

              var d3TreeDataStatic = null;

              var color = d3.scale.category20();


              //attach the static elements in the DOM
              var init = function() {
                svg = d3.select(element[0]).append('svg');

                treeChartChannels.nodes = svg.append('g')
                        .attr('class', 'node-group');

                treeChartChannels.links = svg.append('g')
                        .attr('class', 'link-group');
              };

              //bind the size attributes (will be triggered on resize event)
              var resize = function(width) {
                console.log('resize', width);
                var height = parseInt(width / aspectRatio);
                svg
                        .attr('height', height)
                        .attr('width', width);

                treeChartSize.height = height - 2 * treeChartSize.margin;
                treeChartSize.width = width - 2 * treeChartSize.margin;

                var transform = 'translate(' + treeChartSize.margin + ',' + treeChartSize.margin + ')';

                treeChartChannels.nodes
                        .attr('transform', transform);

                treeChartChannels.links
                        .attr('transform', transform);

                tree = d3.layout.tree()
                        .size([treeChartSize.width, treeChartSize.height]);

                diagonal = d3.svg.diagonal()
                        .projection(function(d) {
                          return [d.y - treeChartSize.margin, (d.x - treeChartSize.margin)/aspectRatio];
                        });//to flip vertical to horizontal

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

                var node = treeChartChannels.nodes.selectAll('text').data(nodes);

                node.enter()
                        .append('text');

                node.transition()
                        .attr('class', function(d) {
                          return 'node depth-' + d.depth;
                        })
                        .attr('transform', function(d) {
                          return 'translate(' + (d.y) + ',' + (d.x / aspectRatio) + ')';
                        })
                        .text(function(d) {
                          return d.name+'('+d.value+')';
                        });

                node.exit().remove();

                var links = treeChartChannels.links.selectAll('.link').data(links);

                links.enter()
                        .append('path');

                links.transition()
                        .attr('class', 'link')
                        .attr('stroke', 'gray')
                        .attr('fill', 'none')
                        .attr('d', diagonal);

                links.exit().remove();

                console.log('render', nodes);

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