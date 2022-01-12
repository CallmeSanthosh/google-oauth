var  dropdown_iter = 0;
var j=0;
var add_total_weight=0;
var gpuflag = false;

var checkAdmin=false;




function checktoken(){

    $.ajax({
    type : "GET",
    url : "https://www.googleapis.com/oauth2/v1/userinfo?access_token="+sessionStorage.getItem("token"),
    dataType: 'json',
    success : function(data) {
      if(!data['email'].includes("@google.com")){
        logout();
        document.location.href = "http://localhost/google_config";
      }
      else
        $('body').removeClass('hide');
    },
    error: function(data) {
      document.location.href = "http://localhost/google_config";

    }
  });
}



checktoken();




var logout = function() {
    sessionStorage.clear();
    document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost/google_config";
}


function formsubmit(){
  var datas = {};
  var arr = [];

  datas.layerContent = $('#layercontent :selected').text().trim();
  datas.alpha = $("#Alpha").val();
  datas.beta = $("#Beta").val();
  datas.noOfIteration = $("#Iteration").val();  
  datas.keyword = "config";


// if(!datas.stylelayer && len==0 ){
//       $.notify("please fill atleast one style layer", "error");

//   // alert("please fill atleast one style layer");
// }
// else if(!datas.weight && len==0 ){
//         $.notify("please fill weight in number format", "error");

//   // alert("please fill weight in number format");
// }

var len = $("#liststyle > div").length;

console.log(len);

console.log(dropdown_iter);

var eleCategory = document.getElementById("liststyle");
var eleChild = eleCategory.getElementsByClassName("liststyle-div-padding");

var total_weight=0;


for(var i=0; i<eleChild.length; i++){
  var obj = {} ;
  var temp = eleChild[i].childNodes[0].childNodes[0].data;
  temp = temp.split("|");
  obj.stylelayer = temp[0].trim();
  obj.weight = temp[1].trim();
  total_weight+=parseFloat(obj.weight);
  arr.push(obj);
}




  // for (var j = 0; j <= dropdown_iter ; j++) {
  //     if(document.getElementById('style-'+j))
  //     {
  //     var data = document.getElementById('style-'+j).innerHTML;
  //     data = data.split("|");
  //     var obj = {} ;
  //     obj.stylelayer = data[0].trim();
  //     obj.weight = data[1].trim();
  //     total_weight+=parseFloat(obj.weight);
  //     arr.push(obj);
  //     }
  // }

if(total_weight!=1){
        $.notify("Sum of Weight should be 1", "error");
}


else if(len==0){
    $.notify("please fill atleast one style layer & weight", "error");
}

else if(!datas.alpha){
    $.notify("please fill alpha in number format", "error");

  // alert("please fill alpha in number format");
}
else if(!datas.beta){
    $.notify("please fill beta in number format", "error");

  // alert("please fill beta in number format");
}
else if(!datas.noOfIteration){
    $.notify("please fill no of Iteration in number format", "error");

  // alert("please fill no of Iteration in number format");
}
else if(!datas.layerContent){
    $.notify("please fill layer Content", "error");
  // alert("please fill layer Content");
}

  datas.styleLayer = arr;

  var data2 = JSON.stringify(datas);

if(datas.layerContent && datas.alpha && datas.beta && datas.noOfIteration && len>0 && total_weight==1 && datas.styleLayer){

  $.ajax({
    type : "POST",
    url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
    dataType: 'json',
    data: data2,
    success : function(data) {
    
      if(data.status==200){
        $.notify("Configuration details added successfully", "success");
        add_total_weight=0
        getConfigDetails();
      }

    },
    error: function(data) {      
      console.log(data);
    }
  });
  $('#Alpha').val('');
  $('#Beta').val('');
  $('#Iteration').val('');
  $("#liststyle").empty();
  }

}


function addstyleweight(){


var data = {};
// data.stylelayer = $("#stylelayer").val().trim();
data.stylelayer = $('#stylelayer :selected').text().trim();
data.weight = $("#Weight").val().trim();
// $('#stylelayer').val('');
$('#Weight').val('');


if(data.weight){
  add_total_weight+=parseFloat(data.weight);
}

var len = $("#liststyle > div").length;

if(!data.stylelayer && len==0 ){
      $.notify("please fill atleast one style layer", "error");

  // alert("please fill atleast one style layer");
}
else if(!data.weight && len==0 ){
        $.notify("please fill weight in number format", "error");

  // alert("please fill weight in number format");
}

else if(add_total_weight > 1.0){
        $.notify("Weight should not exceed 1", "error");
}

if(data.stylelayer && data.weight){
    var content = "<div class=\"panel panel-default panel-heading col-md-3 form-group\" id=\"div-style-"+dropdown_iter+"\"><div class=\"liststyle-div-padding\" id=\"data-style-"+dropdown_iter+"\"><span id=\"style-"+dropdown_iter+"\">"+ data.stylelayer +" | "+ data.weight +"</span><img src=\"../images/remove.png\"  class= \"pull-right\" width=\"15px\" height=\"15px\" onclick=\"removestyle()\" /></div></div>";
    $("#liststyle").append(content);
    dropdown_iter+=1;
  }

}

