/** HeadLine
 *
 * Displays account-level messages at the top of the page.
 */
function HeadLine(config) {
  this.config = config;
  this.container = null;
  if(this.config.container) {
    this.container = $(this.config.container);
  }
}

HeadLine.prototype.render = function() {
  var self = this;
  var _doFetch = function() {
    $.get("/ui/messages", null, null, "json").success(
      function(messages) {
        var fetched = [];
        if (messages && messages.length) {
          for (var i in messages) {
            var m = messages[i];
            if(m && m._id) {
              fetched.push(m._id);
            }
            self._renderMessage(m);
          }
        }
        // remove any existing that are no longer needed
        self.container.find("div.message").filter(function() {
          return fetched.indexOf($(this).attr('messageId')) < 0;
        }).slideUp(function() {$(this).remove();});
      }
    );
  };
  if(this.container.length) {
    _doFetch();
    setInterval(_doFetch, 60000);
  }
};

HeadLine.prototype._renderMessage = function(m) {
  if(m && m._id && m.text) {
    var id = m._id;
    // if message already exists, abort
    if(this.container.find("div.message[messageId="+id+"]").length) {
      return;
    }
    var text = m.text;
    var level = m.level || "info";
    var actions = m.actions;
    var html = '<div messageId="'+id+'" class="'+level+' message" style="display: none">'+text+'<div class="messageActions"></div></div>';
    this.container.append(html);
    if(actions) {
      // add actions
      var $msg = this.container.find("div.message[messageId="+id+"]");
      var $actions = $msg.find(".messageActions");
      for(var i in actions) {
        var a = actions[i];
        $actions.append('<div class="messageAction" action="'+a.action+'">'+a.label+'</div>');
      }
      // make actions clickable
      $actions.find(".messageAction").click(function() {
        if(!$msg.hasClass("pending")) {
          $msg.addClass("pending");
          var action = $(this).attr("action");
          if(action) {
            // send action
            return $.ajax({
              url: "/ui/messages/"+id,
              type: 'PUT',
              success: function() {
                // remove message once action is taken
                $msg.slideUp(function() { $msg.remove(); });
              },
              error: function() {
                $msg.removeClass("pending");
              },
              data: JSON.stringify({action: action}),
              contentType: "application/json"
            });
          } else {
            $msg.removeClass("pending");
          }
        }
      });
      // reveal message
      $msg.slideDown();
    }
  }
};
