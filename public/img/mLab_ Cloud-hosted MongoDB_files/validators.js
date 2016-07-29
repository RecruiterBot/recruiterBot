$(document).ready(function() {

  $.validator.addMethod("ec2SecurityGroup",
    function(value, element) {
      if (value == null) {
        return null;
      }

      value = value.trim();

      if (value.indexOf("sg-") == 0) {
        var hex = value.substring(3);
        if (hex.length < 8) {
          return null;
        }
        if (hex.search(/^[0-9a-f]*$/) != 0) {
          return null;
        }
      }

      return value;
    },
    "Invalid EC2 Security Group");


  $.validator.addMethod("ec2AccountId",
    function(value, element) {
      value = value.replace(/-/g, "");

      if(value.length != 12) {
        return null;
      }
      try {
        parseInt(value);
      } catch(err) {
        return null;
      }

      return value;
    },
    "Invalid AWS Account ID");


  $.validator.addMethod("ec2VpcId",
    function(value, element) {
      if(value.length != 12) {
        return null;
      }
      if(value.indexOf("vpc-") != 0) {
        return null;
      }

      return value;
    },
    "Invalid VPC ID");

});