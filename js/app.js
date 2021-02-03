document.addEventListener('DOMContentLoaded', getRooms, false);
var eurRate = 1;
startDate = new Date;
endDate = new Date;

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

function updateTable(){
  var table = document.getElementById('roomsTable');
  var i = 1;
  fetch('https://matthiasbaldauf.com/swi1hs20/rooms')
        .then((response) => {
            return response.json()
        })
        .then(data => {
          data.forEach(function(object) {
            table.rows[i].innerHTML = '<td>' + isAvailable(object.available) + '</td>' +
            '<td class="big">' + object.id + '</td>' +
            '<td>' + object.name + '</td>' +
            '<td class="big">' + object.address + '</td>' + 
            '<td>' + correctCurrency(object.price) + '</td>' +
            '<td class="big">' + object.maxpersons + '</td>' +
            '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#reservierungModal" data-whatever="' + object.id + '">Reservierungen</button></td>';
            i++;
          })
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err)
        });
}

function append_json(data){
  var table = document.getElementById('roomsTable');
  data.forEach(function(object) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + isAvailable(object.available) + '</td>' +
    '<td class="big">' + object.id + '</td>' +
    '<td>' + object.name + '</td>' +
    '<td class="big">' + object.address + '</td>' + 
    '<td>' + correctCurrency(object.price) + '</td>' +
    '<td class="big">' + object.maxpersons + '</td>' +
    '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#reservierungModal" data-whatever="' + object.id + '">Reservierungen</button></td>';
    table.appendChild(tr);
  })
}


$(function() {

  $('input[name="datefilter"]').daterangepicker({
      autoUpdateInput: false,
      locale: {
          cancelLabel: 'Clear'
      }
  });

  $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      console.log(picker.startDate._d);
      console.log(picker.endDate._d);
      startDate = picker.startDate._d;
      endDate = picker.endDate._d;
      console.log(startDate.toUTCString());
      console.log(endDate.toUTCString());
  });

  $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
  });

});

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