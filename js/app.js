document.addEventListener('DOMContentLoaded', getRooms, false);
var eurRate = 1;
var startDate = new Date;
var endDate = new Date;
var roomid = 0;
var roomname = '';
var prices = [];
var lat = [];
var lng = [];



function getRooms() {
    fetch('https://matthiasbaldauf.com/swi1hs20/rooms')
        .then((response) => {
            return response.json()
        })
        .then(data => {
          append_json(data);
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err)
        });
}

function applyReservation(){
  if (!validateEmail(document.forms["reservieren-form"]["reservieren-email"].value)){
    alert('Geben Sie eine gültige E-Mail Adresse ein!');
  } else if (!validateTime(document.forms["reservieren-form"]["reservieren-zeit"].value)){
    alert('Geben Sie einen Zeitraum in Form: "DD/MM/YYYY hh:mm - DD/MM/YYYY hh:mm" an!')
  } else {
    document.getElementById('reservieren-body').style.display = "none";
    document.getElementById('reservierung-beantragen').style.display = "none"; 
    document.getElementById('reservieren-show').style.display = "";
    document.getElementById('warning').style.display = "none";
    var name = document.forms["reservieren-form"]["reservieren-name"].value;
    var email = document.forms["reservieren-form"]["reservieren-email"].value;
    var studid = document.forms["reservieren-form"]["reservieren-studid"].value;
    var title = document.forms["reservieren-form"]["reservieren-title"].value;
    var url = 'https://matthiasbaldauf.com/swi1hs20/booking';
    if (title != ""){         
      var details = {
        'roomid': roomid,
        'title': title, 
        'organizer': name,
        'email': email,
        'start': startDate,
        'end': endDate,
        'studid': studid
      }
    } else {      
      var details = {
        'roomid': roomid,
        'organizer': name,
        'email': email,
        'start': startDate,
        'end': endDate,
        'studid': studid
      }
    }
    var formBody = [];
    for (var property in details){
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
      .then((response) => {
          return response.json()
      })
      .then(data => {
        console.log(data);
        document.getElementById('reservation-success').style.display = "";
      })
      .catch((err) => {
        console.log('Fetch Error :-S', err)
        document.getElementById('reservation-fail').style.display = "";
      });  

      var inputEmail= document.getElementById("reservieren-email");
      localStorage.setItem("email", inputEmail.value);
      var inputName= document.getElementById("reservieren-name");
      localStorage.setItem("name", inputName.value);
    
  }  
  
}

function validateEmail(elementValue){      
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(elementValue); 
} 

function validateTime(elementValue){      
  var timePattern = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00)))) (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] - (((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00)))) (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timePattern.test(elementValue); 
}

function getReservations() {
  document.getElementById('reservierung-body').style.display = "none";
  document.getElementById('reservierung-suchen').style.display = "none";    
  document.getElementById('reservierung-show').style.display = "";
  var a = document.forms["reservierung-form"]["stud-id"].value;
  var table = document.getElementById('reservierung-table');
  var url = new URL('https://matthiasbaldauf.com/swi1hs20/bookings'),
    params = {roomid: roomid, start:startDate, end: endDate, studid: a}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  console.log(url);    
  fetch(url)
      .then((response) => {
          return response.json()
      })
      .then(data => {
        console.log(data);
        if (data == ""){
          document.getElementById('none-found').style.display = "";
        } else {
          document.getElementById('reservierung-table').style.display = "";
          data.forEach(function(object) {
            var tr = document.createElement('tr');
            tr.innerHTML = 
            '<td class="big">' + object.id + '</td>' +
            '<td>' + object.start.substring(0,19) + ' - ' + object.end.substring(0,19) + '</td>' +
            '<td class="big">' + object.title + '</td>' +
            '<td class="big">' + object.organizer + '</td>' + 
            '<td>' + object.email + '</td>' +
            '<td>' + object.studid + '</td>' +
            table.appendChild(tr);
          })
        }
      })
      .catch((err) => {
          console.log('Fetch Error :-S', err)
      });  
}

