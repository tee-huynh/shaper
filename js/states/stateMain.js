var StateMain = {

    preload: function () {

    },

    create: function () {
        currentState="stateMain";
        this.colorLimit = 3;
        this.symbolLimit = 3;
        this.lastColor = -1;
        this.lastSymbol = -1;
        //reset the score
        score = 0;
        this.clickLock = false;
        reason = "";

        //if using a scrolling game uncomment these lines
        //this.audioGroup=game.add.group();
        //this.audioGroup.fixedToCamera=true;

        this.background = game.add.sprite(0,0,"background");
        this.background.width = game.width;
        this.background.height = game.height;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.topBar = game.add.sprite(0,0,"topBar");

        this.dot = game.add.sprite(game.width/2,game.height/2,"dot");
        this.dot.anchor.set(0.5,0.5);

        game.physics.enable(this.topBar, Phaser.Physics.ARCADE);
        game.physics.enable(this.dot, Phaser.Physics.ARCADE);

        this.topBar.body.immovable = true;
        this.dot.body.immovable = true;

        this.uiGroup = game.add.group();

        this.uiGroup.add(this.topBar);
        this.uiGroup.add(this.dot);

        this.addGems();
        this.addButtons();
        this.addText();
        this.addTimer();
    },

    addTimer: function() {
        this.timerBar = game.add.graphics();
        this.timerBar.beginFill("0xff0000", 0.5);
        this.timerBar.drawRect(0,game.height-30,game.width, 30);
        this.timerBar.endFill();
        this.timer1 = game.time.events.loop(Phaser.Timer.SECOND/100,this.tick,this);
    },

    tick: function() {
        var seconds = 6;
        var amount = game.width/seconds;
        this.timerBar.width-=amount/100;
        if(this.timerBar.width < 0){
            //game over
            reason = "Out of Time";
            this.doGameOver();
        }
    },

    addText: function() {
        this.scoreText = game.add.text(game.world.centerX, 0, "0");
        this.scoreText.fill = "#ffffff";
        this.scoreText.fontSize = 36;
        this.scoreText.anchor.set(0.5,0.5);

        this.scoreLabel = game.add.text(game.world.centerX, 0, "score");
        this.scoreLabel.fill = "#ffffff";
        this.scoreLabel.fontSize = 32;
        this.scoreLabel.anchor.set(0.5,0.5);

        this.scoreLabel.y = this.scoreLabel.height/2;
        this.scoreText.y = this.scoreLabel.y + this.scoreLabel.height;
    },

    addGems: function() {
        this.gemGroup = game.add.group();
        this.gemGroup.enableBody = true;
        this.gemGroup.physicalBodyType = Phaser.Physics.ARCADE;
        for(var i=0; i<30; i++){
            var gem = game.add.sprite(game.world.randomX,game.world.randomY, "gems");
            gem.anchor.set(0.5,0.5);
            this.gemGroup.add(gem);
            gem.body.bounce.set(1,1);
            gem.body.collideWorldBounds = true;
            gem.body.velocity.x = game.rnd.integerInRange(-100,100);
            gem.body.velocity.y = game.rnd.integerInRange(-100,100);
            var color = game.rnd.integerInRange(0,this.colorLimit);
            var symbol = game.rnd.integerInRange(0,this.symbolLimit);

            if(this.prevColor && this.prevSymbol){
                var choice = game.rnd.integerInRange(0, 100);
                if (choice < 50){
                    color = this.prevColor;
                }
                else{
                    symbol = this.prevSymbol;
                }
            }

            gem.frame = this.getFrame(color,symbol);
            gem.inputEnabled = true;
            gem.events.onInputDown.add(this.gemClicked,this);

            this.prevColor = color;
            this.prevSymbol = symbol;
        }
    },

    gemClicked: function(gem) {
        if(this.clickLock == true){
            return;
        }
        this.clickLock = true;
        if(this.copy){
            this.copy.destroy();
        }

        youClickedFrame = gem.frame;

        var currentColor = this.getColor(gem.frame);
        var currentSymbol = this.getSymbol(gem.frame);

        if (this.lastColor != -1){
            if(currentColor != this.lastColor && currentSymbol != this.lastSymbol){
                gameMedia.playSound(this.loseSound);
                this.doGameOver();
                return;
            }

            if(currentColor == this.lastColor && currentSymbol == this.lastSymbol){
                gameMedia.playSound(this.loseSound);
                this.doGameOver();
                return;
            }
        }
        this.copy = game.add.sprite(gem.x, gem.y, "gems");
        this.copy.frame = gem.frame;
        this.copy.anchor.set(0.5,0.5);

        inCenterFrame = gem.frame;

        gem.destroy();
        gameMedia.playSound(this.whooshSound);
        var myTween = game.add.tween(this.copy).to({y: game.height/2, x:game.width/2}, 100, Phaser.Easing.Linear.None, true);
        myTween.onComplete.add(this.tweenDone,this);

        this.lastColor = currentColor;
        this.lastSymbol = currentSymbol;
        this.upscore();
        if (this.hasMatch() == false){
            if(this.gemGroup.children.length<3){
                this.nextLevel();
            }
            else{
                //game over
                reason = "No moves left!";
                this.doGameOver();
            }
        }
        this.timerBar.width = game.width;
    },

    doGameOver: function() {

        game.time.events.remove(this.timer1);
        gameMedia.playSound(this.loseSound);
        game.state.start("StateOver");
    },

    nextLevel: function() {

        this.lastColor = -1;
        this.lastSymbol = -1;
        this.colorLimit++;
        this.symbolLimit++;
        if(this.colorLimit > 3){
            this.colorLimit = 3;
        }
        if(this.symbolLimit > 3){
            this.symbolLimit = 3;
        }
        this.addGems();
    },

    hasMatch: function() {
        var found = false;
        this.gemGroup.forEach(function(gem){
            if(found == false){
                var gemColor = this.getColor(gem.frame);
                var gemSymbol = this.getSymbol(gem.frame);
                if(gemColor != this.lastColor || gemSymbol != this.lastSymbol){
                    if(gemColor == this.lastColor || gemSymbol == this.lastSymbol){
                        found = true;
                    }
                }
            }
        }.bind(this));
        return found;
    },

    upscore: function() {
        score++;
        this.scoreText.text = score;
        if(score == 30){
            win = true;
            this.doGameOver();
            return;
        }
    },

    tweenDone: function(){
        this.clickLock = false;
    },

    getFrame: function(color,symbol) {
        var frame = color*3+symbol;
        return frame;
    },

    getColor(frame) {
        return Math.floor(frame / 3);
    },

    getSymbol(frame) {
        var s = frame - (Math.floor(frame/3)*3);
        return s;
    },

    addButtons: function() {

        this.whooshSound = game.add.audio("whoosh");
        this.shortTickSound = game.add.audio("shortTick");
        this.loseSound = game.add.audio("lose");
        this.levelUpSound = game.add.audio("levelUp");

        //add some buttons
        //this.btnYes = gameButtons.addButton("yes", -1, -1, this.sayYes, this);
        //this.btnNo = gameButtons.addButton("no", -1, this.btnYes.y - this.btnYes.height, this.sayNo, this);

        //add sound buttons
        this.btnMusic = gameButtons.addAudioButton("music", 0, 0, gameButtons.toggleMusic, this);
        this.btnSound = gameButtons.addAudioButton("sound", game.width-40, 0, gameButtons.toggleSound, this);

        //define background music
        this.backgroundMusic = game.add.audio("backgroundMusic");
        //pass the background music to the gameMedia object
        gameMedia.setBackgroundMusic(this.backgroundMusic);

        //init the music
        gameMedia.updateMusic();
        //init the sound buttons
        gameButtons.updateButtons();

    },

    update: function () {
        game.physics.arcade.collide(this.gemGroup);
        game.physics.arcade.collide(this.gemGroup, this.uiGroup);

    }
    , sayYes: function () {
        //play sound by passing it to game media
        gameMedia.playSound(this.elephant);
    }
    , sayNo: function () {
        this.backgroundMusic.stop();
        game.state.start("StateOver");
    }


}