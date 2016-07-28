/**
 * User: robert
 * Date: 1/2/13
 * Time: 11:42 AM
 */
function apiQueryParams(mode) {
    var queryParams = {};
    if (mode) queryParams["mode"] = mode;
    return queryParams;
}

function pollDatabaseStatus(dbName, rowId, statusUrl, retries, noLinks) {
    $("#"+rowId).removeClass('link');
    $("#"+rowId).addClass('nolink');
    getJson(statusUrl,
            function(data) {
                if(isDatabaseUnderConstruction(data)) {
                    var error = getConstructionError(data);
                    if(error) {
                        handleDatabaseConstructionError(rowId, error);
                        stopDatabasePolling(rowId);
                    } else {
                        updateDatabaseLoadingIndicator(rowId, data, function() { pollDatabaseStatus(dbName, rowId, statusUrl, null, noLinks); });
                    }
                } else {
                    makeDatabaseRowPopulator(rowId, noLinks)(data);
                    stopDatabasePolling(rowId);
                }
            },
            function() {
                if(retries && retries >= 3) {
                    makeDatabaseRowPopulator(rowId, noLinks)(null);
                } else {
                    pollDatabaseStatus(dbName, rowId, statusUrl, (retries || 0) + 1, noLinks);
                }
            });
}

function isDatabaseUnderConstruction(status) {
    return status && (("underConstruction" in status && status["underConstruction"]) ||
                      ("loggedState" in status && status["loggedState"] && status["loggedState"] != "provisioned"));
}

function getConstructionError(status) {
    return status && "constructionError" in status && status["constructionError"];
}

function updateDatabaseLoadingIndicator(rowId, data, next) {
    // update feedback message
    showAllFeedback(rowId, data.progress, next);
}

function showAllFeedback(rowId, messages, next) {
    var $feedback = $("#"+rowId+" .loadingDatabase .loading");
    var $lastActivityTime = $("#"+rowId+" .loadingDatabase .lastActivityTime");
    if( ! $lastActivityTime.html() ) {
        var seedTime = new Date().getTime();
        if(messages && messages.length > 0) {
            var lastMsgTime = messages[messages.length-1].ts["$date"];
            if(lastMsgTime < seedTime) {
                seedTime = lastMsgTime;
            }
        }
        $lastActivityTime.html(seedTime - 5000);
    }
    if(messages && messages.length > 0) {
        var m = messages.shift();
        var t = m.ts && m.ts["$date"];
        if( t > $lastActivityTime.html() ) {
            var message = m.message;
            if($feedback.html() != message) {
                $feedback.animate({"opacity":0}, 500, function() {
                        $feedback.html(message);
                        $feedback.animate({"opacity":1}, 500, function() {
                                $lastActivityTime.html(t);
                                setTimeout(function() { showAllFeedback(rowId, messages, next)}, 2000);
                            });
                    });
                return;
            }
        }
        showAllFeedback(rowId, messages, next);
        return;
    }
    setTimeout(next, 3000);
}

function stopDatabasePolling(rowId) {
    // linkify the row
    $("#"+rowId).addClass('link');
    $("#"+rowId).removeClass('nolink');
    $("#"+rowId+" .actionBtns").show();
    $("#"+rowId).effect("highlight", {color: "#A6CBE1"}, 3000);
}
function populateDatabasesTable(tableId, cluster, server, connection, systemDbs, flush, enableEarlyLinks, noLinks) {
    var dbNamesUrl = getRootPortalApiUrl()+makeBaseEntityUrl(cluster, server, connection);
    var params = apiQueryParams(flush && "flush");
    if(systemDbs) {
        params["systemOnly"] = true;
    } else {
        params["userOnly"] = true;
    }
    if(!cluster && !server && !connection) {
        params["multiTenantOnly"] = true;
    }
    dbNamesUrl += "/databases"+serializeUrlParams(params);
    var hideLoadingIndicator = function() {
        var $loading = $("#"+tableId+"-loading");
        if($loading.is(":visible")) {
            $loading.slideUp();
        } else {
            $loading.hide();
        }
    };
    getJson(dbNamesUrl,
            function(data) {
                hideLoadingIndicator();
                $("#"+cluster+"Loading").remove();
                if(data && data.length > 0) {
                    populateDatabasesTableRows(tableId, data, cluster, server, connection, flush, enableEarlyLinks, noLinks);
                } else {
                    $("#"+tableId+"-none").slideDown();
                }
            },
            function() {
                $("#"+cluster+"Loading").remove();
                hideLoadingIndicator();
                $("#"+tableId+"-error").slideDown();
            }
            );
}