function calculateEur(){
  fetch('https://api.exchangeratesapi.io/latest?base=CHF')
        .then((response) => {
            return response.json()
        })
        .then(data => {          
          console.log(data.rates.EUR);
          eurRate = data.rates.EUR;
          return data.rates.EUR;
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err)
        });
}


function setRoomname(object){
  roomname = object.name;
  document.getElementById('reservierungModalLabel').innerHTML = 'Reservierungen für ' + roomname;
  return object.name;
}

function updateTable(){
  var table = document.getElementById('roomsTable');
  var i = 1;
  fetch('https://matthiasbaldauf.com/swi1hs20/rooms')
        .then((response) => {
            return response.json()
        })
        .then(data => {
          data.forEach(function(object) {
            table.rows[i].innerHTML = makeRows(object);
            i++;
          })
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err)
        });
}

function makeRows(object){
  return '<td id="ava">' + isAvailable(object.available) + '</td>' +
  '<td class="big">' + object.id + '</td>' +
  '<td><a href="#" id="linkid' + object.id + '" data-toggle="modal" data-target="#reservierungModal">' + setRoomname(object) + '</a></td>' +
  '<td class="big">' + object.address + '</td>' + 
  '<td>' + correctCurrency(object.price) + '</td>' +
  '<td class="big">' + object.maxpersons + '</td>' +
  '<td><button type="button" id="roomid' + object.id + '" class="btn btn-primary" data-toggle="modal" data-target="#reservierenModal" onclick="loadSavedData()">Reservieren</button></td>';       
}

function loadSavedData(){
  var storedEmail = localStorage.getItem("email");
  if (storedEmail != ''){
    document.getElementById('reservieren-email').value = storedEmail;
  }
  var storedName = localStorage.getItem("name");
  if (storedName != ''){
    document.getElementById('reservieren-name').value = storedName;
  }
}

$(document).on('click','#roomid1',function(){ 
  roomid = 1;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid2',function(){ 
  roomid = 2;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid3',function(){ 
  roomid = 3;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid4',function(){ 
  roomid = 4;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid5',function(){ 
  roomid = 5;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid6',function(){ 
  roomid = 6;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid7',function(){ 
  roomid = 7;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#roomid8',function(){ 
  roomid = 8;
  var marker = new mapboxgl.Marker()
    .setLngLat([lng[roomid-1], lat[roomid-1]])
    .addTo(map);
  map.setCenter([lng[roomid-1], lat[roomid-1]]);
})

$(document).on('click','#linkid1',function(){ 
  roomid = 1;
})
$(document).on('click','#linkid2',function(){ 
  roomid = 2;
})
$(document).on('click','#linkid3',function(){ 
  roomid = 3;
})
$(document).on('click','#linkid4',function(){ 
  roomid = 4;
})
$(document).on('click','#linkid5',function(){ 
  roomid = 5;
})
$(document).on('click','#linkid6',function(){ 
  roomid = 6;
})
$(document).on('click','#linkid7',function(){ 
  roomid = 7;
})
$(document).on('click','#linkid8',function(){ 
  roomid = 8;
})



function append_json(data){
  var table = document.getElementById('roomsTable');
  data.forEach(function(object) {
    prices.push(object.price);
    lat.push(object.lat);
    lng.push(object.lon);
    var tr = document.createElement('tr');
    tr.innerHTML = makeRows(object);
    table.appendChild(tr);
  })
}


function checkInputs() {
  var a = document.forms["reservieren-form"]["reservieren-name"].value;
  var b = document.forms["reservieren-form"]["reservieren-email"].value;
  var c = document.forms["reservieren-form"]["reservieren-studid"].value;
  var d = document.forms["reservieren-form"]["reservieren-zeit"].value;
  if (a != "" && b != "" && c != "" && d != ""){
    document.getElementById('reservierung-beantragen').disabled = false;
  }
}

