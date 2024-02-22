const socket = io(window.location.origin);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('updateItems', (items) => {
    var cart_item = items;
    cart_item = cart_item.filter(item => item.cart !== 0);
    console.log('Received updated cart:', cart_item);
    updateDashboard(cart_item);
    console.log("ok");
});

function updateDashboard(candidates) {
    var dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';     

    candidates.forEach(function (candidates, index) {
        var candidateInfo = document.createElement('div');
        candidateInfo.innerHTML = 
            '<div class="Item-card">' + 
            '<div class="card" style="width: 20rem">' + 
            '<img class="card-img-top" src="' + candidates.img + '" alt="Card image cap" />' + 
            '<div class="card-body">' + 
            '<h5 class="card-title">' + candidates.name + '</h5>' + 
            '<p class="card-text">' + candidates.description + 
            '</p>' + '<a href="#" class="btn btn-primary" onclick="uncart(' + candidates.item_no + ')">Remove from cart</a>' + 
            '<p style="margin: 3px">' + candidates.price + '</p>' + 
            ' </div>' + ' </div>';

        dashboard.appendChild(candidateInfo);
    });
}

function uncart(candidateIndex) {
    socket.emit('uncart', candidateIndex);
    console.log(candidateIndex);
    toggleModal();
}
function toggleModal() {
    var overlay = document.getElementById('overlay');
    var modal = document.getElementById('modal');
    overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'block' : 'none';
    modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
}