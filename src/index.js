'use-strict';

import * as tb from '3base';
import Boxes from './Boxes';
import Scene2 from './Scene2';

let manager = new tb.Manager({canvas: myCanvas, antialias: true});
manager.loadScene(Boxes);
