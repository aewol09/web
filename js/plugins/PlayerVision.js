/*:
 * @target MZ
 * @plugindesc 플레이어 주변에 시야/안개 효과를 추가합니다.
 * @author PlayerVision
 *
 * @param visionRadius
 * @text 시야 반경
 * @desc 플레이어 시야의 타일 단위 반경
 * @default 5
 * @type number
 *
 * @param darknessDensity
 * @text 어둠 농도
 * @desc 시야 밖 어둠의 투명도 (0-255)
 * @default 200
 * @type number
 * @max 255
 * @min 0
 *
 * @help
 * 이 플러그인은 플레이어 주변에 동적인 시야/안개 효과를 만듭니다.
 * 
 * 
 * @command ActivatevisionA
 * @text 플러그인 활성화
 * @desc 비전 플러그인을 활성화합니다.
 *
 * @command DeactivatevisionA
 * @text 플러그인 비활성화
 * @desc 비전 플러그인을 비활성화합니다.
 */
(() => {
    const pluginName = "PlayerVision";
    const parameters = PluginManager.parameters(pluginName);

    const visionRadiusA = Number(parameters['visionRadius'] || 5);
    const darknessDensityA = Number(parameters['darknessDensity'] || 200);

    let visionEnabledA = true;

    class VisionMaskSpriteA extends Sprite {
        constructor() {
            super();
            this._createVisionMask();
        }

        _createVisionMask() {
            const width = Graphics.width;
            const height = Graphics.height;
            this.bitmap = new Bitmap(width, height);
            this._darkness = `rgba(0, 0, 0, ${darknessDensityA / 255})`;
        }

        update() {
            super.update();
            if (!visionEnabledA) {
                this.bitmap.clear();
                return;
            }

            const player = $gamePlayer;
            const screenX = player.screenX();
            const screenY = player.screenY();

            this.bitmap.clear();
            this.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, this._darkness);

            const radius = visionRadiusA * $gameMap.tileWidth();
            const context = this.bitmap._context;

            context.save();
            context.globalCompositeOperation = "destination-out";
            context.beginPath();
            context.arc(screenX, screenY, radius, 0, Math.PI * 2, false);
            context.fill();
            context.restore();
        }
    }

    const _Spriteset_Map_createLowerLayerA = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _Spriteset_Map_createLowerLayerA.call(this);
        this._visionMaskSpriteA = new VisionMaskSpriteA();
        this.addChild(this._visionMaskSpriteA);
    };

    const _Spriteset_Map_updateA = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map_updateA.call(this);
        if (this._visionMaskSpriteA) {
            this._visionMaskSpriteA.update();
        }
    };

    PluginManager.registerCommand('PlayerVision', 'Activate', args => {
        visionEnabledA = true;
    });

    PluginManager.registerCommand('PlayerVision', 'Deactivate', args => {
        visionEnabledA = false;
    });
})();