function populateDatabasesTableRows(tableId, names, cluster, server, connection, flush, enableEarlyLinks, noLinks) {
    var $tbody = $("#"+tableId+" tbody");
    var rowIdPrefix = tableId+"-tr-";

    $tbody.empty();
    for(var i in names) {
        var name = names[i];
        var rowId = rowIdPrefix + i;
        $tbody.append('<tr id="'+rowId+'" class="databaseTableDataRow" clusterId="'+cluster+'" serverId="'+server+'" connectionId="'+connection+'"></tr>');
        var $row = $("#"+rowId);
        $row.append('<td class="databaseName">'+name+'</td>');
        if(!cluster && !server && !connection) {
            $row.append('<td class="planName loadingDatabaseComplete"></td>');
            $row.append('<td class="cloudName loadingDatabaseComplete"></td>');
        }
        $row.append('<td class="number numObjects loadingDatabaseComplete"></td>');
        $row.append('<td class="number size loadingDatabaseComplete"></td>');
        $row.append('<td class="number fileSize loadingDatabaseComplete"></td>');
        $row.append('<td colspan="100" class="loadingDatabase"><div class="loadingWheel"></div><span class="loading">Loading...</span><span class="lastActivityTime" style="display:none"></span></td>');
        $row.append('<td colspan="100" class="loadingDatabaseFailed" style="display:none"><span class="loadingError">too busy/slow to respond</span></td>');
        $row.append('<td colspan="100" class="notCalculatingStats" style="display:none"><span>not calculating due to large number of databases</span></td>');
        // make row clickable before loading if desired
        if(enableEarlyLinks && !noLinks) {
            linkifyDatabaseRow(rowId);
        }
    }
    // color the rows
    $("#"+tableId+" tr.databaseTableDataRow:even").addClass("even");
    $("#"+tableId+" tr.databaseTableDataRow:odd").addClass("odd");

    // cluster puck databases should not look linkable
    $("div.cluster-summary #"+tableId+" tr.databaseTableDataRow:hover").addClass("nolink");
    $("div.cluster-summary #"+tableId+" tr.databaseTableDataRow").addClass("nolink");

    // attach contextual help
    bindSpecificHelp( $(".size"), 'data plus indexes' );
    bindSpecificHelp( $(".fileSize"), 'File Size' );
    // show the table
    $("#"+tableId+"-div").slideDown();
    var queryString = serializeUrlParams(apiQueryParams(flush && "flush"));
    if(names.length > 25) {
      // show N/A
      var $rows = $("#"+tableId+" tr.databaseTableDataRow");
      $rows.find(".loadingDatabase").hide();
      $rows.find(".notCalculatingStats").show();
      if(!noLinks) {
        $rows.each(function() {
          linkifyDatabaseRow($(this));
        });
      }
    } else {
      for(i in names) {
        name = names[i];
        rowId = rowIdPrefix + i;
        var dbStatusUrl = getRootPortalApiUrl()+makeBaseEntityUrl(cluster, server, connection);
        dbStatusUrl += "/databases/"+escape(name)+"/status"+queryString;
        var resultHandler = null;
        if(connection) {
          resultHandler = makeDatabaseRowPopulator(rowId, noLinks);
        } else {
          resultHandler = makePollingDatabaseRowPopulator(rowId, name, dbStatusUrl, noLinks);
        }
        getJson(dbStatusUrl, resultHandler, resultHandler);
      }
    }
}

