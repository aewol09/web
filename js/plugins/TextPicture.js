/*:
 * @plugindesc M 키를 눌렀을 때 게임 조작 메뉴얼을 표시합니다.
 * @author YourName
 *
 * @help
 * M 키를 누르면 게임 조작 메뉴얼 창이 표시됩니다.
 */

(function() {
    // M 키 매핑
    Input.keyMapper[77] = 'manual';

    let manualWindow = null;

    function createManualWindow() {
        const width = Graphics.boxWidth * 0.8;
        const height = Graphics.boxHeight * 0.8;
        const x = (Graphics.boxWidth - width) / 2;
        const y = (Graphics.boxHeight - height) / 2;

        const window = new Window_Base(new Rectangle(x, y, width, height));
        window.opacity = 255;
        
        const text = `
        게임 조작 메뉴얼

        [이동]
        ← → ↑ ↓ : 캐릭터 이동

        [대화]
        Z 키 : NPC 및 오브젝트와 대화

        [메뉴]
        X 키 : 인벤토리, 상태 메뉴 열기

        [대화/선택 확인]
        Z 키 : 선택 및 대화 진행

        [취소/뒤로가기]
        X 키 : 대화 또는 메뉴 취소

        이 메뉴얼을 닫으려면 M 키를 다시 누르세요.
        `;
        
        window.drawTextEx(text, 20, 20, width - 40);
        return window;
    }

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        
        if (Input.isTriggered('manual')) {
            if (!manualWindow) {
                manualWindow = createManualWindow();
                $gameScene.addWindow(manualWindow);
            } else {
                $gameScene.removeWindow(manualWindow);
                manualWindow = null;
            }
        }
    };
})();