function getCall(url,options,callback){
        $.ajax({
           type: "GET",
          url: url,
          cache: false,
          success: function(data){
            console.log("data");
            callback (data);
          },
          error:function(err){
            console.log(err);
           }
      })
}

function removestyle(){
  $('.liststyle-div-padding').on('click', function () {
    var id = $(this).attr("id")
    id = id.split("-")[2];
    var data = document.getElementById('style-'+id).innerHTML;
    data = data.split("|");
    add_total_weight-=parseFloat(data[1].trim());
    $("#div-style-"+id).remove();

  });
}


// getCall("https://jsonplaceholder.typicode.com/posts","",layercontent);

// getCall("https://jsonplaceholder.typicode.com/posts","",stylelayer);

/* option.html */




function isAdmin(){
   var promise = new Promise(function(resolve, reject){

    processdata = {};
    processdata.keyword="isAdmin";
    processdata.emailId=sessionStorage.getItem("emailId");

    var data = JSON.stringify(processdata);

    $.ajax({
    type : "POST",
    url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
    dataType: 'json',
    data: data,
    success : function(data) {
      data = data.data;
      checkAdmin = data;
       resolve();

    },
    error: function(data) {      
      console.log(data);
      }
    });
  });
   return promise;
}



var showGpuToggle = function(){
  if(checkAdmin){
    $("#gpuAdmin").show();
  }
}

// isAdmin().then(showGpuToggle);


function gpuStatusChange(val){

    if(gpuflag){
      var element = document.getElementById('gputoogle');
      console.log(element.checked);
      $('#gpuAlertModel').modal('show');
  }
}


function sendGpuRequest(val){


  var element = document.getElementById('gputoogle');
  element = element.checked;

  if(val==1){

        $("#gputoogle").prop('checked', element).change();
        processdata = {};
        processdata.keyword  = "gpuController";
        processdata.gpuAction = element;

        var data = JSON.stringify(processdata);

        console.log(data);

        $.ajax({
          type : "POST",
          url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
          dataType: 'json',
          data: data,
          success : function(data) {
              console.log(data);
              gpuflag=false;
              getProcessDetails();
          },
          error: function(data) {      
            console.log(data);
          }
        });
  }
  else{
        $("#gputoogle").prop('checked', !element).change();
    }
}

function getProcessDetails(){


  processdata = {};
  processdata.keyword="metadata";

  var data = JSON.stringify(processdata);

  $.ajax({
    type : "POST",
    url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
    dataType: 'json',
    data: data,
    success : function(data) {
      isAdmin().then(showGpuToggle);
      console.log(data);
      var data = data.data;
      var content = "<tr><td class=\"text-center\">"+data.totalItems+"</td><td class=\"text-center\">"+data.totalCompleted
      +"</td><td class=\"text-center\">"+data.totalFailed+"</td></tr>";
      $("#optionTableBody").empty();
      $("#optionTableBody").append(content);
      var boolValue = data.isEC2Running.toLowerCase() == 'true' ? true : false; 
      $("#gputoogle").prop('checked', boolValue).change();
      gpuflag=true;

    },
    error: function(data) {      
      console.log(data);
    }
  });
}


