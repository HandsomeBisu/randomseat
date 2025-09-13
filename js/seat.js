document.addEventListener('DOMContentLoaded', () => {
    const seatGrid = document.querySelector('.seat-grid');
    const selectedSeatsSpan = document.getElementById('selected-seats');
    const totalPriceSpan = document.getElementById('total-price');
    const seatPrice = 10000; // 10,000 KRW

    const rows = 5;
    const cols = 5;
    const occupiedSeats = ['1-2', '2-3', '3-4']; // Example of occupied seats

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            const seatId = `${i}-${j}`;
            seat.dataset.id = seatId;

            if (occupiedSeats.includes(seatId)) {
                seat.classList.add('occupied');
            }

            seatGrid.appendChild(seat);
        }
    }

    const seats = document.querySelectorAll('.seat:not(.occupied)');
    let selectedSeats = [];

    seatGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
            e.target.classList.toggle('selected');
            const seatId = e.target.dataset.id;

            if (e.target.classList.contains('selected')) {
                selectedSeats.push(seatId);
            } else {
                selectedSeats = selectedSeats.filter(id => id !== seatId);
            }

            updateSelectedSeats();
        }
    });

    function updateSelectedSeats() {
        selectedSeatsSpan.textContent = selectedSeats.length > 0 ? selectedSeats.join(', ') : '없음';
        totalPriceSpan.textContent = selectedSeats.length * seatPrice;
    }
});