var Turn = pc.createScript('turn');

Turn.attributes.add('turnSpeed', {
    type: 'number',
    title: 'Turn Speed',
    default: 10
});

Turn.prototype.update = function(dt) {
    this.entity.rotate(0, dt * this.turnSpeed, 0);
};
