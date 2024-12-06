/*:
 * @target MZ
 * @plugindesc 맵 이벤트 로딩 및 거리 제한 해제
 * @author YourName
 *
 * @help
 * 모든 맵 이벤트의 로딩과 실행을 보장하는 플러그인입니다.
 */

(() => {
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._alwaysActive = true; // 항상 활성 상태
    };

    const _Game_Event_isCollidedWithCharacters = Game_Event.prototype.isCollidedWithCharacters;
    Game_Event.prototype.isCollidedWithCharacters = function(x, y) {
        if (this._alwaysActive) return false;
        return _Game_Event_isCollidedWithCharacters.call(this, x, y);
    };

    const _Game_Event_updateTriggerByDistance = Game_Event.prototype.updateTriggerByDistance;
    Game_Event.prototype.updateTriggerByDistance = function() {
        if (this._alwaysActive) return true;
        return _Game_Event_updateTriggerByDistance.call(this);
    };
})();