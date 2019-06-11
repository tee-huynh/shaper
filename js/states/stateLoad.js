var StateLoad = {

    preload: function () {

        var empty = game.add.image(0, 0, "loadingEmpty");
        var full = game.add.image(0, 0, "loadingFull");

        center(empty);
        full.anchor.set(0, 0.5);
        full.x = game.world.centerX - empty.width / 2;
        full.y = empty.y;

        game.load.setPreloadSprite(full);

        game.load.image("background","images/main/Backdrop-03.png");
        game.load.image("dot","images/main/Catcher-01.png");
        game.load.spritesheet("gems","images/main/Shapes-02.png",50,50);

        game.load.audio("whoosh", "audio/sfx/whoosh.mp3");
        game.load.audio("lose", "audio/sfx/lose.wav");
        game.load.audio("shortTick", "audio/sfx/shortTick.mp3");
        game.load.audio("levelUp", "audio/sfx/levelup.wav");

        game.load.audio("backgroundMusic", "audio/background/background.mp3");
        game.load.spritesheet("soundButtons", "images/ui/soundButtons-04.png", 40, 40, 4);

        //PRELOAD EVERYTHING HERE
        game.load.spritesheet("buttons", "images/ui/buttons-red.png", 265, 75);
    },

    create: function () {
        game.state.start("StateTitle");
    },

    update: function () {
        
    }

}