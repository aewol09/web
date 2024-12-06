/*:
 * @target MZ
 * @plugindesc WASD 키를 방향키로 사용하도록 변경하는 플러그인
 * @author Your Name
 * 
 * @help
 * 이 플러그인은 WASD 키를 방향키로 사용하도록 변경합니다.
 * 
 * 기본적인 방향키 이동을 WASD 키로 대체합니다:
 * - W -> 위쪽 화살표
 * - A -> 왼쪽 화살표
 * - S -> 아래쪽 화살표
 * - D -> 오른쪽 화살표
 */

(() => {
    // WASD 키를 방향키로 매핑
    Input.keyMapper[65] = 'left';  // A -> 왼쪽
    Input.keyMapper[87] = 'up';    // W -> 위쪽
    Input.keyMapper[68] = 'right'; // D -> 오른쪽
    Input.keyMapper[83] = 'down';  // S -> 아래쪽
})();
