class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.points = [];
    }

    addPoint(point) {
        this.points.push(point);
    }
}