function getConfigDetails(){

  processdata = {};
  processdata.keyword="getConfigDetails";

  var data = JSON.stringify(processdata);


  $.ajax({
    type : "POST",
    url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
    dataType: 'json',
    data: data,
    success : function(data) {
      
      console.log(data);
      var data = data.data;
      $("#nonAdminLabel").hide();

      document.getElementById("Alpha").value = data.alpha;
      document.getElementById("Beta").value = data.beta;
      document.getElementById("Iteration").value = data.noOfIteration;


      var trends = document.getElementById('layercontent');

     for(i = 0; i < trends.length; i++) {
      trend = trends[i];
      if(trend.value==data.layerContent){
        document.getElementById('layercontent').selectedIndex = i;
        }
      }

      if(checkAdmin){

        for(var datas in data.styleLayer) {
          var content = "<div class=\"panel panel-default panel-heading col-md-3 form-group\" id=\"div-style-"+dropdown_iter+"\"><div class=\"liststyle-div-padding\" id=\"data-style-"+dropdown_iter+"\"><span id=\"style-"+dropdown_iter+"\">"+ data.styleLayer[datas].stylelayer +" | "+ data.styleLayer[datas].weight +"</span><img src=\"../images/remove.png\"  class= \"pull-right\" width=\"15px\" height=\"15px\" onclick=\"removestyle()\" /></div></div>";
          $("#liststyle").append(content);
          dropdown_iter+=1;
          add_total_weight+=data.styleLayer[datas].weight;
        }

      }

      else{

        for(var datas in data.styleLayer) {
          var content = "<div class=\"panel panel-default panel-heading col-md-3 form-group\" id=\"div-style-"+dropdown_iter+"\"><div class=\"liststyle-div-padding\" id=\"data-style-"+dropdown_iter+"\"><span id=\"style-"+dropdown_iter+"\">"+ data.styleLayer[datas].stylelayer +" | "+ data.styleLayer[datas].weight +"</span></div></div>";
          $("#liststyle").append(content);
          dropdown_iter+=1;
          add_total_weight+=data.styleLayer[datas].weight;
        }

        $("#addStyle").hide();

        $('#Alpha').replaceWith("<div class=\"panel panel-default panel-heading\">"+data.alpha+"</div>");
        $('#Beta').replaceWith("<div class=\"panel panel-default panel-heading\">"+data.beta+"</div>");
        $('#Iteration').replaceWith("<div class=\"panel panel-default panel-heading\">"+data.noOfIteration+"</div>");
        $("#layercontent").replaceWith("<div class=\"panel panel-default panel-heading\">"+data.layerContent+"</div>");

        $("#configformbutton").hide();

        // $("#layercontent").prop("disabled", true);
        $("#AdminLabel").hide();
        $("#nonAdminLabel").show();


      }



    },
    error: function(data) {      
      console.log(data);
    }
  });

}



/* jobdetails.html */


function getallImages(){
    var content = "";
    processdata = {};
    processdata.keyword="getFirstSet";
    var data = JSON.stringify(processdata);

    $.ajax({
    type : "POST",
    url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
    dataType: 'json',
    data: data,
    success : function(data) {

      data = data.data;

      for(var dat in data){
          content +="<div class=\"col-md-3\"><center><img src=\"https://s3.amazonaws.com/images/"+data[dat]+"/processedImage.jpg\" class=\"img1\" width=\"75%\" style=\"padding: 10px;\" id=\"img-"+data[dat]+"\" onclick=\"getimageid('"+ data[dat] +"')\"></center></div>";
      }

      $("#list-image-details").empty();
      $("#list-image-details").append(content);

    },
    error: function(data) {      
      console.log(data);
    }
  });

}

function getimageid(id){

  processdata = {};
  processdata.keyword="getbyProcessId";
  processdata.processId=id;

  var data = JSON.stringify(processdata);

  $.ajax({
    type : "POST",
    url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=Config",
    dataType: 'json',
    data: data,
    success : function(data) {
      
      console.log(data.data);
      data = data.data;

      showModal(data);

    },
    error: function(data) {      
      console.log(data);
    }
  });
}


function showModal(data){

    var style_layer = data.styleLayer;
      var styledata ="";
      for (var i = 0; i < style_layer.length; i++) {
        styledata += style_layer[i]["stylelayer"]+" | "+style_layer[i]["weight"]+"<br>";
      }

    var modal_content = "<div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\">Result Image</h4></div><div class=\"modal-body\"><center><span><img src=\"https://s3.amazonaws.com/images/"+data.processId+"/contentImage.jpg\" class=\"img1\" width=\"25%\" style=\"padding: 10px;\"></span><span><img src=\"https://s3.amazonaws.com/images/"+data.processId+"/styleImage.jpg\"  class=\"img1\" width=\"25%\" style=\"padding: 10px;\"></span><span><img src=\"https://s3.amazonaws.com/images/"+data.processId+"/processedImage.jpg\" class=\"img1\" width=\"25%\" style=\"padding: 10px;\"></span></center></div><table class=\"table\" id=\"optionTable1\"><thead class=\"text-center\"><tr><th class=\"text-center\">UserName</th><th class=\"text-center\">Email Id</th><th class=\"text-center\">Created Date</th></tr></thead><tbody class=\"text-center\" id=\"optionTableBody1\"><td class=\"text-center\">"+data.userName+"</td><td class=\"text-center\">"+data.userEmail+"</td><td class=\"text-center\">"+data.createdDate+"</td></tbody></table><table class=\"table\" id=\"optionTable2\"><thead class=\"text-center\"><tr><th class=\"text-center\">Alpha</th><th class=\"text-center\">Beta</th><th class=\"text-center\">No of Iteration</th><th class=\"text-center\">Layer Content</th><th class=\"text-center\">Style & Weight</th></tr></thead><tbody class=\"text-center\" id=\"optionTableBody2\"><td class=\"text-center\">"+data.alpha+"</td><td class=\"text-center\">"+data.beta+"</td><td class=\"text-center\">"+data.noOfIteration+"</td><td class=\"text-center\">"+data.layerContent+"</td><td class=\"text-center\">"+styledata+"</td></tbody></table><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div>"

  $('#myModal').empty();      
  $("#myModal").append(modal_content);
  $('#myModal').modal('show');

}