$(function() {
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    timePicker24Hour: true,
    locale: {
      format: 'DD/MM/YYYY hh:mm'
    }
  });

  $('#reservieren-name').on('input', function() {
    checkInputs();
  });
  
  $('#reservieren-email').on('input', function() {
    checkInputs();
  });
  
  $('#reservieren-studid').on('input', function() {
    checkInputs();
  });
  
  $('#reservieren-title').on('input', function() {
    checkInputs();
  });

  $('#reservieren-zeit').on('apply.daterangepicker', function(ev, picker) {
    var a = document.forms["reservieren-form"]["reservieren-name"].value;
    var b = document.forms["reservieren-form"]["reservieren-email"].value;
    var c = document.forms["reservieren-form"]["reservieren-studid"].value;
    var d = $('#reservieren-zeit').val;
    if (a != "" && b != "" && c != "" && d != ""){
      document.getElementById('reservierung-beantragen').disabled = false;
    }
  });

  $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY hh:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY hh:mm'));
      var start = picker.startDate._d.toISOString();
      startDate= start.substring(0,19);
      var end = picker.endDate._d.toISOString();
      endDate = end.substring(0,19);
      console.log(startDate + endDate);
      var pricechf = prices[roomid-1]
      var totalprice = 0;
      var totaltime = (picker.endDate._d - picker.startDate._d)/3600000;
      console.log(totaltime);
      if (totaltime <= 0){
        alert('Geben Sie ein gültiges Zeitfenster ein');

      } else {
        if (document.getElementById('togglecur').checked){
        totalprice = (pricechf*totaltime).toFixed(1) + ' CHF';
      } else {
        calculateEur();
        totalprice = ((pricechf * eurRate)*totaltime).toFixed(1) + ' EUR';
      }
      document.getElementById("cost").innerHTML = 'Preis für Ihr ausgewähltes Zeitfenster: <b>' + totalprice + '</b>';
      }
      
  });

  


  $('input[name="datetimes"]').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
  });
});

$(function() {
  $('input[name="datefilter"]').daterangepicker({
      autoUpdateInput: false,
      startDate: moment().date(),
      endDate: moment().startOf('day').add(4, 'day'),
      locale: {
          cancelLabel: 'Clear'
      }
  });

  $('#studenten-id').on('input', function() {
    var a = document.forms["reservierung-form"]["stud-id"].value;
    var b = document.forms["reservierung-form"]["datefilter"].value;
    if (a != "" && b != ""){
      document.getElementById('reservierung-suchen').disabled = false;
    }
  });

  $('#daterange').on('apply.daterangepicker', function(ev, picker) {
    var a = document.forms["reservierung-form"]["stud-id"].value;
    var b = $('#daterange').val;
    if (a != "" && b != ""){
      document.getElementById('reservierung-suchen').disabled = false;
    }
  });

  $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      var start = picker.startDate._d.toISOString();
      startDate= start.substring(0,10);
      var end = picker.endDate._d.toISOString();
      endDate = end.substring(0,10);
      console.log(startDate + endDate);
  });

  


  $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
  });
});

function resetModal(){  
  startDate = new Date;
  endDate = new Date;
  roomid = 0;  
  document.getElementById('reservierung-body').style.display = "";
  document.getElementById('reservierung-suchen').style.display = "";    
  document.getElementById('reservierung-show').style.display = "none";
  document.forms["reservierung-form"]["stud-id"].value = '';
  document.forms["reservierung-form"]["datefilter"].value = '';
  document.getElementById('none-found').style.display = "none";
  document.getElementById('reservation-success').style.display = "none";
  document.getElementById('reservation-success').style.display = "none";
  document.getElementById('reservieren-body').style.display = "";
  document.getElementById('reservierung-beantragen').style.display = ""; 
  document.getElementById('reservieren-show').style.display = "none";
  document.getElementById('warning').style.display = "";
  document.forms["reservieren-form"]["reservieren-studid"].value = '';
  document.forms["reservieren-form"]["reservieren-zeit"].value = '';
  document.forms["reservieren-form"]["reservieren-title"].value = '';
  document.getElementById('reservierung-table').style.display = "none";
  document.getElementById('reservierung-table').innerHTML = "";
}


function isAvailable(ava){
  if(ava == 1){
    return '✔️'
  } else {
    return '❌'
  }
}

function correctCurrency(x){
  if (document.getElementById('togglecur').checked){
    return x + ' CHF/h';
  } else {
    calculateEur();
    return (x * eurRate).toFixed(1) + ' EUR/h';
  }
}