function makePollingDatabaseRowPopulator(rowId, name, statusUrl, noLinks) {
    return function(data) {
        if(isDatabaseUnderConstruction(data)) {
            var error = getConstructionError(data);
            if(error) {
                handleDatabaseConstructionError(rowId, error);
            } else {
                $("#"+rowId+" .loadingDatabase .loading").html("Thanks for your patience as we work on your database...")
                    // turn on loading wheel
                    var opts = { lines: 9,  length: 0,  width: 2,  radius: 5,  corners: 1,  rotate: 0,  color: '#A6CBE1',  speed: 1,  trail: 40,  className: 'spinner' };
                new Spinner(opts).spin($("#"+rowId+" .loadingDatabase .loadingWheel")[0]);
                pollDatabaseStatus(name, rowId, statusUrl, null, noLinks);
            }
        } else {
            makeDatabaseRowPopulator(rowId, noLinks)(data);
        }
    };
}

function makeDatabaseRowPopulator(rowId, noLinks) {
    return function(data) {
        if(data && data["stats"]) {
            populateDbStatsRow(
                               rowId,
                               data["plan"] ? data["plan"]["name"] : "",
                               data["cloud"] ? data["cloud"]["name"] : "",
                               data["stats"]["objects"],
                               data["prettyStats"]["prettyFullSize"],
                               data["prettyStats"]["prettyFileSize"]);
        } else {
            $("#"+rowId+" .loadingDatabase").hide();
            $("#"+rowId+" .loadingDatabaseFailed").show();
        }
        if(!noLinks) {
            linkifyDatabaseRow(rowId);
        }
    };
}

var CONSTRUCTION_ERROR_CONTENTS = {
    "text search not enabled": "The source database contains a text index, which is not supported by the selected plan.  Please select an Experimental Sandbox database if you'd like to use text indexes.",
    "create collection invalid size spec": '<p>An error occurred while cloning data from the source database:</p><p style="font-family:monospace">create collection invalid size spec</p><p>This is caused by a known incompatibility in collection metadata between MongoDB v2.4 and older versions: <a href="https://jira.mongodb.org/browse/SERVER-9501" target="_blank">SERVER-9501</a>  For more information, including viable workarounds, please refer to the linked issue.</p>',
    "Connection refused": "An error occurred while cloning data from the source database because it is currently unreachable.  Please verify that there are no firewalls or network restrictions preventing access to your database and try again."
};

function getConstructionErrorMesage(msg) {
    if(msg) {
        for(var key in CONSTRUCTION_ERROR_CONTENTS) {
            if(msg.indexOf(key) >= 0) {
                return CONSTRUCTION_ERROR_CONTENTS[key];
            }
        }
    }
    return null;
}

function makeConstructionErrorDialogContent(dialogId, message) {
    if(message) {
        return '<span class="ui-icon ui-icon-alert"></span>'+
            '<span class="constructionErrorMessage">'+message+'</span>'+
            '<p>Please contact <a href="javascript:mailto();" style="text-decoration:underline">support@mlab.com</a>'+
            ' with questions if you think you\'ve resolved the problem and would like us to try re-running the operation.'+
            '  If you\'d like to remove this subscription, please '+
            '<a href="javascript:submitConstructionDeleteForm(\''+dialogId+'\');" class="link">click here</a>.';
    } else {
        return '<span class="ui-icon ui-icon-alert"></span>'+
            '<span class="constructionErrorMessage">An unexpected error occurred while building your subscription.</span>'+
            '<p>Please contact <a href="javascript:mailto();" style="text-decoration:underline">support@mlab.com</a>'+
            ' for assistance and more information.'+
            '  If you\'d like to remove this subscription, please '+
            '<a href="javascript:submitConstructionDeleteForm(\''+dialogId+'\');" class="link">click here</a>.';
    }
}

