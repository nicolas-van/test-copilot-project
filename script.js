function updateCountdown() {
    const targetDate = new Date('2038-10-25T12:00:00');
    const now = new Date();
    const timeDifference = targetDate - now;

    if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const countdownText = `${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes`;
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.textContent = countdownText;
        }
    } else {
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.textContent = "La fin du monde est arrivée !";
        }
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();