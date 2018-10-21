var socket = io.connect('/trafficLight');
socket.on("currentPhase", function(phase) {
  switch(phase) {
    case 0:   // red
      document.getElementById('red_overlay').classList.add('activeSignal');
      document.getElementById('amber_overlay').classList.remove('activeSignal');
      document.getElementById('green_overlay').classList.remove('activeSignal');
      break;
    case 1:   // redChanging
      document.getElementById('red_overlay').classList.add('activeSignal');
      document.getElementById('amber_overlay').classList.add('activeSignal');
      document.getElementById('green_overlay').classList.remove('activeSignal');
      break;
    case 2:   // green
      document.getElementById('red_overlay').classList.remove('activeSignal');
      document.getElementById('amber_overlay').classList.remove('activeSignal');
      document.getElementById('green_overlay').classList.add('activeSignal')
      break;
    case 3:   // amber
      document.getElementById('red_overlay').classList.remove('activeSignal');
      document.getElementById('amber_overlay').classList.add('activeSignal');
      document.getElementById('green_overlay').classList.remove('activeSignal');
      break;
    default:
      document.getElementById('red_overlay').classList.remove('activeSignal');
      document.getElementById('amber_overlay').classList.remove('activeSignal');
      document.getElementById('green_overlay').classList.remove('activeSignal');
      break;
  }
});

document.getElementById('red_overlay').addEventListener('click', function() {
  socket.emit('newPhase', 0)
})

document.getElementById('amber_overlay').addEventListener('click', function() {
  socket.emit('newPhase', 3)
})

document.getElementById('green_overlay').addEventListener('click', function() {
  socket.emit('newPhase', 2)
})
