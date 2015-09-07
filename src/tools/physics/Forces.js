import NodeList from "src/dataTypes/structures/lists/NodeList";
import List from "src/dataTypes/lists/List";
import NumberList from "src/dataTypes/numeric/NumberList";
import Point from "src/dataTypes/geometry/Point";
import { TwoPi } from "src/Global";

/**
 * @classdesc Force layout
 *
 * @constructor
 * @category networks
 */
function Forces(configuration) {
  this.k = configuration.k ? configuration.k : 0.01;
  this.dEqSprings = configuration.dEqSprings ? configuration.dEqSprings : 100;
  this.dEqRepulsors = configuration.dEqRepulsors ? configuration.dEqRepulsors : 500;
  this.friction = configuration.friction ? configuration.friction : 0.8;

  this.nodeList = new NodeList();

  this.forcesList = new List();
  this.equilibriumDistances = new NumberList();
  this.forcesTypeList = new List();
  this.fromNodeList = new NodeList();
  this.toNodeList = new NodeList();

  this._i0 = 0;
}
export default Forces;

/**
 * eqDistancesMode:
 * 		0: all distances this.dEqSprings
 * 		1: shorter distances for heavy relations
 * 		2: nodes degrees sum proportional to distance
 */
Forces.prototype.forcesForNetwork = function(network, initRadius, initCenter, eqDistancesMode, addShortRepulsorsOnRelated) {
  initRadius = initRadius || 0;
  initCenter = initCenter || new Point(0, 0);
  eqDistancesMode = eqDistancesMode == null ? 0 : eqDistancesMode;
  addShortRepulsorsOnRelated = addShortRepulsorsOnRelated == null ? false : addShortRepulsorsOnRelated;


  this.forcesList = new List();
  this.equilibriumDistances = new NumberList();
  this.forcesTypeList = new List();
  this.fromNodeList = new NodeList();
  this.toNodeList = new NodeList();

  var node0;
  var node1;
  var nNodes = network.nodeList.length;
  var i;
  var j;
  var relations = network.relationList;
  var angle;

  for(i = 0; i < nNodes; i++) {
    if(initRadius === 0) {
      this.addNode(network.nodeList[i], new Point(network.nodeList[i].x, network.nodeList[i].y));
    } else {
      angle = Math.random() * TwoPi;
      this.addNode(network.nodeList[i], new Point(initCenter.x + initRadius * Math.cos(angle), initCenter.y + initRadius * Math.sin(angle)));
    }
  }

  for(i = 0; i < nNodes - 1; i++) {
    node0 = network.nodeList[i];
    for(j = i + 1; j < nNodes; j++) {
      node1 = network.nodeList[j];
      if(relations.nodesAreConnected(node0, node1)) {
        switch(eqDistancesMode) {
          case 0:
            this.equilibriumDistances.push(this.dEqSprings);
            break;
          case 1:
            this.equilibriumDistances.push((1.1 - relations.getFirstRelationByIds(node0.id, node1.id, false).weight) * this.dEqSprings);
            break;
          case 2:
            this.equilibriumDistances.push(Math.sqrt(Math.min(node0.nodeList.length, node1.nodeList.length)) * this.dEqSprings * 0.1);
            break;
        }

        this.addForce(node0, node1, "Spring");

        if(addShortRepulsorsOnRelated) {
          this.equilibriumDistances.push(this.dEqRepulsors * 0.5);
          this.addForce(node0, node1, "Repulsor");
        }

      } else {
        this.equilibriumDistances.push(this.dEqRepulsors);
        this.addForce(node0, node1, "Repulsor");
      }
    }
  }
};

/**
 * @todo write docs
 */
Forces.prototype.addNode = function(node, initPosition, initSpeed) {
  initPosition = initPosition == null ? new Point(Math.random() * 200 - 100, Math.random() * 200 - 100) : initPosition;
  initSpeed = initSpeed == null ? new Point(0, 0) : initSpeed;
  this.nodeList.addNode(node);
  node.x = initPosition.x;
  node.y = initPosition.y;
  node.vx = initSpeed.x;
  node.vy = initSpeed.y;
  node.ax = 0;
  node.ay = 0;
};

