const MAX_ENEMY = 7;
const ELEM_HEIGHT = 100;

const score = document.querySelector('.score'),
        gameArea = document.querySelector('.game__area'),
        startBtn = document.querySelector('.start');

        
const car = document.createElement('div');
car.classList.add('car');

const music = new Audio('music.mp3');
music.volume = 0.1;


const keys = {
    ArrowUp: 'false',
    ArrowDown: 'false',
    ArrowLeft: 'false',
    ArrowRight: 'false',
};

const gameSettings = {
    start: 'false',
    score: 0,
    speed: 4,
    traffic: 3,
    record: localStorage.getItem('best-record'),
};


const getQuantityElements = heightElement => {
    return (gameArea.offsetHeight / heightElement) + 1;
};

const getRandomEnemy = max => Math.floor((Math.random() * max ) + 1);

const levelChange = (lvl) => {
    switch (lvl) {
        case '1':
            gameSettings.speed = 4;
            gameSettings.traffic = 3;
            break;
        case '2':
            gameSettings.speed = 5;
            gameSettings.traffic = 2;
            break;
        case '3':
            gameSettings.speed = 7;
            gameSettings.traffic = 2;
            break;
    }
};

const startGame = (ev) => {
    const target = ev.target;
    if (!target.classList.contains('btn')) return;

    const levelGame = target.dataset.levelGame;

    levelChange(levelGame);

    gameArea.innerHTML = '';
    music.play();
    startBtn.classList.add('hidden');
    gameArea.style.display = 'block';
    gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - ELEM_HEIGHT) / ELEM_HEIGHT) * ELEM_HEIGHT;

    car.style.top = 'auto';
    car.style.left = '125px';
    car.style.bottom = '10px';

    for (let i = 0; i < getQuantityElements(ELEM_HEIGHT); i++) {
        const line = document.createElement('div');
        line.classList.add('lines');
        line.style.top = (i * ELEM_HEIGHT) + 'px';
        line.style.height = (ELEM_HEIGHT / 2) + 'px';
        line.y = (i * ELEM_HEIGHT);
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(ELEM_HEIGHT * gameSettings.traffic); ++i) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.background = `transparent
            url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)
            center / cover
            no-repeat`;
        enemy.y = -ELEM_HEIGHT * gameSettings.traffic * i;
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        gameArea.append(enemy);
    }

    gameSettings.score = 0;
    requestAnimationFrame(animatedCar);
    gameSettings.start = true;
    gameArea.append(car);
    gameSettings.x = car.offsetLeft;
    gameSettings.y = car.offsetTop;
};

const roadLines = () => {
    let lines = document.querySelectorAll('.lines');

    lines.forEach(line => {
        line.y += gameSettings.speed;
        line.style.top = line.y + 'px';

        if (line.y > gameArea.offsetHeight) {
            line.y = -ELEM_HEIGHT;
        }
    });
};

const enemyTraffic = () => {
    let enemys = document.querySelectorAll('.enemy');

    enemys.forEach(enemy => {
        let enemyRect = enemy.getBoundingClientRect();
        let carRect = car.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left &&
                carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            if (gameSettings.score > gameSettings.record) {
                localStorage.setItem('best-record', gameSettings.score);
                alert(`New Record, you scored ${gameSettings.score - gameSettings.record} points more`);
                gameSettings.record = gameSettings.score;
            }

            gameSettings.start = false;
            startBtn.classList.remove('hidden');
            startBtn.style.top = "7.4rem";
        }

        enemy.y += gameSettings.speed / 2;
        enemy.style.top = enemy.y + 'px';

        if (enemy.y >= gameArea.offsetHeight) {
            enemy.y = -ELEM_HEIGHT * gameSettings.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
};

const animatedCar = () => {
    if (gameSettings.start) {
        roadLines();
        enemyTraffic();

        gameSettings.score += gameSettings.speed;
        score.innerHTML = `
        Score: ${gameSettings.score}
        ${gameSettings.record ? `<p>Best Record: ${gameSettings.record}</p>` : ''}
        `;

        if (keys.ArrowLeft && gameSettings.x > 0) {
            gameSettings.x -= gameSettings.speed;
        }
        if (keys.ArrowRight && gameSettings.x < (gameArea.offsetWidth - car.offsetWidth)) {
            gameSettings.x += gameSettings.speed;
        }
        if (keys.ArrowUp && gameSettings.y > 0) {
            gameSettings.y -= gameSettings.speed;
        }
        if (keys.ArrowDown && gameSettings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            gameSettings.y += gameSettings.speed;
        }

        car.style.left = gameSettings.x + 'px';
        car.style.top = gameSettings.y + 'px';

        requestAnimationFrame(animatedCar);
    } else {
        music.pause();
    }
};

const runRace = (ev) => {
    if (keys.hasOwnProperty(ev.key)) {
        ev.preventDefault();
        keys[ev.key] = true;
    }
};

const stopRace = (ev) => {
    if (keys.hasOwnProperty(ev.key)) {
        ev.preventDefault();
        keys[ev.key] = false;
    }
};


startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', runRace);
document.addEventListener('keyup', stopRace);