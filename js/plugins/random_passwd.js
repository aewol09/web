(function() {
    // 비밀번호를 정의합니다.
    const correctPassword = "1234";  // 원하는 비밀번호로 변경하세요.
    
    // 사용자에게 비밀번호 입력을 받기 위한 함수
    const passwordInput = prompt("비밀번호를 입력하세요:");
    
    // 입력한 비밀번호가 맞는지 확인
    if (passwordInput === correctPassword) {
        // 비밀번호가 맞으면 2번 페이지로 전환
        $gameSwitches.setValue(1, true);  // Switch 1을 true로 설정
    } else {
        // 비밀번호가 틀리면 3번 페이지로 전환
        $gameSwitches.setValue(2, true);  // Switch 2를 true로 설정
    }
})();
