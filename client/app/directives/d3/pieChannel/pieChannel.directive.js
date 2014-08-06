'use strict';

angular.module('tophemanDatavizApp')
        .directive('pieChannel', function($window) {
          return {
            template: '<style>pie-channel{display:block;} pie-channel svg {display:block;} pie-channel .arc path:hover {opacity:0.8;}</style>',
            restrict: 'E',
            scope: {
              channel: '='
            },
            link: function(scope, element, attr) {

              var d3 = $window.d3;

              var pieChannel = {
                arcGroup: null,
                labelGroup: null,
                radius: typeof attr.radius !== 'undefined' ? parseInt(attr.radius) : 200,
                innerRadius: typeof attr.innerRadius !== 'undefined' ? parseInt(attr.innerRadius) : 50,
                duration: 300,
                delay: 300
              };

              var color = d3.scale.category10();

              var init = function() {

                var width = pieChannel.radius * 2.2;
                var height = pieChannel.radius * 2.2;
                var transform = "translate(" + width / 2 + "," + height / 2 + ")";

                var svg = d3.select(element[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height);

                pieChannel.arcGroup = svg.append("g")
                        .attr("class", "arc")
                        .attr("transform", transform);

                pieChannel.labelGroup = svg.append("g")
                        .attr("class", "label-group")
                        .attr("transform", transform);
              };

              var arc = d3.svg.arc()
                      .innerRadius(pieChannel.innerRadius)
                      .outerRadius(pieChannel.radius);

              var pie = d3.layout.pie()
                      .sort(function(d){
                        return d.name;
                      })
                      .value(function(d) {
                        return d.count;
                      });

              scope.render = function(channelKeywords) {
                console.log('render');

                //preprocess data to d3Data
                var d3Data = [];
                for (var keyword in channelKeywords) {
                  d3Data.push({name: keyword, count: channelKeywords[keyword].count});
                }

                //paths
                var paths = pieChannel.arcGroup.selectAll("path").data(pie(d3Data));

                paths.enter().append("path")
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .attr("fill", "#ffffff");

                paths.transition()
                        .attr("fill", function(d, i) {
                          return color(i);
                        })
                        .duration(pieChannel.duration)
                        .delay(pieChannel.delay)
                        .attr("d", arc);

                paths.exit()
                        .transition()
                        .duration(pieChannel.duration)
                        .attr("fill", "#ffffff")
                        .remove();

                //labels
                var labels = pieChannel.labelGroup.selectAll('text.value').data(pie(d3Data));

                labels.enter().append("text")
                        .attr("class", "value");

                labels.transition()
                        .duration(pieChannel.duration)
                        .delay(pieChannel.delay)
                        .attr("transform", function(d) {
                          d.innerRadius = pieChannel.innerRadius;
                          d.outerRadius = pieChannel.radius;
                          return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("text-anchor", "middle")
                        .text(function(d, i) {
                          return d.data.name+'('+d.data.count+')';
                        });

                labels.exit().remove();

              };

              init();

              scope.$watch('channel.keywords', function() {
                scope.render(scope.channel.keywords);
              }, true);

            }
          };
        });