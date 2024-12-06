/*:
 * @target MZ
 * @plugindesc 실내화를 착용했을 때만 대시가 가능한 시스템
 * @author Claude
 *
 * @param dashShoeId
 * @text 실내화 아이템 ID
 * @type number
 * @min 1
 * @default 1
 * @desc 대시 기능을 활성화할 실내화 아이템의 ID를 입력하세요
 *
 * @help
 * 실내화 아이템을 소지했을 때만 대시가 가능하도록 하는 플러그인입니다.
 * 
 * 1. 데이터베이스에서 실내화 아이템을 생성하세요
 * 2. 생성한 아이템의 ID를 플러그인 설정에 입력하세요
 */

(() => {
    'use strict';
    
    const pluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];
    const parameters = PluginManager.parameters(pluginName);
    const dashShoeId = Number(parameters['dashShoeId']) || 1;

    // 실내화 착용 확인 함수
    function hasDashShoes() {
        return $gameParty.hasItem($dataItems[dashShoeId]);
    }

    // 대시 기능 확장
    const _Game_Player_isDashing = Game_Player.prototype.isDashing;
    Game_Player.prototype.isDashing = function() {
        if (!hasDashShoes()) {
            return false;
        }
        return _Game_Player_isDashing.call(this);
    };

    // 실내화 상태 표시 (메뉴에서)
    const _Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
    Window_ItemList.prototype.drawItem = function(index) {
        _Window_ItemList_drawItem.call(this, index);
        const item = this.itemAt(index);
        if (item && item.id === dashShoeId) {
            const rect = this.itemLineRect(index);
            this.drawText('대시 아이템', rect.x + 160, rect.y, 120);
        }
    };
})();