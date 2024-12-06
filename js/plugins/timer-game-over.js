/*:
 * @target MZ
 * @plugindesc 타이머가 0이 되면 게임오버가 되는 시스템
 * @author Claude
 *
 * @param gameOverMessage
 * @text 게임오버 메시지
 * @type string
 * @default 시간이 초과되었습니다!
 * @desc 타이머가 끝났을 때 표시될 메시지
 */

(() => {
    'use strict';
    
    const pluginName = document.currentScript.src.match(/^.*\/(.+)\.js$/)[1];
    const parameters = PluginManager.parameters(pluginName);
    const gameOverMessage = parameters['gameOverMessage'];

    // 타이머 업데이트 확장
    const _Game_Timer_onExpire = Game_Timer.prototype.onExpire;
    Game_Timer.prototype.onExpire = function() {
        _Game_Timer_onExpire.call(this);
        
        // 메시지 표시 후 게임오버
        $gameMessage.add(gameOverMessage);
        setTimeout(() => {
            SceneManager.goto(Scene_Gameover);
        }, 1000);  // 1초 후 게임오버
    };
})();