function makeDbConstructionErrorDialogOpener(rowId, message) {
    var $row = $("#"+rowId);
    var db = $row.find(".databaseName").html();
    return makeConstructionErrorDialogOpener("DbConstructionErrorDeleteForm", message, db);
}

function submitConstructionDeleteForm(dialogId) {
    $("#"+dialogId).submit();
}

function handleDatabaseConstructionError(rowId, error) {
    var $row = $("#"+rowId);
    var msg = getConstructionErrorMesage(error.message);
    $row.append('<td colspan="100" class="constructionError" style="display:none"><span class="errorData">Error creating database.  Click here for more info.</span></td>');
    $row.click(makeDbConstructionErrorDialogOpener(rowId, msg));
    $row.addClass("link");
    $row.find(".loadingDatabase").hide();
    $row.find(".constructionError").show();
}

function linkifyDatabaseRow(row) {
    if(typeof row == "string") {
      row = $("#"+row);
    }
    if(!row.hasClass("link")) {
        row.click(makeDatabaseRowClickHandler(row.attr("id")));
        row.addClass("link");
    }
}

function makeDatabaseRowClickHandler(rowId) {
    var $row = $("#"+rowId);
    var cluster = $row.attr("clusterId");
    var server = $row.attr("serverId");
    var connection = $row.attr("connectionId");
    var dbName = $row.find(".databaseName").html();
    var url = makeBaseEntityUrl(cluster, server, connection)+"/databases/"+escape(dbName);
    return function() {
        location.href = url;
    }
}

function makeBaseEntityUrl(cluster, server, connection) {
    var url = "";
    if(connection) {
        url += "/connections/"+connection;
        if(cluster && server) {
            url += "/servers/"+server;
        }
    } else if(cluster) {
        url += "/clusters/"+cluster;
        if(server) {
            url += "/servers/"+server;
        }
    } else if(server) {
        url += "/servers/"+server;
    }
    return url;
}

function populateDbStatsRow(rowId, planName, cloudName, numObjects, fullSize, fileSize) {
    $("#"+rowId+" .planName").html(planName);
    $("#"+rowId+" .numObjects").html(numObjects);
    $("#"+rowId+" .size").html(fullSize);
    $("#"+rowId+" .fileSize").html(fileSize);
    $("#"+rowId+" .cloudName").html(cloudName);
    $("#"+rowId+" .number").attr("nowrap", true);
    $("#"+rowId+" .loadingDatabase").hide();
    $("#"+rowId+" .loadingDatabaseComplete").show();
    $("#"+rowId+" .number").commas();
}

function populateClusterStatus(clusterId, data) {
    var $statusDiv = $("#"+clusterId+"-status .healthStatusDisplay");
    var $lagDiv = $("#"+clusterId+"-status .replicationLagValue");
    var $planNameDiv = $("#"+clusterId+"-status .clusterPlan");
    var $cloudDiv = $("#"+clusterId+"-status .clusterCloud");
    if(data) {
        var statusValue = data["overallStatus"];
        $statusDiv.html(statusValue);

        // determine CSS class
        var statusStyle = "healthStatus3";
        if(statusValue == "up") {
            statusStyle = "healthStatus1";
        } else if(statusValue == "warning") {
            statusStyle = "healthStatus2";
        } else if(statusValue == "down") {
            statusStyle = "healthStatus0";
        } else if(statusValue == "under construction") {
            statusStyle = "healthStatus4";
        }
        $statusDiv.addClass(statusStyle);

        // calculate repl lag phrase
        if("replicationLag" in data && data["replicationLag"]) {
          var lag = data["replicationLag"];
          if(lag < 0) {
            $lagDiv.addClass("repLag-unrecoverable");
            $lagDiv.html("unrecoverable");
          } else {
            var phrase = data["replicationLagPhrase"];
            if(phrase) {
              $lagDiv.addClass("repLag-"+data["replicationLagUnit"]);
              $lagDiv.html(phrase);
            } else {
              $("#"+clusterId+"-status .replicationLag").hide();
            }
          }
        } else {
          $lagDiv.html("unknown");
        }

        // add plan description
        $planNameDiv.html(data["planDescription"]);

        // add cloud name
        if(data["cloudName"]) {
            $cloudDiv.html(data["cloudName"]);
        }
    } else {
        $statusDiv.addClass("healthStatus4");
        $statusDiv.html("unknown");
        $lagDiv.addClass("repLag-unknown");
        $lagDiv.html("unknown");
        $planNameDiv.addClass("clusterPlanUnknown");
        $planNameDiv.html("unknown");
    }
    $statusDiv.removeClass("healthStatusLoading");
    $lagDiv.removeClass("repLag-loading");
    $planNameDiv.removeClass("clusterPlanLoading");
    $("#"+clusterId+"-status").fadeIn("slow");
}

