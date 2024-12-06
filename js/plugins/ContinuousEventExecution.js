/*:
 * @plugindesc 맵 이동 시 이벤트 위치와 실행 상태 유지
 * @author YourName
 *
 * @help 맵 간 이동해도 이벤트의 위치와 실행 상태를 지속시킵니다.
 */

(function() {
    // 이벤트 상태 관리 클래스
    class PersistentEventManager {
        constructor() {
            this.eventStates = {};
        }

        // 이벤트 상태 저장
        saveEventState(mapId, eventId, x, y, isRunning) {
            const key = `${mapId}-${eventId}`;
            this.eventStates[key] = {
                x: x,
                y: y,
                isRunning: isRunning,
                lastUpdateTime: Date.now()
            };
            
            // 게임 변수에 영구 저장
            $gameVariables.setValue(key, JSON.stringify(this.eventStates[key]));
        }

        // 이벤트 상태 로드
        loadEventState(mapId, eventId) {
            const key = `${mapId}-${eventId}`;
            
            // 게임 변수에서 먼저 로드
            const savedState = $gameVariables.value(key);
            if (savedState) {
                return JSON.parse(savedState);
            }

            return null;
        }

        // 이벤트 위치 복원
        restoreEventPosition(event) {
            const savedState = this.loadEventState(event._mapId, event._eventId);
            if (savedState) {
                // 위치 복원
                event.setPosition(savedState.x, savedState.y);
                
                // 실행 상태 복원
                if (savedState.isRunning) {
                    event.start();
                }
            }
        }
    }

    // 전역 관리자 생성
    const persistentEventManager = new PersistentEventManager();

    // 게임 이벤트 초기화 메서드 확장
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        
        // 이벤트 상태 복원
        persistentEventManager.restoreEventPosition(this);
    };

    // 이벤트 업데이트 메서드 확장
    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.call(this);
        
        // 현재 이벤트 상태 주기적으로 저장
        persistentEventManager.saveEventState(
            this._mapId, 
            this._eventId, 
            this._x, 
            this._y, 
            this._starting || this._trigger > 0
        );
    };

    // 맵 변경 시 이벤트 상태 유지를 위한 후크
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        
        // 현재 맵의 모든 이벤트 상태 저장
        $gameMap.events().forEach(event => {
            persistentEventManager.saveEventState(
                event._mapId, 
                event._eventId, 
                event._x, 
                event._y, 
                event._starting || event._trigger > 0
            );
        });
    };

    // 글로벌 함수로 수동 상태 저장/로드 기능 제공
    window.saveEventState = function(mapId, eventId) {
        const event = $gameMap.event(eventId);
        if (event) {
            persistentEventManager.saveEventState(
                mapId, 
                eventId, 
                event._x, 
                event._y, 
                event._starting || event._trigger > 0
            );
        }
    };

    window.loadEventState = function(mapId, eventId) {
        return persistentEventManager.loadEventState(mapId, eventId);
    };
})();