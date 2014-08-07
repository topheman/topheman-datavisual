'use strict';

angular.module('tophemanDatavizApp')
        .directive('pieChannel', function($window, d3Helpers) {
          return {
            template: '<style>pie-channel{display:block;} pie-channel svg {display:block;margin : 0 auto;} pie-channel .arc path:hover {opacity:0.8;}</style>',
            restrict: 'E',
            scope: {
              channel: '='
            },
            link: function(scope, element, attr) {

              var d3 = $window.d3;
              
              var svg = null;
              var arc = null;
              var scale = null;
              
              var RADIUS = 1;
              var INNER_RADIUS = 0.25;

              var pieChannel = {
                arcGroup: null,
                labelGroup: null,
                radius: null,
                innerRadius: null,
                duration: 300,
                delay: 300
              };

              var color = d3.scale.category10();

              var pie = d3.layout.pie()
                      .sort(function(d){
                        return d.name;
                      })
                      .value(function(d) {
                        return d.count;
                      });

              //attach the static elements in the DOM
              var init = function() {
                svg = d3.select(element[0]).append('svg');

                pieChannel.arcGroup = svg.append("g")
                        .attr("class", "arc");

                pieChannel.labelGroup = svg.append("g")
                        .attr("class", "label-group");
              };
              
              //bind the size attributes (will be triggered on resize event)
              var resize = function(width, height){
                var min = width = height = width;
                
                scale = function(num){
                  return num*min/2;
                };
                
                pieChannel.radius = RADIUS;
                pieChannel.innerRadius = INNER_RADIUS;
                
                var transform = "translate(" + width / 2 + "," + height / 2 + ")";
                
                svg
                        .attr('width', width)
                        .attr('height', height);
                
                element[0].style.height = height+'px';

                pieChannel.arcGroup.attr("transform", transform);

                pieChannel.labelGroup.attr("transform", transform);

                arc = d3.svg.arc()
                        .innerRadius(scale(pieChannel.innerRadius))
                        .outerRadius(scale(pieChannel.radius));
              };
              
              //callback to use on resize event (debounced first to prevent multiple unnecessary calls)
              var onResize = d3Helpers.debounce(resize,pieChannel.delay);

              //.data() enter/update/exit - bind on the change of the data
              var render = function(channelKeywords) {
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
              resize(element[0].clientWidth,element[0].clientHeight);
              
              $window.addEventListener('resize',function(){
                onResize(element[0].clientWidth,element[0].clientHeight);
              });

              scope.$watch('channel.keywords', function() {
                render(scope.channel.keywords);
              }, true);

            }
          };
        });