const classData = {
  "1반": [
    "김강윤", "김건우", "김도윤", "김 산", "김준영", "김유성", "김지율", "도승희", "박정태", "손민준",
    "신동호", "신지광", "안도준", "양태양", "염다현", "이 산", "이용진", "이태강", "장여민", "장호준",
    "전민규", "조원석", "최민준", "현 산"
  ],
  "2반": [
    "강효석", "김가람", "김국태", "김도윤", "김주원", "김진헌", "남정환", "박태인", "박태훈", "박희준",
    "변재민", "유승우", "윤유비", "이 강", "이준민", "이지우", "이태언", "장준영", "장지현", "조승우",
    "주예찬", "최은석", "한지우", "황인승"
  ],
  "3반": [
    "공현석", "곽민준", "구진호", "김규민", "김도현", "김성민", "김시우", "김재광", "박기승", "박시후", "박주한", "배시형", "심예준",
    "어완석", "이민형", "이우주", "장현준", "전유승", "정선우", "정요엘", "조수현", "진시후", "최지호", "한시우"
  ],
  "4반": [
    "강지후", "김관우", "김광재", "김근우", "김보민", "박세훈", "박준우", "배영준", "서재원", "신수호",
    "신승민", "심정현", "양서준", "우승윤", "이건하", "이윤재", "이주홍", "이태윤", "임지후", "정민준",
    "정은호", "조수호", "허성윤", "황남우"
  ],
  "5반": [
    "곽건우", "길윤호", "김근후", "김준성", "김현진", "박준성", "예승찬", "오규현", "오승열", "우도윤",
    "윤대겸", "윤시후", "이승민", "이신우", "-", "정승준", "정원식", "정유준", "정청운", "제동건", "조한서",
    "최수혁", "하채윤", "허우진", "황시윤"
  ],
  "6반": [
    "강준혁", "권유성", "권준호", "김광훈", "김규태", "김민겸", "김민재", "김주담", "김주빈", "김효근",
    "박대우", "박상욱", "박준영", "박창현", "박한울", "윤지성", "이윤슬", "이주봉", "이준원", "장동원",
    "조유건", "조신우", "전채훈", "조현우"
  ]
};

