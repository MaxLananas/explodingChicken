document.addEventListener('DOMContentLoaded', function() {
            // Éléments DOM
            const hoursInput = document.getElementById('hours');
            const minutesInput = document.getElementById('minutes');
            const secondsInput = document.getElementById('seconds');
            const startBtn = document.getElementById('startBtn');
            const resetBtn = document.getElementById('resetBtn');
            const timerDisplay = document.getElementById('timerDisplay');
            const chicken = document.getElementById('chicken');
            const chickenBase = document.getElementById('chickenBase');
            const chickenStage = document.getElementById('chickenStage');
            const explosion = document.getElementById('explosion');
            const presetBtns = document.querySelectorAll('.preset-btn');
            const skinOptions = document.querySelectorAll('.skin-option');
            const explosionCount = document.getElementById('explosionCount');
            const totalTime = document.getElementById('totalTime');
            const featherCount = document.getElementById('featherCount');
            
            // Variables
            let timerInterval = null;
            let totalSeconds = 0;
            let elapsedSeconds = 0;
            let explosions = 0;
            let feathers = 0;
            let totalTimeSeconds = 0;
            let currentAnimation = '';
            let currentSkin = 'normal-chicken';
            
            // Initialisation du minuteur
            updateTimerDisplay(
                parseInt(hoursInput.value) || 0,
                parseInt(minutesInput.value) || 0,
                parseInt(secondsInput.value) || 0
            );
            
            // Gestionnaires d'événements
            startBtn.addEventListener('click', startTimer);
            resetBtn.addEventListener('click', resetTimer);
            
            // Gestionnaire pour les boutons de préréglage
            presetBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const seconds = parseInt(this.dataset.time);
                    setTimerFromSeconds(seconds);
                });
            });
            
            // Gestionnaire pour les options de skin
            skinOptions.forEach(option => {
                option.addEventListener('click', function() {
                    skinOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    currentSkin = this.dataset.skin;
                    chickenBase.className = `chicken-base ${currentSkin}`;
                });
            });
            
            // Fonctions
            function startTimer() {
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
                
                const hours = parseInt(hoursInput.value) || 0;
                const minutes = parseInt(minutesInput.value) || 0;
                const seconds = parseInt(secondsInput.value) || 0;
                
                totalSeconds = hours * 3600 + minutes * 60 + seconds;
                if (totalSeconds <= 0) {
                    totalSeconds = 5; // Par défaut 5 secondes si aucun temps n'est spécifié
                    setTimerFromSeconds(totalSeconds);
                }
                
                elapsedSeconds = 0;
                
                // Désactiver les entrées pendant le décompte
                hoursInput.disabled = true;
                minutesInput.disabled = true;
                secondsInput.disabled = true;
                startBtn.disabled = true;
                presetBtns.forEach(btn => btn.disabled = true);
                skinOptions.forEach(opt => opt.style.pointerEvents = 'none');
                
                // Animer le poulet en fonction de la durée du minuteur
                startChickenAnimation();
                
                timerInterval = setInterval(updateTimer, 1000);
            }
            
            function updateTimer() {
                elapsedSeconds++;
                totalTimeSeconds++;
                updateTotalTimeDisplay();
                
                const remainingSeconds = totalSeconds - elapsedSeconds;
                
                if (remainingSeconds <= 0) {
                    clearInterval(timerInterval);
                    explodeChicken();
                    resetInputs();
                    return;
                }
                
                const hours = Math.floor(remainingSeconds / 3600);
                const minutes = Math.floor((remainingSeconds % 3600) / 60);
                const seconds = remainingSeconds % 60;
                
                updateTimerDisplay(hours, minutes, seconds);
                
                // Changer l'animation si on approche de la fin
                if (remainingSeconds <= 5 && currentAnimation !== 'animation-nervous') {
                    stopChickenAnimation();
                    chicken.classList.add('animation-nervous');
                    currentAnimation = 'animation-nervous';
                }
            }
            
            function updateTimerDisplay(hours, minutes, seconds) {
                timerDisplay.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            function resetTimer() {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                
                resetInputs();
                updateTimerDisplay(
                    parseInt(hoursInput.value) || 0,
                    parseInt(minutesInput.value) || 0,
                    parseInt(secondsInput.value) || 0
                );
                
                stopChickenAnimation();
            }
            
            function resetInputs() {
                hoursInput.disabled = false;
                minutesInput.disabled = false;
                secondsInput.disabled = false;
                startBtn.disabled = false;
                presetBtns.forEach(btn => btn.disabled = false);
                skinOptions.forEach(opt => opt.style.pointerEvents = 'auto');
            }
            
            function setTimerFromSeconds(totalSecs) {
                const hours = Math.floor(totalSecs / 3600);
                const minutes = Math.floor((totalSecs % 3600) / 60);
                const seconds = totalSecs % 60;
                
                hoursInput.value = hours;
                minutesInput.value = minutes;
                secondsInput.value = seconds;
                
                updateTimerDisplay(hours, minutes, seconds);
            }
            
            function startChickenAnimation() {
                stopChickenAnimation();
                
                if (totalSeconds > 60) {
                    // Animation de marche pour les longs minuteurs
                    chicken.classList.add('animation-walk');
                    currentAnimation = 'animation-walk';
                } else if (totalSeconds > 10) {
                    // Animation de danse pour les minuteurs moyens
                    chicken.classList.add('animation-dance');
                    currentAnimation = 'animation-dance';
                } else {
                    // Animation de rebond pour les courts minuteurs
                    chicken.classList.add('animation-bounce');
                    currentAnimation = 'animation-bounce';
                }
            }
            
            function stopChickenAnimation() {
                chicken.classList.remove('animation-bounce', 'animation-dance', 'animation-walk', 'animation-nervous');
                currentAnimation = '';
            }
            
            function explodeChicken() {
                // Masquer le poulet
                chicken.style.opacity = '0';
                
                // Incrémenter le compteur d'explosions
                explosions++;
                explosionCount.textContent = explosions;
                
                // Créer l'explosion
                createExplosionEffect();
                
                // Réinitialiser après l'animation
                setTimeout(() => {
                    chicken.style.opacity = '1';
                    explosion.innerHTML = '';
                    stopChickenAnimation();
                }, 3000);
            }
            
            function createExplosionEffect() {
                explosion.innerHTML = '';
                
                // Choisir un type d'explosion aléatoire
                const explosionTypes = ['particles', 'feathers', 'colorful', 'spiral'];
                const explosionType = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
                
                switch (explosionType) {
                    case 'particles':
                        createParticleExplosion();
                        break;
                    case 'feathers':
                        createFeatherExplosion();
                        break;
                    case 'colorful':
                        createColorfulExplosion();
                        break;
                    case 'spiral':
                        createSpiralExplosion();
                        break;
                }
            }
            
            function createParticleExplosion() {
                const particleCount = 50;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'explosion-particle';
                    
                    // Position aléatoire avec une distribution circulaire
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 200;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    // Couleur basée sur le skin actuel
                    let color;
                    switch (currentSkin) {
                        case 'ninja-chicken':
                            color = '#333';
                            break;
                        case 'space-chicken':
                            color = '#4a6fe3';
                            break;
                        case 'rainbow-chicken':
                            color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                            break;
                        case 'zombie-chicken':
                            color = '#61a53f';
                            break;
                        case 'robot-chicken':
                            color = '#aaa';
                            break;
                        default:
                            color = '#f5a742';
                    }
                    
                    particle.style.backgroundColor = color;
                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);
                    
                    // Délai aléatoire pour l'animation
                    particle.style.animationDelay = `${Math.random() * 0.2}s`;
                    
                    explosion.appendChild(particle);
                }
            }
            
            function createFeatherExplosion() {
                const featherCount = 30;
                feathers += featherCount;
                featherCount.textContent = feathers;
                
                for (let i = 0; i < featherCount; i++) {
                    const feather = document.createElement('div');
                    feather.className = 'feather';
                    
                    // Position aléatoire
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 50 + Math.random() * 150;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    // Couleur basée sur le skin actuel
                    let color;
                    switch (currentSkin) {
                        case 'ninja-chicken':
                            color = '#333';
                            break;
                        case 'space-chicken':
                            color = '#4a6fe3';
                            break;
                        case 'rainbow-chicken':
                            color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                            break;
                        case 'zombie-chicken':
                            color = '#61a53f';
                            break;
                        case 'robot-chicken':
                            color = '#aaa';
                            break;
                        default:
                            color = '#f5a742';
                    }
                    
                    feather.style.backgroundColor = color;
                    feather.style.setProperty('--tx', `${tx}px`);
                    feather.style.setProperty('--ty', `${ty}px`);
                    
                    // Taille et rotation aléatoires
                    feather.style.width = `${10 + Math.random() * 20}px`;
                    feather.style.height = `${5 + Math.random() * 10}px`;
                    feather.style.transform = `rotate(${Math.random() * 360}deg)`;
                    
                    // Délai aléatoire
                    feather.style.animationDelay = `${Math.random() * 0.5}s`;
                    
                    explosion.appendChild(feather);
                }
            }
            
            function createColorfulExplosion() {
                const particleCount = 60;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'explosion-particle';
                    
                    // Position aléatoire
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 200;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    // Couleurs vives aléatoires
                    const hue = Math.random() * 360;
                    particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                    
                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);
                    
                    // Taille aléatoire
                    const size = 5 + Math.random() * 15;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    
                    // Délai aléatoire
                    particle.style.animationDelay = `${Math.random() * 0.3}s`;
                    
                    explosion.appendChild(particle);
                }
            }
            
            function createSpiralExplosion() {
                const particleCount = 80;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'explosion-particle';
                    
                    // Position en spirale
                    const angle = (i / particleCount) * Math.PI * 10;
                    const distance = (i / particleCount) * 200;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    // Couleur basée sur la position dans la spirale
                    const hue = (i / particleCount) * 360;
                    particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                    
                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);
                    
                    // Délai progressif
                    particle.style.animationDelay = `${(i / particleCount) * 0.5}s`;
                    
                    explosion.appendChild(particle);
                }
            }
            
            function updateTotalTimeDisplay() {
                const hours = Math.floor(totalTimeSeconds / 3600);
                const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
                const seconds = totalTimeSeconds % 60;
                
                totalTime.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Mise à jour des statistiques
            updateTotalTimeDisplay();
            featherCount.textContent = feathers;
        });