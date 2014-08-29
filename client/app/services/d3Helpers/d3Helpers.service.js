'use strict';

angular.module('tophemanDatavizApp')
        .service('d3Helpers', function($timeout) {

          /**
           * Create a tree map to be used by d3 from static channelsDescription
           * Only the depth-0 and depth-1 nodes (root and channels, not keywords)
           * @param {Object} channelsDescription (from persistance.getData().channelsDescription)
           * @returns {Object}
           */
          var createD3TreeDataStatic = function(channelsDescription){
            var result = {};
            result.name = "Twitter";
            result.children = [];
            //prepare the depth-1 level based on static channelsDescription
            channelsDescription.forEach(function(channel, channelId){
              var channelResult = {
                name : channel.title,
                channelId : channelId,
                value : 0,//default count
                children : []
              };
              result.children.push(channelResult);
            });
            return result;
          };
          
          /**
           * Create a tree map to be used by d3 from static channelsDescription
           * Not like createD3TreeDataStatic, all the nodes (depth-0/1/2) are created and initiated to value=0 (root and channels, not keywords)
           * You can use updateD3TreeStatic to update this object with new incoming data
           * @param {Object} channelsDescription (from persistance.getData().channelsDescription)
           * @returns {Object}
           */
          var createD3TreeStatic = function(channelsDescription){
            var result = createD3TreeDataStatic(channelsDescription);
            channelsDescription.forEach(function(channel, channelId){
              channel.track.forEach(function(keyword){
                result.children[channelId].children.push({
                  name : keyword,
                  channelId : channelId,
                  value : 0//default count
                });
              });
            });
            return result;
          };
          
          /**
           * Returns an updated version of d3DataTreeStatic (previously creeated with createD3TreeStatic) with new data
           * @param {Object} d3DataTreeStatic
           * @param {Object} data
           * @returns {Object}
           */
          var updateD3TreeStatic = function(d3DataTreeStatic, data){
            var result = d3DataTreeStatic;
            //update depth-0 and depth-1 then create depth-2 with the data and data.channels
            result.value = data.count;
            for(var channelId in data.channels){
              var channel = data.channels[channelId];
              result.children[channelId].value = channel.count;//update count
              var i = 0,j = 0;
              for(var keyword in channel.keywords){
                var j = 0;
                for(j = 0; j < result.children[channelId].children.length; j++){
                  if(result.children[channelId].children[j].name.toLowerCase() === keyword){
                    result.children[channelId].children[j].value = channel.keywords[keyword].count;
                  }
                }
                i++;
              }
            }
            return result;
          };

          return {
            //from http://davidwalsh.name/javascript-debounce-function
            // Returns a function, that, as long as it continues to be invoked, will not
            // be triggered. The function will be called after it stops being called for
            // N milliseconds. If `immediate` is passed, trigger the function on the
            // leading edge, instead of the trailing.
            // edit : changed setTimeout and clearTimeout to use angular $timeout
            debounce: function(func, wait, immediate) {
              var timeout;
              return function() {
                var context = this, args = arguments;
                $timeout.cancel(timeout);
                timeout = $timeout(function() {
                  timeout = null;
                  if (!immediate)
                    func.apply(context, args);
                }, wait);
                if (immediate && !timeout)
                  func.apply(context, args);
              };
            },
            /**
             * Creates a data object to use in d3 tree/pack likes layout
             * This one is NOT static, the data is updated by data
             * @param {Object} data (from persistance.getData())
             * @returns {Object}
             */
            dataToD3TreeData : function(data){
              var result = createD3TreeDataStatic(data.channelsDescription);
              //update depth-0 and depth-1 then create depth-2 with the data and data.channels
              result.value = data.count;
              for(var channelId in data.channels){
                var channel = data.channels[channelId];
                result.children[channelId].value = channel.count;//update count
                for(var keyword in channel.keywords){
                  result.children[channelId].children.push({
                    name : channel.keywords[keyword].name,
                    value : channel.keywords[keyword].count,
                    channelId : parseInt(channelId)
                  });
                }
              }
              return result;
            },
            /**
             * Creates a data object to use in d3 tree/pack likes layout
             * This one is NOT static, the data is updated by data
             * @param {Object} data (from persistance.getData())
             * @param {Int} channelId
             * @returns {Object}
             */
            channelToD3TreeData : function(data, channelId){
              var result = {
                value : 0,
                channelId : channelId,
                children : []
              };
              if(data.channels && data.channels[channelId]){
                var channel = data.channels[channelId];
                result.value = channel.count;//update count
                for(var keyword in channel.keywords){
                  result.children.push({
                    name : channel.keywords[keyword].name,
                    value : channel.keywords[keyword].count,
                    channelId : channelId
                  });
                }
              }
              return result;
            },
            /**
             * Creates a data object to use in d3 tree/pack likes layout
             * This one is static, the data is NOT updated
             * @param {Object} channelsDescription (from persistance.getData().channelsDescription)
             * @returns {Object}
             */
            channelsDescriptionToD3TreeData : function(channelsDescription){
              var result = createD3TreeDataStatic(channelsDescription);
              channelsDescription.forEach(function(channel,channelId){
                channel.track.forEach(function(keyword){
                  result.children[channelId].children.push({
                    name : keyword,
                    channelId : channelId
                  });
                });
              });
              return result;
            },
            /**
             * Creates a data object to use in d3 tree/pack likes layout
             * This one is static, the data is NOT updated BUT it contains the children keywords with count set to 0
             * @param {Object} channelsDescription (from persistance.getData().channelsDescription)
             * @returns {Object}
             */
            channelsDescriptionToD3TreeDataStatic : createD3TreeStatic,
            /**
             * Returns an updated version of d3DataTreeStatic (previously creeated with createD3TreeStatic) with new data
             * @param {Object} d3DataTreeStatic
             * @param {Object} data
             * @returns {Object}
             */
            updateD3TreeDataStatic : updateD3TreeStatic
            
          };

        });
