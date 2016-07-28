
var ResourceActivity = ResourceActivity || {

  run: function() {
    if(!ResourceActivity.__INTERVAL) {
      ResourceActivity.__INTERVAL = setInterval(function() {
        ResourceActivity.__doRun();
      }, 5000);
    }
  },

  __doRun: function() {
    if(ResourceActivity.__RESOURCES) {
      for(var k in ResourceActivity.__RESOURCES) {
        var r = ResourceActivity.__RESOURCES[k];
        ResourceActivity.__fetchActivity(r, function(res) {
          if(res) {
            res.commands.forEach(function(c) {
              // send event
              $.event.trigger(jQuery.Event("resourceActivityDone",
                { time: new Date(),
                  lastMessage: c.div.html(),
                  resource: res.resource,
                  command: c.command }));
            });
            delete ResourceActivity.__RESOURCES[res.type+"/"+res.resource];
            if(jQuery.isEmptyObject(ResourceActivity.__RESOURCES)) {
              // send event
              $.event.trigger(jQuery.Event("allResourceActivityDone",
                { time: new Date() }));
            }
          }
        });
      }
    }
  },

  add: function(resource, type, displayLabel, command, replaceMessage) {
    var key = type+"/"+resource;
    if(!ResourceActivity.__RESOURCES[key]) {
      ResourceActivity.__RESOURCES[key] = {
        resource: resource,
        type: type,
        commands: []
      };
    }
    ResourceActivity.__RESOURCES[key].commands.push({
      displayLabel: displayLabel,
      command: command,
      replaceMessage: replaceMessage,
      div: ResourceActivity.__getActivityDiv(resource, command)
    });
  },

  // PRIVATE

  __INTERVAL: null,

  __RESOURCES: {},

  __fetchActivity: function(r, next) {
    getJson("/ui/resourceactivity/" + r.type + "/" + r.resource,
      ResourceActivity.__makeFetchHandler(r, next),
      function() {next(null);}
    );
  },

  __makeFetchHandler: function(r, next) {
    return function(data) {
      if(data) {
        var keepGoing = false;
        for(var i in r.commands) {
          var c = r.commands[i];
          var command = c.command;
          var displayLabel = c.displayLabel;
          if(!(command) || command == ResourceActivity.__getCommandName(data)) {
            keepGoing = true;
            var commandObj = ResourceActivity.__getCommand(data);
            var state = ResourceActivity.__getCommandState(data);
            var activity = ResourceActivity.__getCommandActivity(data);
            // send event
            $.event.trigger(jQuery.Event("resourceActivity", { message: activity,
                time: new Date(),
                commandObj: commandObj,
                resource: r.resource,
                command: command }));
            if(c.replaceMessage) {
              (function() {
                var k = String(c.replaceMessage);
                $(".message").filter(function() {return $(this).attr("messageKey") == k;}).hide();
              })();
            }
            if(state == "error") {
              ResourceActivity.__renderError(r, displayLabel, command, activity, next);
            } else {
              ResourceActivity.__renderActivity(r, displayLabel, command, activity, next);
            }
            c.div.show();
          } else {
            c.div.hide();
          }
        }
        if(keepGoing) {
          return;
        }
      }
      next(r);
    };
  },

  __getCommand: function(data) {
    return data && "command" in data && data["command"];
  },

  __getCommandField: function(data, field) {
    var cmd = ResourceActivity.__getCommand(data);
    return cmd && cmd[field];
  },

  __getCommandName: function(data) {
    return ResourceActivity.__getCommandField(data, "_cmd");
  },

  __getCommandState: function(data) {
    return ResourceActivity.__getCommandField(data, "state");
  },

  __getCommandActivity: function(data) {
    var messages = ResourceActivity.__getCommandField(data, "displayMessages");
    if(messages && messages.length) {
      return messages;
    } else {
      return [ {"message": "Initializing..."} ];
    }
  },

  __getActivityDiv: function(resource, command) {
    return $(".resourceActivity[resource=" + resource + "][command=" + command + "]");
  },

  __doRenderActivity: function(r, displayLabel, command, activity, next) {
    // update feedback message
    if(activity && activity.length > 0) {
      var message = "[" + displayLabel + "] " + activity[activity.length-1].message;
      var $activityDiv = ResourceActivity.__getActivityDiv(r.resource, command);
      var $messageDiv = $activityDiv.find(".activityText");
      if($messageDiv.length && $messageDiv.html() != message) {
        $messageDiv.animate({"opacity":0}, 500, function() {
          $messageDiv.html(message);
          $messageDiv.animate({"opacity":1}, 500, function() {
            next(null);
          });
        });
        return;
      }
      next(null);
      return;
    }
    next(r);
  },

  __renderActivity: function(r, displayLabel, command, activity, next) {
    ResourceActivity.__doRenderActivity(r, displayLabel, command, activity, next);
    ResourceActivity.__getActivityDiv(r.resource, command).removeClass("error");
  },

  __renderError: function(r, displayLabel, command, activity, next) {
    ResourceActivity.__doRenderActivity(r, displayLabel, command, activity, next);
    ResourceActivity.__getActivityDiv(r.resource, command).addClass("error");
  }
};

$(document).ready(function() {
  ResourceActivity.run();
});
