/*:
 * @target MZ
 * @plugindesc 메뉴에서 골드 표시와 HP/MP 바를 제거합니다.
 * @author 사용자
 * 
 * @help
 * 이 플러그인은 메뉴 인터페이스에서 골드 표시와 HP/MP 바를 제거합니다.
 *
 * 적용:
 * 1. 이 코드를 새로운 .js 파일로 저장합니다.
 * 2. RPG Maker MZ의 플러그인 관리자에서 플러그인을 추가하고 활성화합니다.
 *
 * 업데이트 로그:
 * - v1.0: 기본 기능 추가
 */
(() => {
    // 골드 윈도우 제거
    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function () {
        _Scene_Menu_create.call(this);
        if (this._goldWindow) {
            this.removeChild(this._goldWindow); // 골드 윈도우 제거
        }
    };

    // HP/MP 바 제거
    const _Window_MenuStatus_drawItem = Window_MenuStatus.prototype.drawItem;
    Window_MenuStatus.prototype.drawItem = function (index) {
        const actor = $gameParty.members()[index];
        const rect = this.itemRectWithPadding(index);
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;

        // 이름과 레벨만 표시 (HP/MP는 그리지 않음)
        this.drawActorName(actor, x, y, width);
        this.drawActorLevel(actor, x, y + this.lineHeight());
    };
})();