function populateClusterStatusError(clusterId) {
    var $statusDiv = $("#"+clusterId+"-status .healthStatusDisplay");
    var $lagDiv = $("#"+clusterId+"-status .replicationLagValue");
    var $planNameDiv = $("#"+clusterId+"-status .clusterPlan");
    $statusDiv.removeClass("healthStatusLoading");
    $lagDiv.removeClass("repLag-loading");
    $planNameDiv.removeClass("clusterPlanLoading");
    $statusDiv.addClass("healthStatus4");
    $statusDiv.html("unknown");
    $lagDiv.addClass("repLag-unknown");
    $lagDiv.html("unknown");
    $planNameDiv.addClass("clusterPlanUnknown");
    $planNameDiv.html("unknown");
    $("#"+clusterId+"-status").fadeIn("slow");
}

function fetchClusterStatus(clusterId, flush) {
    var params = apiQueryParams(flush && "flush");
    var url = getRootPortalApiUrl() + "/clusters/" + clusterId + "/status" + serializeUrlParams(params);
    getJson(url, populateClusterStatus, populateClusterStatusError);
}

function makeClusterConstructionErrorDialogOpener(clusterId, message) {
    return makeConstructionErrorDialogOpener("ClusterConstructionErrorDeleteForm", message, clusterId);
}

function makeConstructionErrorDialogOpener(dialogId, message, arg) {
    return function() {
        var $dialog = $("#"+dialogId);
        if($dialog.length) {
            // add dialog content
            $dialog.find("div").html(makeConstructionErrorDialogContent(dialogId, message));
            // set input value
            $dialog.find("input").val(arg);
            openDialog("#"+dialogId);
        }
    }
}

function handleClusterConstructionError(clusterId, error) {
    var $completeDiv = $("#"+clusterId+"ConstructionCompleteDiv");
    // change contents of completion div
    $completeDiv.html('<span class="errorData">We encountered an error while working on this deployment. Click for more info.</span>');
    // disable links to cluster pages
    $("#"+clusterId+"-status").addClass("constructionError");
    var $clusterPuck = $("#"+clusterId+"-section");
    $clusterPuck.addClass("constructionError");
    // make cluster puck open error dialog
    var msg = getConstructionErrorMesage(error.message);
    $clusterPuck.click(makeClusterConstructionErrorDialogOpener(clusterId, msg));
    $clusterPuck.addClass("link");
    // show new content
    $("#"+clusterId+"UnderConstructionDiv").hide();
    $completeDiv.show();
}

function makeClusterStatusHandler(clusterId) {
    return function(data) {
        $("#"+clusterId+"Loading").remove();
        if(data && (data["overallStatus"] != "under construction")) {
            stopClusterPolling(clusterId);
            if($("#"+clusterId+"UnderConstructionDiv:visible").length) {
                setTimeout(function() { clusterWakeUp(clusterId, null); }, 4000);
            } else {
                clusterWakeUp(clusterId, data);
            }
        } else {
            var error = getConstructionError(data);
            if(error) {
                handleClusterConstructionError(clusterId, error);
            } else {
                updateClusterLoadingIndicator(clusterId, data);
                setTimeout(function() { pollClusterStatus(clusterId); }, 5000);
            }
        }
    }
}