/**
 * @todo write docs
 */
Forces.prototype.addForce = function(node0, node1, type, equilibriumDistance) {
  this.fromNodeList.addNode(node0);
  this.toNodeList.addNode(node1);
  this.forcesList.push(node0.id + "*" + node1.id + "*" + type);
  this.forcesTypeList.push(type);
  if(equilibriumDistance != null) this.equilibriumDistances.push(equilibriumDistance);
};

/**
 * @todo write docs
 */
Forces.prototype.calculate = function() {
  var i;
  var node0, node1;
  var type;
  var force;
  var dx, dy, d;
  var eqDistance;

  // 1. reset accelerations
  this._resetAccelerations(); //TODO: this can be removed if accelerations are resetd in applyForces [!]

  // 2. calculate new accelerations from forces
  for(i = 0; this.forcesList[i] != null; i++) {
    node0 = this.fromNodeList[i];
    node1 = this.toNodeList[i];
    type = this.forcesTypeList[i];
    dx = node1.x - node0.x;
    dy = node1.y - node0.y;
    d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    eqDistance = this.equilibriumDistances[i];
    if(type == 'Repulsor' && d > eqDistance) continue;
    if(type == 'Attractor' && d < eqDistance) continue;

    switch(type) {
      case "Spring":
      case "Repulsor":
      case "Attractor":
        force = this.k * (d - eqDistance) / d;
        node0.ax += force * dx;
        node0.ay += force * dy;
        node1.ax -= force * dx;
        node1.ay -= force * dy;
        break;
      case "DirectedSpring":
        force = this.k * (d - eqDistance) / d;
        node1.ax -= force * dx;
        node1.ay -= force * dy;
        break;
      case "DirectedRepulsor":
        if(d < eqDistance) {
          force = this.k * (d - eqDistance) / d;
          node1.ax -= force * dx;
          node1.ay -= force * dy;
        }
        break;
    }
  }
};

/**
 * @todo write docs
 */
Forces.prototype.attractionToPoint = function(point, strength, limit) {
  strength = strength == null ? 1 : strength;
  var node;
  var force;
  var dx;
  var dy;
  var d2;
  for(var i = 0; this.nodeList[i] != null; i++) {
    node = this.nodeList[i];
    dx = point.x - node.x;
    dy = point.y - node.y;
    d2 = Math.pow(dx, 2) + Math.pow(dy, 2);
    if(limit != null) {
      force = Math.min(strength / d2, limit);
    } else {
      force = strength / d2;
    }
    node.ax += force * dx;
    node.ay += force * dy;
  }
};


/**
 * @todo write docs
 */
