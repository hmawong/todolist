var dateConversion = function(date) {
  var convertedDate = "";
  var year = date.slice(0,4);
  var month = date.slice(5,7);
  var day = date.slice(8,10);
  convertedDate = day + ' ' + month + ' ' + year;
  return convertedDate;
 }

$(document).ready(function(){
  initialLoading();

  $('#addTask').on('submit', function (event) {
    event.preventDefault();
    var task = $(this).children('[name=name]').val();
    addNewTask(task);
    $(this).children('[name=name]').val('');
  });

  $(document).on('click', '.btn.remove', function (event) {
    var id = $(this).closest('tr').children('td')[0].id;
    deleteTask(id, this);
  });

  $(document).on('click', '.btn.finish', function (event) {
    var id = $(this).closest('tr').children('td')[0].id;
    completeTask(id, this);
    //$(this).closest('td').replaceWith('<td class="complete"><span>Yes<span><button class="btn btn-warning btn-sm active">Active</button></td>');
  });

  $(document).on('click', '.btn.active', function (event) {
    var id = $(this).closest('tr').children('td')[0].id;
    activateTask(id, this);
    //$(this).closest('td').replaceWith('<td class="complete"><span>No<span><button class="btn btn-success btn-sm finish">Completed</button></td>');
  });

  $(document).on('click', '.btn.completed', function (event) {
    $('tr.pending').hide();
    $('tr.completed').show();
  });

  $(document).on('click', '.btn.pending', function (event) {
    $('tr.pending').show();
    $('tr.completed').hide();
  });

  $(document).on('click', '.btn.all', function (event) {
    $('tr').show();
  });

});

var initialLoading = function () {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        var task = JSON.parse(httpRequest.responseText);
        console.log(task);
        task.tasks.forEach(function (item) {
          for (var key in item) {
            if (key == "content" && item['completed'] == true) {
              var date = dateConversion(item['created_at']);
              $('tbody').append('<tr class="completed">' +
                '<td class="task" id = "' + item['id']+ '">' + item[key] + '</td>' +
                '<td class="date">' + date + '</td>' +
                '<td class="complete"><span>Yes<span><button class="btn btn-warning btn-sm active">Redo this Task</button></td>' +
                '<td><button class="btn btn-danger btn-sm remove">Remove Task</button></td>' +
              '</tr>');

            } else if (key == "content" && item['completed'] == false){
              var date = dateConversion(item['created_at']);
              $('tbody').append('<tr class="pending">' +
                '<td class="task" id = "' + item['id']+ '">' + item[key] + '</td>' +
                '<td class="date">' + date + '</td>' +
                '<td class="complete"><span>No<span><button class="btn btn-success btn-sm finish">Completed</button></td>' +
                '<td><button class="btn btn-danger btn-sm remove">Remove Task</button></td>' +
              '</tr>');
            }
          }
        });
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function() {
    console.log(httpRequest.statusText);
  }

  httpRequest.open('GET', 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=105');
  httpRequest.send();
}

var addNewTask = function (task) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        var result = JSON.parse(httpRequest.responseText).task;
        var id = result.id;
        var date = dateConversion(result.created_at);
        $('tbody').append('<tr class="pending">' +
          '<td class="task" id = "' + id + '">' + task + '</td>' +
          '<td class="date">' + date + '</td>' +
          '<td class="complete"><span>No<span><button class="btn btn-success btn-sm finish">Completed</button></td>' +
          '<td><button class="btn btn-danger btn-sm remove">Remove Task</button></td>' +
        '</tr>');
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function() {
    console.log(httpRequest.statusText);
  }
  httpRequest.open('POST', 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=105');
  httpRequest.setRequestHeader("Content-Type", "application/json");
  httpRequest.send(JSON.stringify({
    task: {
      content: task
    }
  }));
}

var deleteTask = function (taskID, ele) {

  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        $(ele).closest('tr').remove();
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function() {
    console.log(httpRequest.statusText);
  }
  httpRequest.open('DELETE', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskID + '?api_key=105');
  httpRequest.send();

}

var completeTask = function (taskID, ele) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        $(ele).closest('tr').attr('class', 'completed');
        $(ele).closest('td').replaceWith('<td class="complete"><span>Yes<span><button class="btn btn-warning btn-sm active">Redo this Task</button></td>');
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function() {
    console.log(httpRequest.statusText);
  }
  httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskID + '/mark_complete?api_key=105');
  httpRequest.send();
}

var activateTask = function (taskID, ele) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        $(ele).closest('tr').attr('class', 'pending');
        $(ele).closest('td').replaceWith('<td class="complete"><span>No<span><button class="btn btn-success btn-sm finish">Completed</button></td>');
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function() {
    console.log(httpRequest.statusText);
  }
  httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskID + '/mark_active?api_key=105');
  httpRequest.send();
}
