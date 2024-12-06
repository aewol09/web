/*:
 * @target MZ
 * @plugindesc Safely execute events even after map transfers.
 * @author ExecuteOtherMapEvent
 *
 * @help
 * This plugin ensures safe execution of specific events, even after map transfers.
 *
 * Plugin Commands:
 * - ExecuteEvent eventId
 *   Executes the event with the given ID on the current map.
 *
 * - UpdateAllEvents
 *   Updates all events on the current map.
 *
 * Example Usage:
 * - ExecuteEvent 3
 *   Executes the event with ID 3 on the current map.
 *
 * - UpdateAllEvents
 *   Updates all events on the current map, including those off-screen.
 *
 * @command ExecuteEvent
 * @text Execute Event
 * @desc Executes a specific event on the current map.
 *
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc The ID of the event to execute.
 * @default 1
 *
 * @command UpdateAllEvents
 * @text Update All Events
 * @desc Updates all events on the current map safely.
 */

(() => {
    const pluginName = "ExecuteOtherMapEvent";

    // 비동기로 맵 로딩 대기
    const waitForMapLoad = () => {
        return new Promise(resolve => {
            const checkMapLoaded = () => {
                // 맵이 로드되고, 이벤트 실행이 멈췄을 때 로딩 완료
                if ($gameMap.isEventRunning() || !DataManager.isMapLoaded()) {
                    setTimeout(checkMapLoaded, 50); // 50ms 간격으로 확인
                } else {
                    resolve();
                }
            };
            checkMapLoaded();
        });
    };

    // 이벤트 실행
    PluginManager.registerCommand(pluginName, "ExecuteEvent", async args => {
        const eventId = Number(args.eventId);

        // 맵 로드가 완료될 때까지 기다림
        await waitForMapLoad();

        const event = $gameMap.event(eventId);
        if (event) {
            // 이벤트의 리스트를 가져옴
            const eventList = event.list();
            if (!eventList || eventList.length === 0) {
                console.error(`Event ID ${eventId} has no commands.`);
                return;
            }

            const eventInterpreter = new Game_Interpreter();
            eventInterpreter.setup(eventList, eventId);

            // 이벤트 실행 중에 먹통 상태가 되지 않도록 처리
            const execute = () => {
                if (eventInterpreter.isRunning()) {
                    eventInterpreter.update();
                    setTimeout(execute, 0); // 이벤트 실행 계속
                } else {
                    // 이벤트 실행이 끝나면 플레이어의 제어를 다시 정상화
                    $gamePlayer.clearAction();
                }
            };

            execute();
        } else {
            console.error(`Event ID ${eventId} is not available on the current map.`);
        }
    });

    // 모든 이벤트 업데이트
    PluginManager.registerCommand(pluginName, "UpdateAllEvents", async () => {
        // 맵 로드 대기
        await waitForMapLoad();

        const allEvents = $gameMap.events();
        allEvents.forEach(event => {
            if (event) {
                try {
                    event.update();
                } catch (e) {
                    console.error(`Failed to update event ID ${event.eventId()}:`, e);
                }
            }
        });
        console.log("All events on the current map have been updated.");
    });

})();
