var StateTitle = {

    preload: function () {


    }
    , create: function () {
        currentState="title";
        
        this.background = game.add.sprite(0,0,"background");
        this.background.width = game.width;
        this.background.height = game.height;

        var titleText = game.add.text(game.world.centerX, game.world.centerY - 100, "CATCH EM");
        titleText.fontSize = 64;
        titleText.fill = "#ffffff";
        titleText.anchor.set(0.5, 0.5);

        this.btnStart = gameButtons.addButton("start", -1, -1, this.startGame, this);
    }
    , startGame: function () {
        game.state.start("StateMain");
    }
    , update: function () {

    }

}