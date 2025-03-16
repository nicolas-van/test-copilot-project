const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2 - 25;
const playerWidth = 50;
const playerHeight = 20;
const playerSpeed = 7;

let bullets = [];
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 10;

let enemies = [];
const enemyWidth = 40;
const enemyHeight = 20;
const enemyRows = 3;
const enemyCols = 8;
let enemySpeed = 2;

let keysPressed = {}; // Suivi des touches pressées

let level = 1; // Compteur de niveau

let isGameOver = false; // Indique si le jeu est terminé

let lastBulletTime = 0; // Temps du dernier tir
const bulletCooldown = 300; // Délai entre les tirs en millisecondes

let isShooting = false; // Indique si le joueur maintient la barre d'espace

function createEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({
                x: col * (enemyWidth + 10) + 50,
                y: row * (enemyHeight + 10) + 30,
                alive: true,
            });
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'lime';
    ctx.fillRect(playerX, canvas.height - playerHeight - 10, playerWidth, playerHeight);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'white';
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
        }
    });
}

function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Niveau : ${level}`, 10, 20);
}

function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Appuyez sur ESPACE pour recommencer', canvas.width / 2, canvas.height / 2 + 50);
}

function moveBullets() {
    bullets = bullets.filter((bullet) => bullet.y > 0);
    bullets.forEach((bullet) => {
        bullet.y -= bulletSpeed;
    });
}

function moveEnemies() {
    enemies.forEach((enemy) => {
        enemy.x += enemySpeed;
    });

    const hitEdge = enemies.some((enemy) => enemy.x + enemyWidth > canvas.width || enemy.x < 0);
    if (hitEdge) {
        enemies.forEach((enemy) => {
            enemy.x -= enemySpeed;
            enemy.y += enemyHeight;
        });
        enemySpeed *= -1;
    }
}

function checkCollisions() {
    bullets.forEach((bullet) => {
        enemies.forEach((enemy) => {
            if (
                enemy.alive &&
                bullet.x < enemy.x + enemyWidth &&
                bullet.x + bulletWidth > enemy.x &&
                bullet.y < enemy.y + enemyHeight &&
                bullet.y + bulletHeight > enemy.y
            ) {
                enemy.alive = false;
                bullet.y = -10; // Remove bullet
            }
        });
    });
}

function movePlayer() {
    if (keysPressed['ArrowLeft'] && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keysPressed['ArrowRight'] && playerX + playerWidth < canvas.width) {
        playerX += playerSpeed;
    }
}

function resetGame() {
    if (isGameOver) {
        level = 1; // Réinitialise le niveau
        enemySpeed = 2; // Réinitialise la vitesse des ennemis
        isGameOver = false; // Réinitialise l'état du jeu
    } else {
        level++; // Augmente le niveau
        enemySpeed = 2 + level; // Augmente la vitesse des ennemis
    }
    bullets = []; // Réinitialise les balles
    enemies = []; // Réinitialise les ennemis
    createEnemies(); // Recrée les ennemis
}

function checkGameOver() {
    const enemyReachedPlayer = enemies.some((enemy) => enemy.alive && enemy.y + enemyHeight >= canvas.height - playerHeight - 10);
    if (enemyReachedPlayer) {
        isGameOver = true; // Active l'état de "Game Over"
    }
}

function checkGameStatus() {
    const allEnemiesDefeated = enemies.every((enemy) => !enemy.alive);
    if (allEnemiesDefeated) {
        resetGame(); // Relance le jeu avec une difficulté accrue
    }
}

function shootBullet() {
    const now = Date.now();
    if (now - lastBulletTime > bulletCooldown) {
        bullets.push({
            x: playerX + playerWidth / 2 - bulletWidth / 2,
            y: canvas.height - playerHeight - 20,
        });
        lastBulletTime = now; // Met à jour le temps du dernier tir
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
        drawGameOver(); // Affiche l'écran de "Game Over"
        return;
    }

    if (isShooting) {
        shootBullet(); // Continue à tirer si la barre d'espace est maintenue
    }

    movePlayer(); // Déplacement du joueur
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawLevel(); // Affiche le niveau actuel
    moveBullets();
    moveEnemies();
    checkCollisions();
    checkGameOver(); // Vérifie si le jeu est terminé
    checkGameStatus(); // Vérifie si tous les ennemis sont éliminés
    requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true; // Enregistre la touche pressée
    if (e.key === ' ' && !isGameOver) {
        isShooting = true; // Active le tir continu
    }
    if (isGameOver && e.key === ' ') {
        resetGame(); // Redémarre le jeu si "Game Over"
        updateGame(); // Relance la boucle du jeu
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false; // Supprime la touche relâchée
    if (e.key === ' ') {
        isShooting = false; // Désactive le tir continu
    }
});

createEnemies();
updateGame();
