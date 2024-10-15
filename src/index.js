function loadMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(movies => {
            const filmsList = document.getElementById("films");

            // This clears or removes any existing files
            filmsList.innerHTML = '';  

            movies.forEach(movie => {
                const li = document.createElement("li");
                li.classList.add("film", "item");

                li.textContent = movie.title;

            // Making the button functional by adding a click event listener.
                li.addEventListener('click', () => loadMovieDetails(movie));

                filmsList.appendChild(li);
            });
        })
        .catch(error => console.log("Error loading movies:", error));
}

// This will load the movie when it's clicked.
function loadMovieDetails(movie) {
    document.getElementById("poster").src = movie.poster;
    document.getElementById("poster").alt = movie.title;
    document.getElementById("title").textContent = movie.title;
    document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
    document.getElementById("film-info").textContent = movie.description;
    document.getElementById("showtime").textContent = movie.showtime;
    
// Calculating the available tickets.
    const availableTickets = movie.capacity - movie.tickets_sold;
    const ticketNum = document.getElementById("ticket-num");
    ticketNum.textContent = `${availableTickets} remaining tickets`;

// If there are tickets less than 0, the button will be disabled meaning that the user...
// ...cannot buy another ticket anymore.
    const buyTicketButton = document.getElementById("buy-ticket");
    buyTicketButton.disabled = availableTickets <= 0;
    buyTicketButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";

// Adding an event listener for buying a ticket.
    buyButton.onclick = () => buyTicket(movie, ticketNum, buyButton);
}

// Function to purchase a ticket
function buyTicket(movie, ticketNum, buyButton) {
    const availableTickets = movie.capacity - movie.tickets_sold;

    if (availableTickets > 0) {
    //    Increasing the number of tickets by one
        const updatedTicketsSold = movie.tickets_sold + 1;

        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "tickets_sold": updatedTicketsSold })
        })
        .then(response => response.json())
        .then(updatedMovie => {
            const newAvailableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
            ticketNum.textContent = `${newAvailableTickets} remaining tickets`;

            // Using the if conditional statement to check if tickets together with the strict...
            // ...inequality to show that if there are no available tickets, it should be equal to 0
            if (newAvailableTickets === 0) {
                buyButton.disabled = true;
                buyButton.textContent = 'sold-out';
            }
        })
        .catch(error => console.log("Error updating tickets:", error));
    }
}

// I'm using window.onload because I found it easier than DOMContentLoad.
window.onload = () => {
    loadMovies();
    loadMovieDetails();  
};
