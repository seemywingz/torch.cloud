'use-strict';

import {Box, Vec3} from 'cannon';
import { 
  Mesh,
  BoxGeometry,
  MeshPhongMaterial
 } from 'three';
import SceneObject from './SceneObject';

export default class Cube extends SceneObject {

  constructor(level, x, y, z, texture, scale=1, mass=1){
    let material = new MeshPhongMaterial({ map: texture });
    let mesh = new Mesh(new BoxGeometry( scale, scale, scale ), material);
    super(level, x, y, z, mesh, scale, mass);
    if(this.level.physicsEnabled)
      this.initPhysics(this.scale, this.mass, new Box(new Vec3(this.scale*0.5, this.scale*0.5, this.scale*0.5)) );
  }

}