function clusterWakeUp(clusterId, data) {
    populateDatabasesTable(clusterId+"-DATABASES", clusterId, null, null, false, true, false, true);
    if(data) {
        populateClusterStatus(clusterId, data);
    } else {
        fetchClusterStatus(clusterId, true);
    }
}

function loadCluster(clusterId, noLinks) {
    if(!noLinks) {
        linkifyClusterStatus(clusterId);
        //linkifyClusterTitle(clusterId);
        linkifyClusterSection(clusterId);
    }
    var url = getRootPortalApiUrl()+"/clusters/"+clusterId+"/status";
    getJson(url, makeClusterStatusHandler(clusterId), null);
}

function pollClusterStatus(clusterId) {
    $("#"+clusterId+"UnderConstructionDiv").show();
    $("#"+clusterId+"ConstructionCompleteDiv").hide();
    var url = getRootPortalApiUrl()+"/clusters/"+clusterId+"/status";
    getJson(url, makeClusterStatusHandler(clusterId), null);
}

function updateClusterLoadingIndicator(clusterId, data) {
    // update indicator ellipsis
    var $indicator = $("#"+clusterId+"UnderConstructionDiv .loading");
    if($indicator.html().length < 3) {
        $indicator.html($indicator.html()+".");
    } else {
        $indicator.html("");
    }

    // update feedback message
    if(data && data.activity) {
        var activity = data.activity;
        var message = activity[activity.length-1].message;
        var $feedback = $("#"+clusterId+"UnderConstructionDiv .activity");
        if($feedback.html() != message) {
            $feedback.animate({"opacity":0}, 500, function() {
                    $feedback.html(message);
                    $feedback.animate({"opacity":1}, 500);
                });
        }
    }

}

function linkifyNode(nodeSelector, linkUri) {
    var theNode = $(nodeSelector);
    theNode.addClass("link");
    theNode.click(function () {
            if($(this).hasClass("constructionError")) {
                return;
            }
            location.href = linkUri;
        });
}
function linkifyClusterTitle(clusterId) {
    linkifyNode("#" + clusterId + "-title", "/clusters/" + clusterId);
}
function linkifyClusterSection(clusterId) {
    linkifyNode("#" + clusterId + "-section", "/clusters/" + clusterId);
}
function linkifyClusterStatus(clusterId) {
    linkifyNode("#" + clusterId + "-status", "/clusters/" + clusterId + "#servers");
}

function stopClusterPolling(clusterId) {
    var $constructionDiv = $("#"+clusterId+"UnderConstructionDiv:visible");
    if($constructionDiv.length) {
        $constructionDiv.hide();
        $("#"+clusterId+"ConstructionCompleteDiv").show();
        $("#"+clusterId+"-title").parent().effect("highlight", {color: "#A6CBE1"}, 3000);
    }
}

function fetchCollectionNames(success, error) {
    var collectionNamesUrl = getPortalApiUrl("database")+"/collections";
    var params = {"mode":"raw"};
    collectionNamesUrl += serializeUrlParams(params);
    getJson(collectionNamesUrl, success, error);
}

function fetchCollectionStats(success, error) {
    var collectionNamesUrl = getPortalApiUrl("database")+"/status";
    var params = {"mode":"raw", "collectionStats":"true"};
    collectionNamesUrl += serializeUrlParams(params);
    getJson(collectionNamesUrl, success, error);
}

