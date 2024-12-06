/*:
 * @target MZ
 * @plugindesc 특정 키를 눌렀을 때 매뉴얼 창을 표시하는 플러그인입니다.
 * @author YourName
 * 
 * @param KeyCode
 * @type number
 * @default 77
 * @desc 매뉴얼 창을 띄우기 위한 키 코드 (기본값: 77, 'M' 키).
 * 
 * @param ManualText
 * @type multiline_string
 * @default "이 게임의 플레이 방법:\n- 방향키: 이동\n- Z: 확인\n- X: 메뉴 열기\n즐거운 시간 되세요!"
 * @desc 매뉴얼 창에 표시될 텍스트.
 * 
 * @help
 * 이 플러그인은 특정 키를 눌렀을 때 매뉴얼 창을 표시합니다.
 * 
 * === 사용법 ===
 * 1. 플러그인을 설치하고 활성화합니다.
 * 2. 플러그인 매개변수에서 키 코드(KeyCode)와 표시할 텍스트(ManualText)를 설정합니다.
 * 3. 게임 실행 중 설정된 키를 누르면 매뉴얼 창이 나타납니다.
 * 
 * === 키 코드 참고 ===
 * - 'M' 키: 77 (기본값)
 * - 'H' 키: 72
 * - 'Enter': 13
 * - 'Esc': 27
 * 
 * === 주의 ===
 * 키 코드는 ASCII 코드에 따라 설정됩니다.
 */

(() => {
    const parameters = PluginManager.parameters("ManualKey");
    const keyCode = Number(parameters["KeyCode"] || 77); // 기본값: 'M' 키
    const manualText = String(parameters["ManualText"] || 
        " -이동키 : W,A,S,D 또는 방향키\n -상호작용 : Space 또는 Enter\n -설정 창 : Esc");

    let isManualOpen = false; // 매뉴얼 창이 열려 있는지 여부
    let manualWindow = null; // 매뉴얼 창을 참조할 변수

    // 새로운 메서드 정의
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        // 특정 키 입력 감지
        if (Input.isTriggered("tab") && !isManualOpen) { // Shift + M 키
            this.callManualWindow();
        }
    };

    Scene_Map.prototype.callManualWindow = function () {
        // 매뉴얼 창이 이미 열려 있다면 새로 열지 않음
        if (isManualOpen) return;

        isManualOpen = true;

        // 창 생성
        manualWindow = new Window_Scrollable(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        manualWindow.setText(manualText);
        manualWindow.open();
        this.addChild(manualWindow);

        // ESC 또는 확인 키로 창 닫기
        const interval = setInterval(() => {
            if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
                this.removeChild(manualWindow);
                isManualOpen = false; // 창이 닫히면 상태를 false로 변경
                clearInterval(interval);
                $gamePlayer._movementSucceeded = true; // 이동 가능하도록 설정
            }
        }, 100);

        // 움직임 잠금
        $gamePlayer._movementSucceeded = false; // 이동 불가
    };

    // 커스텀 윈도우 정의 (스크롤 가능한 창)
    class Window_Scrollable extends Window_Base {
        constructor(x, y, width, height) {
            super(new Rectangle(x, y, width, height));
            this.contents = new Bitmap(width - 32, height - 32);
            this._scrollY = 0;
        }

        setText(text) {
            this.contents.clear();
            this.drawTextEx(text, 16, 16);
        }

        update() {
            super.update();
            this.scrollWindow();
        }

        scrollWindow() {
            if (this._scrollY + this.height <= this.contents.height) {
                if (Input.isPressed("down")) {
                    this._scrollY += 4; // 스크롤 속도
                }
                if (Input.isPressed("up") && this._scrollY > 0) {
                    this._scrollY -= 4; // 스크롤 속도
                }
                this.contents.clear();
                this.drawTextEx(manualText, 16, 16 - this._scrollY);
            }
        }
    }

    // 플레이어 움직임 잠금 해제
    const _Game_Player_isMoveSucceeded = Game_Player.prototype.isMoveSucceeded;
    Game_Player.prototype.isMoveSucceeded = function() {
        if (!isManualOpen) {
            return _Game_Player_isMoveSucceeded.call(this);
        }
        return false; // 매뉴얼 창이 열려 있으면 이동 안됨
    };

})();
