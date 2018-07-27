$(function() {
  "use strict";

  // UPLOAD CLASS DEFINITION
  // ======================
  //datatable initialization
  var editIndex = { row: 0, col: 0 };
  var uploadTable = $("#upload-table").DataTable({
    searching: false,
    paging: false,
    ordering: false,
    scrollY: 300,
    scrollCollapse: true
  });
  var doctypeTable = $("#doctype-table").DataTable({
    columnDefs: [
      {
        name: "checkbox",
        orderable: false,
        className: "select-checkbox",
        targets: 0
      },
      { name: "doctypeCategory", targets: 1 },
      { name: "doctypeEn", targets: 2 },
      { name: "doctypeJp", targets: 3 }
    ],
    select: {
      style: "os",
      selector: "td:first-child"
    },
    order: [[1, "asc"]]
  });

  var dropZone = document.getElementById("drop-zone");
  var uploadForm = document.getElementById("js-upload-form");

  var startUpload = function(files) {
    console.log(files);
    
    for (var i = 0; i < files.length; i++) {
      var filename = files[i].name;
      if (!validateUploadFile(filename)) {
        alert("Incorrect file format:\n" + filename + " is unable to upload");
      }
      var doctype = "none";
      uploadTable.row
        .add([
          files[i].name,
          '<button type="submit" class="btn btn-default upload-doctype" data-toggle="modal" data-target="#doctype-editor"><i class="fa fa-search" aria-hidden="true"></i></button> &nbsp;<span>Select Tagging Folder</span>',
          '<button type="submit" class="btn btn-default upload-comment"><i class="fa fa-plus" aria-hidden="true"></i></button> &nbsp;<span>Add comments</span>',
          '<button type="button" class="btn btn-default upload-delete"><i class="fa fa-trash" style="color:red" aria-hidden="true"></i></button>'
        ])
        .draw();
    }
    // for (var file in files) {
    //   uploadTable.row.add({"File Name" : file.name}).draw();
    // }
  };

  uploadForm.addEventListener("submit", function(e) {
    var uploadFiles = document.getElementById("js-upload-files").files;
    e.preventDefault();

    startUpload(uploadFiles);
    document.getElementById("js-upload-files").value = "";
  });

  dropZone.ondrop = function(e) {
    //console.log(e.dataTransfer.files);
    e.preventDefault();
    this.className = "upload-drop-zone";
    var uploadfiles = e.dataTransfer.files;
    console.log(uploadfiles);
    startUpload(uploadfiles);
  };

  dropZone.ondragover = function() {
    this.className = "upload-drop-zone drop";
    return false;
  };

  dropZone.ondragleave = function() {
    this.className = "upload-drop-zone";
    return false;
  };

  uploadTable.on("click", "td>button.upload-delete", function() {
    var isconfirmed = confirm("Do you want to delete this image");
    if (isconfirmed) {
      uploadTable
        .row($(this).parents("tr"))
        .remove()
        .draw();
    }
  });
  uploadTable.on("click", "button.upload-doctype", function() {
    $("#custom-title").text("Select Tagging Folder");
    setCellIndex(this);
    doctypeTable
      .row(".selected")     
      .deselect();
  });

  uploadTable.on("click", "button.upload-comment", function() {
    $("#commentBox-title").text("Add Comments");
    var commentText = $(this)
      .siblings("span")
      .text();
    $("#areaComment")[0].value = commentText;
    console.log(this);
    setCellIndex(this);
    $("#upload-editor").modal("toggle");
  });

  $("#btnSave").on("click", function() {
    console.log("this is testing");
    saveComment();
  });
  $("#btnSelect").on("click", function() {
    console.log("this is selection");
    selectDoctype();
  });

  function setCellIndex(obj) {
    editIndex.row = uploadTable.cell($(obj).parents()).index().row;
    editIndex.col = uploadTable.cell($(obj).parents()).index().column;
  }

  function selectDoctype() {
    $("#doctype-editor").modal("hide");
    //var rowKeys = doctypeTable.rows({ selected: true }).data();
    var selectedVal =
      '<button type="submit" class="btn btn-default upload-doctype" data-toggle="modal" data-target="#doctype-editor"><i class="fa fa-search" aria-hidden="true"></i></button> &nbsp;<span>' +
      doctypeTable.row({ selected: true }).data()[1] +
      "</span>";
    var cellValue = uploadTable.row(editIndex.row).node().cells[editIndex.col];
    uploadTable
      .cell(cellValue)
      .data(selectedVal)
      .draw();
  }

  function saveComment() {
    var commentText = $("#areaComment").val();
    var commentTitle = commentText;
    if(commentText.length > 35){
      commentText = commentText.substr(0,35) + '...';
    }
    var commentVal =
      '<button type="submit" class="btn btn-default upload-comment"><i class="fa fa-plus" aria-hidden="true"></i></button> &nbsp;<span title='+commentTitle+'>' +
      commentText +
      "</span>";
    $("#upload-editor").modal("hide");
    var cellValue = uploadTable.row(editIndex.row).node().cells[editIndex.col];
    uploadTable
      .cell(cellValue)
      .data(commentVal)
      .draw();
  }

  function validateUploadFile(filename) {
    console.log(filename.split(".").pop());
    var extn = filename.split(".").pop();
    if (extn == "jpeg" || extn == "jpg" || extn == "png" || extn == "giff") {
      return true;
    }
    return false;
  }
});
