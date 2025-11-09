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

function fadeIn(element, displayType = 'block') {
  element.style.display = displayType;
  setTimeout(() => element.classList.add('active'), 20);
}

function fadeOut(element) {
  element.classList.remove('active');
  setTimeout(() => element.style.display = 'none', 400);
}

function showInputScreen() {
  fadeOut(document.getElementById('priorityScreen'));
  fadeIn(document.getElementById('inputScreen'));
}

function showConsentModal() {
  const selectedClass = document.getElementById('classSelect').value;
  const max = parseInt(document.getElementById('maxNumber').value);
  if (!max || max < 1 || max > 25) {
    showCustomAlert(`올바른 숫자를 입력해주세요.`);
    return;
  }

  const consentModal = document.getElementById('consentModal');
  const consentCheckbox = document.getElementById('consentCheckbox');
  const consentConfirmBtn = document.getElementById('consentConfirmBtn');

  fadeIn(consentModal, 'flex');

  consentCheckbox.addEventListener('change', () => {
    consentConfirmBtn.disabled = !consentCheckbox.checked;
  });

  consentConfirmBtn.addEventListener('click', () => {
    fadeOut(consentModal);
    // Reset for next time
    consentCheckbox.checked = false;
    consentConfirmBtn.disabled = true;
    // Proceed to the original function
    showPriorityScreen(true); // Pass a flag to skip validation
  }, { once: true }); // Use { once: true } to avoid multiple listeners
}

function showPriorityScreen(isValidated = false) {
  if (!isValidated) {
    const selectedClass = document.getElementById('classSelect').value;
    const max = parseInt(document.getElementById('maxNumber').value);
    if (!max || max < 1 || max > 25) {
      showCustomAlert(`올바른 숫자를 입력해주세요.`);
      return;
    }
  }
  populatePriorityStudents();
  fadeOut(document.getElementById('inputScreen'));
  fadeIn(document.getElementById('priorityScreen'));
}

function startSeating() {
  const selectedClass = document.getElementById("classSelect").value;
  const max = parseInt(document.getElementById("maxNumber").value);
  const priorityStudents = Array.from(document.querySelectorAll('#priorityStudentList input:checked')).map(input => input.value);
  
  const resultUrl = `result.html?class=${encodeURIComponent(selectedClass)}&max=${max}&priority=${priorityStudents.join(',')}`;
  
  // Add fade-out effect
  document.body.classList.add('fade-out');
  
  // Wait for fade-out to complete, then redirect
  setTimeout(() => {
      window.location.href = resultUrl;
  }, 500); // Matches the CSS transition duration
}

function populatePriorityStudents() {
    const selectedClass = document.getElementById('classSelect').value;
    const max = parseInt(document.getElementById('maxNumber').value);
    const priorityList = document.getElementById('priorityStudentList');
    priorityList.innerHTML = '';

    if (selectedClass && max > 0 && max <= 25) {
        const students = classData[selectedClass];
        for (let i = 0; i < max; i++) {
            const studentName = students[i];
            if (studentName && studentName !== '-') {
                const studentId = i + 1;
                const label = document.createElement('label');
                label.className = 'priority-student-label';
                label.innerHTML = `
                    <input type="checkbox" value="${studentId}">
                    <span>${studentId}번 ${studentName}</span>
                `;
                priorityList.appendChild(label);
            }
        }
    } 
    
    const startBtn = document.getElementById('startSeatingBtn');
    const updateButtonState = () => {
        const checkedCount = priorityList.querySelectorAll('input:checked').length;
        if (checkedCount > 0) {
            startBtn.textContent = '자리 배치하기';
            startBtn.style.backgroundColor = '#007aff';
        } else {
            startBtn.textContent = '선택 안함';
            startBtn.style.backgroundColor = '#6c757d';
        }
    };

    priorityList.addEventListener('change', updateButtonState);
    updateButtonState(); // Initial check
}

document.getElementById('classSelect').addEventListener('change', function() {
  // 설정 숫자 초과시 취소
});
document.getElementById('maxNumber').addEventListener('input', function() {
  // 설정 숫자 초과시 취소
});

function showCustomAlert(message, confirmAction = null, confirmButtonText = '확인') {
  document.getElementById('customAlertMessage').textContent = message;
  const alertOverlay = document.getElementById('customAlert');
  const confirmBtn = document.getElementById('customAlertConfirm');
  const closeBtn = document.getElementById('customAlertClose');

  if (confirmAction) {
    confirmBtn.style.display = 'inline-block';
    confirmBtn.textContent = confirmButtonText;
    confirmBtn.onclick = () => {
      alertOverlay.classList.remove('active');
      confirmAction();
    };
    closeBtn.textContent = '취소';
    closeBtn.onclick = () => {
      alertOverlay.classList.remove('active');
    };
  } else {
    confirmBtn.style.display = 'none';
    closeBtn.textContent = '확인';
    closeBtn.onclick = () => {
      alertOverlay.classList.remove('active');
    };
  }
  alertOverlay.classList.add('active');
}

document.getElementById('customAlertClose').addEventListener('click', function() {
  document.getElementById('customAlert').classList.remove('active');
});

document.getElementById('customAlertConfirm').addEventListener('click', function() {
  // 확인 버튼 스킵
  document.getElementById('customAlert').classList.remove('active');
});

document.querySelector('.custom-select-wrapper').addEventListener('click', function() {
    this.querySelector('.custom-select').classList.toggle('open');
});

for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function() {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
            document.getElementById('classSelect').value = this.dataset.value;
        }
    })
}

window.addEventListener('click', function(e) {
    const select = document.querySelector('.custom-select')
    if (!select.contains(e.target)) {
        select.classList.remove('open');
    }
});
// 키보드 단축키 막기
document.addEventListener('keydown', function(e) {
  // Ctrl+U (소스 보기)
  if (e.ctrlKey && e.key.toLowerCase() === 'u') {
    e.preventDefault();
  }
  // F12 (개발자 도구)
  if (e.key === 'F12') {
    e.preventDefault();
  }
  // Ctrl+Shift+I (개발자 도구)
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
    e.preventDefault();
  }
});

// 마우스 오른쪽 클릭(컨텍스트 메뉴) 막기
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
// Initial load animation
window.addEventListener('load', () => {
  document.querySelector('.container').classList.add('loaded');
});