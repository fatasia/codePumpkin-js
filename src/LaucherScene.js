var t = 1;
var StartLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var size = cc.winSize;

        this.title = new cc.Sprite(res.title);
        this.logo = new cc.Sprite(res.logo);

        this.title.attr({
            x: size.width / 2,
            y: size.height * 0.3,
        });

        this.logo.attr({
            x: size.width / 2,
            y: size.height * 0.6,
        });

        cc.log("123");
        console.log("456");


        this.addChild(this.title, 0);
        this.addChild(this.logo, 0);

        setTimeout(function () {
            cc.director.runScene(new GameScene());
        }, 2000);
        // setTimeout(function () {
        // cc.director.replaceScene( cc.TransitionPageTurn(1, new GameLayer(), false) );
        // },2000);
        return true;
    }
});

var LaucherScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});