function populateServerStatuses(clusterId, next) {
  $(".statusField").html("loading...");
  var params = apiQueryParams();
  params["full"] = "true";
  var url = getRootPortalApiUrl() + "/clusters/" + clusterId + "/status" + serializeUrlParams(params);
  var processResponse =
    function(data) {
      if($("#servers").length) {
        processFailure();
        // populate replica set conf
        if(data["rsConf"]) {
          $("#replicaSetConfiguration").html(JSON.stringify(data["rsConf"], null, "  "));
        }
        // populate servers
        var members = data["members"];
        if(members) {
          var numNonNascentNodes = 0;
          for(var i=0; i < members.length; i++) {

            var member = members[i];
            var $row = $("#"+member["id"]);

            if (!member['server']['tags']['clonedFrom']) {
              numNonNascentNodes++;
            }
            if($row.length && member && member["selfReplStatus"]) {

              // set status CSS class
              var state = member["selfReplStatus"]["state"];
              $row.addClass("replState"+state);

              // populate state column
              var stateStr = member["selfReplStatus"]["stateStr"];
              $row.find(".memberStatus").html(stateStr);
              
              if($row.attr("hiddenNode") == "true") {
                var index = addFootnote("Server is hidden and not eligible to be primary")  
                $row.find(".hiddenFootnoteMarker").html("<sup>"+index+"</sup>");
              }

              // hide/show server operation links depending on state
              if(stateStr == "PRIMARY") {
                $("#"+member["id"]+" .primaryOnly").show()
                $("#"+member["id"]+" .secondaryOnly").hide()
                $("#"+member["id"]+" .loading").hide()
              }
              else if(stateStr == "SECONDARY"){
                // only if not a 'nascent' node
                if (!member["server"]["tags"]["clonedFrom"]) {
                  $("#"+member["id"]+" .primaryOnly").hide()
                  $("#"+member["id"]+" .secondaryOnly").show()
                  $("#"+member["id"]+" .loading").hide()
                }
              }
              // populate optime column
              var $optime = $row.find(".memberOptime");
              if(stateStr == "ARBITER") {
                $optime.html("");
              } else {
                $optime.addClass("optime-"+member["optimePhraseUnit"]+"-old");
                $optime.html(member["optimePhrase"]);
                var delay = getSlaveDelay(member);
                if(delay) {
                  var index = addFootnote("Server is configured with a slaveDelay of "+delay+" seconds");
                  $optime.append(" <sup>"+index+"</sup>");
                }
              }
              // populate uptime column
              var $uptime = $row.find(".memberUptime");
              $uptime.html(member["uptimePhrase"]);
            }
          }
          if (members.length != numNonNascentNodes) {
            $(".secondaryOnly").hide()
          }
        }
      }
      $.event.trigger(jQuery.Event("serverStatusLoaded",
        { message: "server status loaded",
          time: new Date(),
          statusData: data }));
      if(next) {
        next();
      }
    };
    var processFailure = function() {
      $(".statusField").html("");
      if(next) {
        next();
      }
    };
    getJson(url, processResponse, processFailure);
}

function getSlaveDelay(member) {
    if(member && member["serverStatus"] && member["serverStatus"]["repl"]) {
        return member["serverStatus"]["repl"]["slaveDelay"];
    }
}

function addFootnote(message) {
    var $footnotes = $("#serverFootnotes");
    var index = $footnotes.find(".footnote").length + 1;
    $footnotes.show();
    $footnotes.append("<div class=\"footnote\"><sup class=\"index\">"+index+"</sup>"+message+"</div>");
    return index;
}

/******************************************************************************
 * Backups dynamic portal methods
 *****************************************************************************/

function fetchBackupInfo(apiKey, backupId, success, error){
    var statusUrl = BACKUP_API_URL + "/m-get-backup-info";
    var params = {"apiKey":apiKey, "backupId":backupId, "full":1};
    statusUrl += serializeUrlParams(params);
    getJson(statusUrl, success, error);
}


function fetchResourceCbsInfo(apiKey, resourceId, success, error){
    var url = BACKUP_API_URL + "/m-resource-cbs-info";
    var resourceUri = "mongolab://" + resourceId
        var params = {"apiKey":apiKey, "resourceUri":resourceUri};
    url += serializeUrlParams(params);
    getJson(url, success, error);
}