Forces.prototype.avoidOverlapping = function(delta) {
  delta = delta || 0;

  var i;
  var node0;
  var node1;
  var x0l, y0t, x0r, y0b, x1l, y1t, x1r, y1b;
  var vx;
  var vy;
  var dM = delta * 0.5;
  var l = this.nodeList.length;

  console.log(this.nodeList.length);

  for(i = 0; this.nodeList[i + 1] != null; i++) {
    node0 = this.nodeList[(i + this._i0) % l];
    x0l = node0.x - node0.width * 0.5 - dM;
    x0r = node0.x + node0.width * 0.5 + dM;
    y0t = node0.y - node0.height * 0.5 - dM;
    y0b = node0.y + node0.height * 0.5 + dM;
    for(var j = i + 1; this.nodeList[j] != null; j++) {
      node1 = this.nodeList[(j + this._i0 + i) % l];
      x1l = node1.x - node1.width * 0.5 - dM;
      x1r = node1.x + node1.width * 0.5 + dM;
      y1t = node1.y - node1.height * 0.5 - dM;
      y1b = node1.y + node1.height * 0.5 + dM;
      if(((x0l > x1l && x0l < x1r) ||  (x0r > x1l && x0r < x1r)) && ((y0t > y1t && y0t < y1b) || (y0b > y1t && y0b < y1b))) {
        vx = node1.x - node0.x;
        vy = node1.y - node0.y;

        if(Math.abs(vx) > Math.abs(vy)) {
          if(vx > 0) {
            node0.x -= (x0r - x1l) * 0.5;
            node1.x += (x0r - x1l) * 0.5;
          } else {
            node0.x += (x1r - x0l) * 0.5;
            node1.x -= (x1r - x0l) * 0.5;
          }
        } else {
          if(vy > 0) {
            node0.y -= (y0b - y1t) * 0.5;
            node1.y += (y0b - y1t) * 0.5;
          } else {
            node0.y += (y1b - y0t) * 0.5;
            node1.y -= (y1b - y0t) * 0.5;
          }
        }

        //setStroke(Math.abs(vx)>Math.abs(vy)?'blue':'red');
        //sCircle((node0.x+node1.x)*0.5, (node0.y+node1.y)*0.5, Math.max(Math.abs(vx), Math.abs(vy))*0.5);
      }
    }
  }
  this._i0++;
};

/**
 * @todo write docs
 */
Forces.prototype.avoidOverlappingRadial = function(delta, K) {
  delta = delta || 0;
  K = K || 1;
  var i;
  var node0;
  var node1;
  var l = this.nodeList.length;
  var vx;
  var vy;
  var d;
  var dMin;
  var k;
  var delta2 = delta * 2;

  for(i = 0; this.nodeList[i + 1] != null; i++) {
    node0 = this.nodeList[(i + this._i0) % l];
    for(var j = i + 1; this.nodeList[j] != null; j++) {
      node1 = this.nodeList[(j + this._i0 + i) % l];
      vx = node1.x - node0.x;
      vy = node1.y - node0.y;
      d = Math.pow(vx, 2) + Math.pow(vy, 2);
      dMin = Math.pow(node0.r + node1.r + delta2, 2);
      if(d < dMin) {
        dMin = Math.sqrt(dMin);
        d = Math.sqrt(d);
        k = 0.5 * (dMin - d) / d;
        node0.x -= K * k * vx;
        node0.y -= K * k * vy;
        node1.x += K * k * vx;
        node1.y += K * k * vy;
      }
    }
  }
  this._i0++;
};

/**
 * @todo write docs
 */
Forces.prototype.applyForces = function() {
  var node;

  for(var i = 0; this.nodeList[i] != null; i++) {
    node = this.nodeList[i];
    node.vx += node.ax;
    node.vy += node.ay;
    node.vx *= this.friction;
    node.vy *= this.friction;
    node.x += node.vx;
    node.y += node.vy;
  }
};

/**
 * @todo write docs
 */
Forces.prototype.deactivateForcesFromNode = function(node) {
  node.vx = node.vy = node.ax = node.ay = 0;
};

/**
 * @todo write docs
 */
Forces.prototype.destroy = function() {
  delete this.k;
  delete this.dEqSprings;
  delete this.dEqRepulsors;
  delete this.friction;
  this.nodeList.destroy();
  delete this.nodeList;
  this.forcesList.destroy();
  delete this.forcesList;
  this.equilibriumDistances.destroy();
  delete this.equilibriumDistances;
  this.forcesTypeList.destroy();
  delete this.forcesTypeList;
  this.fromNodeList.destroy();
  delete this.fromNodeList;
  this.toNodeList.destroy();
  delete this.toNodeList;
  delete this._i0;
};

///////////////////////////////////////////PRIVATE


/**
 * @ignore
 */
Forces.prototype._resetAccelerations = function() {
  var node;
  for(var i = 0; this.nodeList[i] != null; i++) {
    node = this.nodeList[i];
    node.ax = 0;
    node.ay = 0;
  }
};