const contributors = [
    { class: '1반', name: '신지광' },
    { class: '2반', name: '조승우' },
    { class: '3반', name: '이우주' },
    { class: '4반', name: '이태윤' },
    { class: '5반', name: '제동건' },
    { class: '6반', name: '이윤슬' }
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNeighborSeats(seatIndex) {
    const neighbors = [];
    const row = Math.floor(seatIndex / 5);
    const col = seatIndex % 5;

    // Left
    if (col > 0) {
        neighbors.push(seatIndex - 1);
    }
    // Right
    if (col < 4) {
        neighbors.push(seatIndex + 1);
    }
    // Up
    if (row > 0) {
        neighbors.push(seatIndex - 5);
    }
    // Down
    if (row < 4) { // Assuming 5 rows
        neighbors.push(seatIndex + 5);
    }

    return neighbors;
}

function isValidClass2Seating(seating, max) {
    const student20 = 20;
    if (max < student20) return true;

    const forbiddenNeighbors = [1, 6, 9, 11, 13, 24];
    
    const student20Index = seating.indexOf(student20);
    
    if (student20Index === -1) {
        return true;
    }
    
    const neighborIndices = getNeighborSeats(student20Index);
    
    for (const index of neighborIndices) {
        if (index < seating.length) {
            const neighborStudent = seating[index];
            if (forbiddenNeighbors.includes(neighborStudent)) {
                return false;
            }
        }
    }
    
    return true;
}

let dragSrc = null;

function handleDragStart(e) {
  dragSrc = this;
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  if (dragSrc !== this) {
    const tempHTML = this.innerHTML;
    this.innerHTML = dragSrc.innerHTML;
    dragSrc.innerHTML = tempHTML;

    this.classList.add("swap");
    dragSrc.classList.add("swap");
    setTimeout(() => {
      this.classList.remove("swap");
      dragSrc.classList.remove("swap");
    }, 300);
  }
}

async function animateAndAssignSeats() {
    const classroom = document.getElementById("classroom");
    const urlParams = new URLSearchParams(window.location.search);
    const selectedClass = urlParams.get('class');
    const max = parseInt(urlParams.get('max'));
    const priorityStudents = urlParams.get('priority') ? urlParams.get('priority').split(',').map(Number).filter(n => !isNaN(n) && n > 0) : [];

    if (!selectedClass || !classData[selectedClass] || isNaN(max) || max < 1 || max > 25) {
        classroom.innerHTML = "<h1>잘못된 정보입니다.</h1>";
        return;
    }

    // 1. Initial Ordered Placement
    classroom.innerHTML = `<div class="chalkboard">칠판</div>`;
    let currentSeating = Array.from({ length: max }, (_, i) => i + 1);
    for (let i = 0; i < 25; i++) {
        const seat = document.createElement("div");
        seat.className = "seat";
        seat.dataset.seatId = i;
        if (i < max) {
            const studentNumber = currentSeating[i];
            const studentName = classData[selectedClass][studentNumber - 1];
            const seatText = document.createElement('span');
            seatText.className = 'seat-text';
            seatText.textContent = `${studentNumber}번\n${studentName || ''}`;
            seat.appendChild(seatText);
        } else {
            seat.textContent = "-";
        }
        classroom.appendChild(seat);
        seat.style.opacity = 1;
        seat.style.transform = 'translateY(0)';
    }

    // 2. Show "Look Carefully!" Overlay
    const attentionOverlay = document.getElementById("attention-overlay");
    if (attentionOverlay) {
        // Scroll to classroom before showing attention overlay
        setTimeout(() => {
            const classroomElement = document.getElementById("classroom");
            if (classroomElement) {
                classroomElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);

        attentionOverlay.classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 2000));
        attentionOverlay.classList.remove("active");
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 3. Generate and Animate Swaps
    const desiredSwaps = 100; // Increased from 70
    let delay = 500;
    const minDelay = 50;
    const decayFactor = Math.pow(minDelay / delay, 1 / 39);

    if (max > 1) {
        for (let i = 0; i < desiredSwaps; i++) {
            await new Promise(resolve => setTimeout(resolve, delay));

            const seatIdx1 = Math.floor(Math.random() * max);
            let seatIdx2 = Math.floor(Math.random() * max);
            while (seatIdx1 === seatIdx2) {
                seatIdx2 = Math.floor(Math.random() * max);
            }

            const seat1 = classroom.querySelector(`[data-seat-id='${seatIdx1}']`);
            const seat2 = classroom.querySelector(`[data-seat-id='${seatIdx2}']`);

            if (seat1 && seat2) {
                [currentSeating[seatIdx1], currentSeating[seatIdx2]] = [currentSeating[seatIdx2], currentSeating[seatIdx1]];
                const tempHTML = seat1.innerHTML;
                seat1.innerHTML = seat2.innerHTML;
                seat2.innerHTML = tempHTML;

                seat1.classList.add("swap");
                seat2.classList.add("swap");
                setTimeout(() => {
                    seat1.classList.remove("swap");
                    seat2.classList.remove("swap");
                }, 300);
            }

            if (i < 39) {
                delay *= decayFactor;
            } else {
                delay = minDelay;
            }
        }
    }
    // await new Promise(resolve => setTimeout(resolve, 500)); // Removed pause

    // 4. Animate Correction Step for Priority Seating
    const prioritySeatCount = priorityStudents.length;
    const prioritySeatIndices = new Set(Array.from({ length: prioritySeatCount }, (_, i) => i));
    
    let misplacedPriority = [];
    let misplacedNormal = [];

    for (let i = 0; i < max; i++) {
        const studentNumber = currentSeating[i];
        const isPriority = priorityStudents.includes(studentNumber);
        const isInPriorityZone = prioritySeatIndices.has(i);

        if (isPriority && !isInPriorityZone) {
            misplacedPriority.push(i);
        }
        if (!isPriority && isInPriorityZone) {
            misplacedNormal.push(i);
        }
    }

    const correctionSwaps = [];
    for (let i = 0; i < Math.min(misplacedNormal.length, misplacedPriority.length); i++) {
        correctionSwaps.push({ from: misplacedNormal[i], to: misplacedPriority[i] });
    }

    if (correctionSwaps.length > 0) {
        // await new Promise(resolve => setTimeout(resolve, 500)); // Removed pause
        const correctionDelay = minDelay; // Set to max speed
        for (const swap of correctionSwaps) {
            await new Promise(resolve => setTimeout(resolve, correctionDelay));
            const seat1 = classroom.querySelector(`[data-seat-id='${swap.from}']`);
            const seat2 = classroom.querySelector(`[data-seat-id='${swap.to}']`);
            if (seat1 && seat2) {
                [currentSeating[swap.from], currentSeating[swap.to]] = [currentSeating[swap.to], currentSeating[swap.from]];
                const tempHTML = seat1.innerHTML;
                seat1.innerHTML = seat2.innerHTML;
                seat2.innerHTML = tempHTML;
                seat1.classList.add("swap");
                seat2.classList.add("swap");
                setTimeout(() => {
                    seat1.classList.remove("swap");
                    seat2.classList.remove("swap");
                }, 300);
            }
        }
    }
    // await new Promise(resolve => setTimeout(resolve, 500)); // Removed pause

    // 5. Finalization
    const allSeats = classroom.querySelectorAll('.seat');
    allSeats.forEach((seat, i) => {
        if (i < max) {
            const studentNumber = currentSeating[i];
            const studentName = classData[selectedClass][studentNumber - 1];
            
            const existingIcon = seat.querySelector('.certification-mark');
            if (existingIcon) existingIcon.remove();

            const isContributor = contributors.some(c => c.class === selectedClass && c.name === studentName);
            if (isContributor) {
                const icon = document.createElement('i');
                icon.className = 'material-icons certification-mark';
                icon.textContent = 'verified';
                seat.appendChild(icon);
            }

            seat.draggable = true;
            seat.addEventListener("dragstart", handleDragStart);
            seat.addEventListener("dragover", handleDragOver);
            seat.addEventListener("drop", handleDrop);
        }
    });

    document.getElementById("dragGuide").classList.add("visible");
    setTimeout(() => {
        classroom.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 800);

    launchFireworks();
}

function createExplosion(x, y) {
    const container = document.getElementById('fireworks-container');
    const particleCount = 50; // Increased particle count for a fuller effect
    const colors = ['#FFC700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        container.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 2; // Increased velocity
        const radius = Math.random() * (window.innerWidth * 0.2) + (window.innerWidth * 0.2); // Make radius relative to screen width
        const endX = Math.cos(angle) * radius;
        const endY = Math.sin(angle) * radius;

        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const animation = particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px)`, opacity: 1 },
            { transform: `translate(${endX}px, ${endY + 200}px)`, opacity: 0 } // Increased fall distance
        ], {
            duration: 2000 + Math.random() * 1000, // Increased duration
            easing: 'cubic-bezier(0.1, 0.5, 0.1, 1)',
            fill: 'forwards'
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }
}

function launchFireworks() {
    const launchPoints = [0.1, 0.9]; // Left and right sides
    launchPoints.forEach(point => {
        setTimeout(() => {
            createExplosion(window.innerWidth * point, window.innerHeight * 0.5);
        }, Math.random() * 500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').classList.add('loaded');
    animateAndAssignSeats();
});