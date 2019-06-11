var StateOver = {

    preload: function () {


    }
    , create: function () {
        currentState="";

        this.background = game.add.sprite(0,0,"background");
        this.background.width = game.width;
        this.background.height = game.height;

        if(reason!="" && win == false){
            var overText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Over");
            overText.fill = "#000000";
            overText.anchor.set(0.5, 0.5);
            var reasonText = game.add.text(game.world.centerX, game.height*.25, reason);
            reasonText.fill = "#000000";
            reasonText.anchor.set(0.5, 0.5);
            var overText2 = game.add.text(game.world.centerX, game.world.centerY - 75, "Your Score: " + score);
            overText2.fill = "#000000";
            overText2.anchor.set(0.5, 0.5);  
        }
        // else if(win == true){
        //     var reasonText = game.add.text(game.world.centerX, game.height*.25, "You win!");
        //     reasonText.fill = "#ffffff";
        //     reasonText.anchor.set(0.5, 0.5); 
        //     win = false;
        //     var overText2 = game.add.text(game.world.centerX, game.world.centerY - 75, "Your Score: " + score);
        //     overText2.fill = "#ffffff";
        //     overText2.anchor.set(0.5, 0.5);
        // }
        else{
            var overText = game.add.text(game.world.centerX, game.world.centerY - 100, "Game Over");
            overText.fill = "#000000";
            overText.anchor.set(0.5, 0.5);
            var box1 = this.makeGemBox(" In Center", inCenterFrame);
            var box2 = this.makeGemBox(" You Clicked", youClickedFrame);
            box2.x = window.innerWidth-box2.width-10;
            var overText2 = game.add.text(game.world.centerX, game.world.centerY - 75, "Your Score: " + score);
            overText2.fill = "#000000";
            overText2.anchor.set(0.5, 0.5);
        }


        this.btnPlayAgain = gameButtons.addButton("playAgain", -1, -1, this.playAgain, this);
    },

    scoreText: function(text,score){
        var g2 = game.add.group();
        var text2 = game.add.text(50,0,text);
        text2.fill="#000000";
        g2.add(text2);
        g2.add(score);
        return g2;
    },

    makeGemBox: function(text,frame){
        var g = game.add.group();
        var text1 = game.add.text(50,0,text);
        text1.fill="#000000";
        var gem = game.add.sprite(0,0,"gems");
        gem.frame = frame;
        g.add(text1);
        g.add(gem);
        return g;
    }
    , playAgain: function () {
        game.state.start("StateMain");
    }
    , update: function () {

    }

}