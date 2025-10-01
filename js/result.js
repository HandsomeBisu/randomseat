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

function displaySeatingResults() {
    const classroom = document.getElementById("classroom");
    const urlParams = new URLSearchParams(window.location.search);
    const selectedClass = urlParams.get('class');
    const max = parseInt(urlParams.get('max'));
    const priorityStudents = urlParams.get('priority') ? urlParams.get('priority').split(',').map(Number).filter(n => !isNaN(n) && n > 0) : [];

    if (!selectedClass || !classData[selectedClass]) {
        classroom.innerHTML = "<h1>잘못된 반 정보입니다.</h1>";
        return;
    }

    if (isNaN(max) || max < 1 || max > 25) {
        classroom.innerHTML = "<h1>잘못된 학생 수 정보입니다.</h1>";
        return;
    }

    classroom.innerHTML = `<div class="chalkboard">칠판</div>`;

    let numbers = Array.from({ length: max }, (_, i) => i + 1);
    
    let priorityNumbers = priorityStudents.filter(n => n <= max);
    let remainingNumbers = numbers.filter(num => !priorityNumbers.includes(num));
    
            shuffle(priorityNumbers);

        // To improve perceived randomness, shuffle the remaining students multiple times.
        for (let i = 0; i < 3; i++) {
            shuffle(remainingNumbers);
        }

    const finalSeating = [...priorityNumbers, ...remainingNumbers];

    let seatCount = 0;
    for (let i = 0; i < 25; i++) {
      const seat = document.createElement("div");
      seat.className = "seat";
      if (seatCount < max) {
          const number = finalSeating[seatCount];
          const name = classData[selectedClass][number - 1];
          
          const seatText = document.createElement('span');
          seatText.className = 'seat-text';
          seatText.textContent = number ? `${number}번\n${name ?? ''}` : "-";
          seat.appendChild(seatText);

          const isContributor = contributors.some(c => c.class === selectedClass && c.name === name);

          if (isContributor) {
              const icon = document.createElement('i');
              icon.className = 'material-icons certification-mark';
              icon.textContent = 'verified';
              seat.appendChild(icon);
          }

      } else {
          seat.textContent = "-";
      }
      seat.draggable = true;
      seat.addEventListener("dragstart", handleDragStart);
      seat.addEventListener("dragover", handleDragOver);
      seat.addEventListener("drop", handleDrop);
      classroom.appendChild(seat);
      setTimeout(() => seat.classList.add("show"), 100 + (Math.floor(i / 5) * 120));
      seatCount++;
    }

    document.getElementById("dragGuide").classList.add("visible");

    setTimeout(() => {
        const classroomElement = document.getElementById("classroom");
        if (classroomElement) {
            classroomElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').classList.add('loaded');

    if (sessionStorage.getItem('hasFinishedLoading') === 'true') {
        const loader = document.getElementById("loader");
        if(loader) loader.remove();
        
        displaySeatingResults();

        sessionStorage.removeItem('hasFinishedLoading');
    } else {
        const loader = document.getElementById("loader");
        loader.classList.add("active");

        const delay = Math.random() * 2000 + 1000;
        setTimeout(() => {
            loader.classList.remove("active");
            displaySeatingResults();
        }, delay);
    }
});