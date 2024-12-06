(() => {
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        if ($dataItems && $dataItems[0009]) {
            $gameParty.gainItem($dataItems[0009], 1); // 아이템 추가
        }
    };
})();
