var Network = pc.createScript('network');

// static variables
Network.id = null;
Network.socket = null;
Network.spawn = false;
Network.numLanterns = 100;

// initialize code called once per entity
Network.prototype.initialize = function() {
    this.player = this.app.root.findByName('Camera Offset');
    this.other = this.app.root.findByName('Other Camera Offset');
    
    var socket = io.connect('https://networking-playcanvas.glitch.me');
    Network.socket = socket;
    
    socket.emit ('initialize');

    var self = this;
    socket.on ('playerData', function (data) {
        self.initializePlayers (data);
    });

    socket.on ('playerJoined', function (data) {
        self.addPlayer(data);
    });

    socket.on ('playerMoved', function (data) {
        self.movePlayer(data);
    });

    socket.on ('killPlayer', function (data) {
        self.removePlayer(data);
    });
    
    socket.on ('spawnLanterns', function (data) {
            self.initializeLanterns(data);
    });
    
    socket.on ('moreLanterns', function (data) {
        self.generateNewLanterns(data);
    });
    
};

Network.prototype.initializeLanterns = function (data) {
    for (i = 0; i < data; i++) {
        var lanternAsset = this.app.assets.get(46890031);
        var instance = lanternAsset.resource.instantiate();


        instance.setLocalPosition(
            pc.math.random(-100, 100),
            pc.math.random(30, 90),
            pc.math.random(-100, 100)
        );

        this.app.root.addChild(instance);
    }
};

Network.prototype.initializePlayers = function (data) {
    this.players = data.players;
    Network.id = data.id;

    for(var id in this.players){
        if(id != Network.id){
            this.players[id].entity = this.createPlayerEntity(this.players[id]);
        }
    }
    

    this.initialized = true;
    console.log('initialized');
};

Network.prototype.generateNewLanterns = function (data) {
    if (this.initialized) {
        this.initializeLanterns(data);
        Network.spawn = false;
    }
};

Network.prototype.addPlayer = function (data) {
    this.players[data.id] = data;
    this.players[data.id].entity = this.createPlayerEntity(data);
};

Network.prototype.movePlayer = function (data) {
    if (this.initialized && !this.players[data.id].deleted) {
        this.players[data.id].entity.setPosition(data.x, data.y, data.z);
    }
};

Network.prototype.removePlayer = function (data) {
    if (this.players[data].entity) {
        this.players[data].entity.destroy ();
        this.players[data].deleted = true;
    }
};

Network.prototype.createPlayerEntity = function (data) {
    var newPlayer = this.other.clone();
    newPlayer.enabled = true;

    this.other.getParent().addChild(newPlayer);

    if (data) {
        newPlayer.setPosition(data.x, data.y, data.z);
    }
        

    return newPlayer;
};

// update code called every frame
Network.prototype.update = function(dt) {
    this.updatePosition();
    this.letThereBeLanterns();
};

Network.prototype.updatePosition = function () {
    if (this.initialized) {
        //if (this.player === null) { return; }
        var pos = this.player.getPosition();
        Network.socket.emit('positionUpdate', {id: Network.id, x: pos.x, y: pos.y, z: pos.z});
    }
};

Network.prototype.generateNewLanterns = function () {
    Network.spawn = true;
};

Network.prototype.letThereBeLanterns = function () {
    var onKeyDown = function (e) {
        if (e.key === pc.KEY_L) {
            Network.spawn = true;
        }
        e.event.preventDefault(); // Use original browser event to prevent browser action.
    };
    this.app.keyboard.on("keydown", onKeyDown, this);
    
    if (Network.spawn === true) {
        this.initializeLanterns(Network.numLanterns);
        if (this.initialized) {
            Network.socket.emit('updateLanterns', Network.numLanterns);
        }
        Network.numLanterns++;
        Network.spawn = false;
    }
};