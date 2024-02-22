const socket = io(window.location.origin);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

function cart(candidateIndex) {
    socket.emit('cart', candidateIndex);
    console.log(candidateIndex);
    toggleModal();
}
function toggleModal() {
    var overlay = document.getElementById('overlay');
    var modal = document.getElementById('modal');
    overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'block' : 'none';
    modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
}