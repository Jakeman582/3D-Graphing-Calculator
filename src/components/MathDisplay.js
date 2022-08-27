import React, { Component } from 'react';
import "../styles/text.css";
import * as math from 'mathjs'
import * as Three from 'three';
import SpriteText from 'three-spritetext';
import {Collapse, Button} from 'reactstrap';
import CartesianMathForm from './CartesianMathForm';
import ParametricMathForm from './ParametricMathForm';
import NewMathForm from './NewMathForm';
import MathModeForm from './MathModeForm';
import CartesianEvalForm from './CartesianEvalForm';
import ParametricEvalForm from './ParametricEvalForm';
import NewEvalForm from './NewEvalForm';
const OrbitControls = require('three-orbit-controls')(Three);

class MathDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mode: 'cartesian',
            expression1: '',
            expression2: '',
            expression3: '',
            value1: '',
            value2: '',
            value3: '',
            clicked: false,
            mathFormShowing: false,
            evalFormShowing: false,
            mathFormWidth: "20vw",
            mathFormBackGround: "#202020",
            mathFormTextColor: "#000000"
        };

        this.changeMode = this.changeMode.bind(this);
        this.renderScene = this.renderScene.bind(this);
        this.animate = this.animate.bind(this);
        this.evaluateCartesian = this.evaluateCartesian.bind(this);
        this.evaluateParametric = this.evaluateParametric.bind(this);
        this.evaluateNew = this.evaluateNew.bind(this);
        this.populateGridVertices = this.populateGridVertices.bind(this);
        this.populateXAxisVertices = this.populateXAxisVertices.bind(this);
        this.populateYAxisVertices = this.populateYAxisVertices.bind(this);
        this.populateZAxisVertices = this.populateZAxisVertices.bind(this);
        this.renderBounds = this.renderBounds.bind(this);
        this.renderSegments = this.renderSegments.bind(this);
        this.renderMarker = this.renderMarker.bind(this);
        this.toggleMathForm = this.toggleMathForm.bind(this);
        this.toggleEvalForm = this.toggleEvalForm.bind(this);
    }

    componentDidMount() {
        // Camera constants
        const fov = 75;
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        const aspect = width / height;
        const near = 0.1;
        const far = 1000;

        // Create the scene
        this.scene = new Three.Scene();

        // Setup the camera
        this.camera = new Three.PerspectiveCamera(fov, aspect, near, far);
        this.initializeCamera();

        // Set up the renderer
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        // Initialize the controls (must be done before camera configuration)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.initializeOrbits();

        // Each item that needs to be rendered needs a mesh
        this.graphMesh = new Three.Mesh();
        this.gridMesh = new Three.LineSegments();
        this.xAxisMesh = new Three.LineSegments();
        this.yAxisMesh = new Three.LineSegments();
        this.zAxisMesh = new Three.LineSegments();
        this.xMarkerMesh = new Three.Mesh();
        this.yMarkerMesh = new Three.Mesh();
        this.zMarkerMesh = new Three.Mesh();
        this.xMaxTextMesh = new Three.Mesh();

        // The axis labels need to be rendered as sprites so they always face
        // the camera
        this.xMinText = new SpriteText();
        this.xMaxText = new SpriteText();
        this.yMinText = new SpriteText();
        this.yMaxText = new SpriteText();
        this.zMinText = new SpriteText();
        this.zMaxText = new SpriteText();

        // We need to set offsets for each label so it is easier to read on the
        // rendered scene what the bounds for each dimension are
        this.xMinOffsetX = 0.05;
        this.xMinOffsetY = -0.1;
        this.xMinOffsetZ = 0.1;
        this.xMaxOffsetX = 0;
        this.xMaxOffsetY = -0.1;
        this.xMaxOffsetZ = 0.1;
        this.yMinOffsetX = -0.1;
        this.yMinOffsetY = 0.1;
        this.yMinOffsetZ = 0.1;
        this.yMaxOffsetX = -0.1;
        this.yMaxOffsetY = 0;
        this.yMaxOffsetZ = 0.1;
        this.zMinOffsetX = 0;
        this.zMinOffsetY = 0;
        this.zMinOffsetZ = -0.1;
        this.zMaxOffsetX = 0;
        this.zMaxOffsetY = 0;
        this.zMaxOffsetZ = 0.2;

        // Figure out how much to translate each label.
        this.xMinDeltaX = 0;
        this.xMinDeltaY = 0;
        this.xMinDeltaZ = 0;
        this.xMaxDeltaX = 0;
        this.xMaxDeltaY = 0;
        this.xMaxDeltaZ = 0;
        this.yMinDeltaX = 0;
        this.yMinDeltaY = 0;
        this.yMinDeltaZ = 0;
        this.yMaxDeltaX = 0;
        this.yMaxDeltaY = 0;
        this.yMaxDeltaZ = 0;
        this.zMinDeltaX = 0;
        this.zMinDeltaY = 0;
        this.zMinDeltaZ = 0;
        this.zMaxDeltaX = 0;
        this.zMaxDeltaY = 0;
        this.zMaxDeltaZ = 0;

        // Cartesian mode graphs will use a normal material, which requires
        // that we add a double side or else the underside of the graph won't
        // be rendered
        this.cartesianMaterial = new Three.MeshNormalMaterial();
        this.cartesianMaterial.side = Three.DoubleSide;
        this.basicMaterial = new Three.MeshBasicMaterial();
        this.basicMaterial.side = Three.DoubleSide;
        this.basicMaterial.vertexColors = Three.VertexColors;

        // The parametric mode graphs will use a basic material
        this.parametricMaterial = new Three.LineBasicMaterial();
        this.parametricMaterial.vertexColors = Three.VertexColors;

        // Grid materials will define how the grid system looks
        this.gridMaterial = new Three.LineBasicMaterial({color: 0xAAAAAA});
        this.xAxisMaterial = new Three.LineBasicMaterial({color: 0x0000FF});
        this.yAxisMaterial = new Three.LineBasicMaterial({color: 0x00FF00});
        this.zAxisMaterial = new Three.LineBasicMaterial({color: 0xFF0000});
        this.xMarkerMaterial = new Three.MeshBasicMaterial({color: 0x0000FF});
        this.yMarkerMaterial = new Three.MeshBasicMaterial({color: 0x00FF00});
        this.zMarkerMaterial = new Three.MeshBasicMaterial({color: 0xFF0000});

        // We need to keep track of the dimensional boundary points so we can
        // draw and label the boundaries for the graph
        this.xMin = 0;
        this.xMax = 0;
        this.yMin = 0;
        this.yMax = 0;
        this.minZ = 0;
        this.maxZ = 0;

        // We need to define measurements for the axis markers so they look
        // uniform
        this.markerRadius = 0.03;
        this.markerHeight = 0.1;
        this.markerRadialSegments = 32;

    }

    changeMode(newMode) {
        this.setState({mode: newMode});
    }

    toggleMathForm() {
        this.setState({mathFormShowing: !this.state.mathFormShowing});
    }

    toggleEvalForm() {
        this.setState({evalFormShowing: !this.state.evalFormShowing});
    }

    evaluateCartesian(scope) {
        this.setState({value1: math.eval(this.state.expression1, scope)});
    }

    evaluateParametric(scope) {
        this.setState({
            value1: math.eval(this.state.expression1, scope),
            value2: math.eval(this.state.expression2, scope),
            value3: math.eval(this.state.expression3, scope)
        });
    }

    evaluateNew(scope) {
        this.setState({
            value1: math.eval(this.state.expression1, scope),
            value2: math.eval(this.state.expression2, scope),
            value3: math.eval(this.state.expression3, scope)
        });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild(this.renderer.domElement);
    }

    initializeCamera() {
        this.camera.position.set(-3, -6, 0.5);
        this.camera.up = new Three.Vector3(0, 0, 1);
        this.camera.lookAt(new Three.Vector3(0, 0, 0));
    }

    resetCamera() {
        this.camera.position.set(-3, -6, 0.5);
        this.camera.lookAt(new Three.Vector3(0, 0, 0));
    }

    initializeOrbits() {
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
    }

    animate() {
        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    populateCartesianVertices(graphInfo) {
        // Get expression and dimensions from the given graph information
        const expression = graphInfo.expression;
        this.setState({expression1: expression});

        this.xMin = graphInfo.xMin;
        this.xMax = graphInfo.xMax;
        this.deltaX = graphInfo.deltaX;
        this.yMin = graphInfo.yMin;
        this.yMax = graphInfo.yMax;
        this.deltaY = graphInfo.deltaY;

        this.zMin = math.eval(expression, {x: this.xMin, y: this.yMin});
        this.zMax = math.eval(expression, {x: this.xMin, y: this.yMin});

        // We need to know how mabny vertices there per triangle, and how many
        // values there are per vertex in order to calculate how much space to
        // allocate in the vertices buffer.
        const valuesPerVertex = 3;
        const verticesPerTriangle = 3;
        const trianglesPerSquare = 2;
        let valuesPerSquare =
            valuesPerVertex *
            verticesPerTriangle *
            trianglesPerSquare;

        // We need to know how many rows and columns of vertices are needed in
        // order to populate the vertices array in a loop.
        let columns = (this.xMax - this.xMin) / this.deltaX;
        let rows = (this.yMax - this.yMin) / this.deltaY;

        // We need to know how many vertices are in the specified mesh so we
        // can allocate space in the vertices buffer.
        let numberOfData = valuesPerSquare * columns * rows;
        let vertices = new Float32Array(numberOfData);

        // Compilation reduces the need to re-parse the expression on every
        // iteration
        let node = math.parse(expression);
        let code = node.compile();

        // Each triangle needs to be constructed in a counter-clockwise
        // fashion.
        for(let row = 0; row < rows; row++) {
            for(let column = 0; column < columns; column++) {
                let currentSquare = valuesPerSquare * (columns * row + column);
                let xLeft = this.xMin + column * this.deltaX;
                let xRight = xLeft + this.deltaX;
                let yTop = this.yMax - row * this.deltaY;
                let yBottom = yTop - this.deltaY;
                let zLeftBottom = code.eval({x: xLeft, y: yBottom});
                let zRightBottom = code.eval({x: xRight, y: yBottom});
                let zLeftTop = code.eval({x: xLeft, y: yTop});
                let zRightTop = code.eval({x: xRight, y: yTop});

                // Look for the smallest z value
                if(this.zMin > zLeftBottom) {
                    this.zMin = zLeftBottom;
                }
                if(this.zMin > zRightBottom) {
                    this.zMin = zRightBottom;
                }
                if(this.zMin > zLeftTop) {
                    this.zMin = zLeftTop;
                }
                if(this.zMin > zRightTop) {
                    this.zMin = zRightTop;
                }

                // Look for the largest z value
                if(this.zMax < zLeftBottom) {
                    this.zMax = zLeftBottom;
                }
                if(this.zMax < zRightBottom) {
                    this.zMax = zRightBottom;
                }
                if(this.zMax < zLeftTop) {
                    this.zMax = zLeftTop;
                }
                if(this.zMax < zRightTop) {
                    this.zMax = zRightTop;
                }

                // Triangle 1 vertices
                vertices[currentSquare +  0] = xLeft;
                vertices[currentSquare +  1] = yBottom;
                vertices[currentSquare +  2] = zLeftBottom
                vertices[currentSquare +  3] = xRight;
                vertices[currentSquare +  4] = yBottom;
                vertices[currentSquare +  5] = zRightBottom
                vertices[currentSquare +  6] = xLeft;
                vertices[currentSquare +  7] = yTop;
                vertices[currentSquare +  8] = zLeftTop;

                // Triangle 2 vertices
                vertices[currentSquare +  9] = xLeft;
                vertices[currentSquare + 10] = yTop;
                vertices[currentSquare + 11] = zLeftTop;
                vertices[currentSquare + 12] = xRight;
                vertices[currentSquare + 13] = yBottom;
                vertices[currentSquare + 14] = zRightBottom;
                vertices[currentSquare + 15] = xRight;
                vertices[currentSquare + 16] = yTop;
                vertices[currentSquare + 17] = zRightTop;
            }
        }

        return vertices;
    }

    colorByHeight(vertices) {
        let colors = [];
        let length = vertices.length;
        let range = this.zMax - this.zMin
        for(let index = 2; index < length; index += 3) {
            let z = vertices[index];
            let h = (this.zMax - z) / range;
            let color = new Three.Color(0x0000FF);
            color.setHSL(0.7 * h, 1.0, 0.5);
            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);
        }
        return new Float32Array(colors);
    }

    populateParametricVertices(graphInfo) {
        const tStart = graphInfo.tStart;
        const tEnd = graphInfo.tEnd;
        const tStep = graphInfo.tStep;
        const expressionX = graphInfo.expressionX;
        const expressionY = graphInfo.expressionY;
        const expressionZ = graphInfo.expressionZ;
        this.setState({
            expression1: expressionX,
            expression2: expressionY,
            expression3: expressionZ
        });

        // Compiling the expressions prevents the need to re-parse on every
        // loop iteration.
        let nodeX = math.parse(expressionX);
        let nodeY = math.parse(expressionY);
        let nodeZ = math.parse(expressionZ);
        let codeX = nodeX.compile();
        let codeY = nodeY.compile();
        let codeZ = nodeZ.compile();

        // Initialize values for xMin, xMax, yMin, yMax, zMin, and zMax so the
        // boundaries for the 0-plane grid can be calulated
        this.xMin = codeX.eval({t: tStart});
        this.xMax = codeX.eval({t: tStart});
        this.yMin = codeY.eval({t: tStart});
        this.yMax = codeY.eval({t: tStart});
        this.zMin = codeZ.eval({t: tStart});
        this.zMax = codeZ.eval({t: tStart});

        let vertexBuffer = [];
        for(let s = tStart; s <= tEnd; s += tStep) {
            let x = codeX.eval({t: s});
            let y = codeY.eval({t: s});
            let z = codeZ.eval({t: s});

            // Look for the next minimums and maximums
            if(this.xMin > x) {
                this.xMin = x;
            }
            if(this.xMax < x) {
                this.xMax = x;
            }

            if(this.yMin > y) {
                this.yMin = y;
            }
            if(this.yMax < y) {
                this.yMax = y;
            }

            if(this.zMin > z) {
                this.zMin = z;
            }
            if(this.zMax < z) {
                this.zMax = z;
            }

            vertexBuffer.push(x);
            vertexBuffer.push(y);
            vertexBuffer.push(z);
        }

        this.deltaX = (this.xMax - this.xMin) / 10.0;
        this.deltaY = (this.yMax - this.yMin) / 10.0;

        return new Float32Array(vertexBuffer);

    }

    populateNewVertices(graphInfo) {
        const uStart = graphInfo.uStart;
        const uEnd = graphInfo.uEnd;
        const uStep = graphInfo.uStep;
        const vStart = graphInfo.vStart;
        const vEnd = graphInfo.vEnd;
        const vStep = graphInfo.vStep;
        const expressionX = graphInfo.expressionX;
        const expressionY = graphInfo.expressionY;
        const expressionZ = graphInfo.expressionZ;
        this.setState({
            expression1: expressionX,
            expression2: expressionY,
            expression3: expressionZ
        });

        let nodeX = math.parse(expressionX);
        let nodeY = math.parse(expressionY);
        let nodeZ = math.parse(expressionZ);
        let codeX = nodeX.compile();
        let codeY = nodeY.compile();
        let codeZ = nodeZ.compile();

        this.xMin = codeX.eval({u: uStart, v: vStart});
        this.xMax = codeX.eval({u: uStart, v: vStart});
        this.yMin = codeY.eval({u: uStart, v: vStart});
        this.yMax = codeY.eval({u: uStart, v: vStart});
        this.zMin = codeZ.eval({u: uStart, v: vStart});
        this.zMax = codeZ.eval({u: uStart, v: vStart});

        let columns = (uEnd - uStart) / uStep;
        let rows = (vEnd - vStart) / vStep;
        let vertexBuffer = [];
        for(let row = 0; row < rows; row++) {
            for(let column = 0; column < columns; column++) {
                let u0 = uStart + (column * uStep);
                let u1 = u0 + uStep;
                let v0 = vStart + (row * vStep);
                let v1 = v0 + vStep;
                let xU0V0 = codeX.eval({u: u0, v: v0});
                let yU0V0 = codeY.eval({u: u0, v: v0});
                let zU0V0 = codeZ.eval({u: u0, v: v0});
                let xU1V0 = codeX.eval({u: u1, v: v0});
                let yU1V0 = codeY.eval({u: u1, v: v0});
                let zU1V0 = codeZ.eval({u: u1, v: v0});
                let xU0V1 = codeX.eval({u: u0, v: v1});
                let yU0V1 = codeY.eval({u: u0, v: v1});
                let zU0V1 = codeZ.eval({u: u0, v: v1});
                let xU1V1 = codeX.eval({u: u1, v: v1});
                let yU1V1 = codeY.eval({u: u1, v: v1});
                let zU1V1 = codeZ.eval({u: u1, v: v1});

                // Look for the largest and smallest x values
                if(xU0V0 < this.xMin) {
                    this.xMin = xU0V0;
                }
                if(xU1V0 < this.xMin) {
                    this.xMin = xU1V0;
                }
                if(xU0V1 < this.xMin) {
                    this.xMin = xU0V1;
                }
                if(xU1V1 < this.xMin) {
                    this.xMin = xU1V1;
                }
                if(xU0V0 > this.xMax) {
                    this.xMax = xU0V0;
                }
                if(xU1V0 > this.xMax) {
                    this.xMax = xU1V0;
                }
                if(xU0V1 > this.xMax) {
                    this.xMax = xU0V1;
                }
                if(xU1V1 > this.xMax) {
                    this.xMax = xU1V1;
                }

                // Look for the largest and smallest y values
                if(yU0V0 < this.yMin) {
                    this.yMin = yU0V0;
                }
                if(yU1V0 < this.yMin) {
                    this.xMin = xU1V0;
                }
                if(yU0V1 < this.yMin) {
                    this.yMin = yU0V1;
                }
                if(yU1V1 < this.yMin) {
                    this.yMin = yU1V1;
                }
                if(yU0V0 > this.yMax) {
                    this.yMax = yU0V0;
                }
                if(yU1V0 > this.yMax) {
                    this.xMax = xU1V0;
                }
                if(yU0V1 > this.yMax) {
                    this.yMax = yU0V1;
                }
                if(yU1V1 > this.yMax) {
                    this.yMax = yU1V1;
                }

                // Look for the largest and smallest z values
                if(zU0V0 < this.zMin) {
                    this.zMin = zU0V0;
                }
                if(zU1V0 < this.zMin) {
                    this.zMin = zU1V0;
                }
                if(zU0V1 < this.zMin) {
                    this.zMin = zU0V1;
                }
                if(zU1V1 < this.zMin) {
                    this.zMin = zU1V1;
                }
                if(zU0V0 > this.zMax) {
                    this.zMax = zU0V0;
                }
                if(zU1V0 > this.zMax) {
                    this.zMax = zU1V0;
                }
                if(zU0V1 > this.zMax) {
                    this.zMax = zU0V1;
                }
                if(zU1V1 > this.zMax) {
                    this.zMax = zU1V1;
                }

                vertexBuffer.push(xU0V0, yU0V0, zU0V0);
                vertexBuffer.push(xU0V1, yU0V1, zU0V1);
                vertexBuffer.push(xU1V1, yU1V1, zU1V1);

                vertexBuffer.push(xU0V0, yU0V0, zU0V0);
                vertexBuffer.push(xU1V1, yU1V1, zU1V1);
                vertexBuffer.push(xU1V0, yU1V0, zU1V0);
            }
        }

        this.deltaX = (this.xMax - this.xMin) / 10.0;
        this.deltaY = (this.yMax - this.yMin) / 10.0;

        return new Float32Array(vertexBuffer);
    }

    populateGridVertices() {

        let vertexBuffer = [];
        for(let x = this.xMin; x <= this.xMax; x += this.deltaX) {
            vertexBuffer.push(x);
            vertexBuffer.push(this.yMin);
            vertexBuffer.push(0);
            vertexBuffer.push(x);
            vertexBuffer.push(this.yMax);
            vertexBuffer.push(0);
        }
        for(let y = this.yMin; y <= this.yMax; y += this.deltaY) {
            vertexBuffer.push(this.xMin);
            vertexBuffer.push(y);
            vertexBuffer.push(0);
            vertexBuffer.push(this.xMax);
            vertexBuffer.push(y);
            vertexBuffer.push(0);
        }
        return new Float32Array(vertexBuffer);
    }

    populateXAxisVertices() {
        let vertexBuffer = [];
        vertexBuffer.push(this.xMin);
        vertexBuffer.push(this.yMin);
        vertexBuffer.push(this.zMin);
        vertexBuffer.push(this.xMax);
        vertexBuffer.push(this.yMin);
        vertexBuffer.push(this.zMin);

        return new Float32Array(vertexBuffer);
    }

    populateYAxisVertices() {
        let vertexBuffer = [];
        vertexBuffer.push(this.xMin);
        vertexBuffer.push(this.yMin);
        vertexBuffer.push(this.zMin);
        vertexBuffer.push(this.xMin);
        vertexBuffer.push(this.yMax);
        vertexBuffer.push(this.zMin);

        return new Float32Array(vertexBuffer);
    }

    populateZAxisVertices() {
        let vertexBuffer = [];
        vertexBuffer.push(this.xMin);
        vertexBuffer.push(this.yMin);
        vertexBuffer.push(this.zMin);
        vertexBuffer.push(this.xMin);
        vertexBuffer.push(this.yMin);
        vertexBuffer.push(this.zMax);

        return new Float32Array(vertexBuffer);
    }

    renderMarker(material, xTranslate, yTranslate, zTranslate, xAngle, yAngle, zAngle) {
        let marker = new Three.ConeBufferGeometry(this.markerRadius, this.markerHeight, this.markerRadialSegments);
        marker.rotateX(xAngle);
        marker.rotateY(yAngle);
        marker.rotateZ(zAngle);
        marker.translate(xTranslate, yTranslate, zTranslate);
        return new Three.Mesh(marker, material);
    }

    renderSegments(material, populate) {
        let segments = new Three.BufferGeometry();
        segments.addAttribute('position', new Three.BufferAttribute(populate(), 3));
        return new Three.LineSegments(segments, material);
    }

    renderLabel(sprite, text, color, textHeight, translateX, translateY, translateZ) {
        sprite.text = '' + text;
        sprite.color = color;
        sprite.textHeight = textHeight;
        sprite.translateX(translateX);
        sprite.translateY(translateY);
        sprite.translateZ(translateZ);
        this.scene.add(sprite);
    }

    renderBounds() {

        // Calculate translation displacements for the labels
        this.xMinDeltaX = this.xMin + this.xMinOffsetX;
        this.xMinDeltaY = this.yMin + this.xMinOffsetY;
        this.xMinDeltaZ = this.zMin + this.xMinOffsetZ;
        this.xMaxDeltaX = this.xMax + this.xMaxOffsetX;
        this.xMaxDeltaY = this.yMin + this.xMaxOffsetY;
        this.xMaxDeltaZ = this.zMin + this.xMaxOffsetZ;
        this.yMinDeltaX = this.xMin + this.yMinOffsetX;
        this.yMinDeltaY = this.yMin + this.yMinOffsetY;
        this.yMinDeltaZ = this.zMin + this.yMinOffsetZ;
        this.yMaxDeltaX = this.xMin + this.yMaxOffsetX;
        this.yMaxDeltaY = this.xMax + this.yMaxOffsetY;
        this.yMaxDeltaZ = this.zMin + this.yMaxOffsetZ;
        this.zMinDeltaX = this.xMin + this.zMinOffsetX;
        this.zMinDeltaY = this.yMin + this.zMinOffsetY;
        this.zMinDeltaZ = this.zMin + this.zMinOffsetZ;
        this.zMaxDeltaX = this.xMin + this.zMaxOffsetX;
        this.zMaxDeltaY = this.yMin + this.zMaxOffsetY;
        this.zMaxDeltaZ = this.zMax + this.zMaxOffsetZ;

        this.scene.add(this.gridMesh = this.renderSegments(this.gridMaterial, this.populateGridVertices));
        this.scene.add(this.xAxisMesh = this.renderSegments(this.xAxisMaterial, this.populateXAxisVertices));
        this.scene.add(this.yAxisMesh = this.renderSegments(this.yAxisMaterial, this.populateYAxisVertices));
        this.scene.add(this.zAxisMesh = this.renderSegments(this.zAxisMaterial, this.populateZAxisVertices));

        this.scene.add(this.xMarkerMesh = this.renderMarker(this.xMarkerMaterial, this.xMax + (0.5 * this.markerHeight), this.yMin, this.zMin, 0, 0, 3.0 * math.PI / 2.0));
        this.scene.add(this.yMarkerMesh = this.renderMarker(this.yMarkerMaterial, this.xMin, this.yMax + (0.5 * this.markerHeight), this.zMin, 0, 0, 0));
        this.scene.add(this.zMarkerMesh = this.renderMarker(this.zMarkerMaterial, this.xMin, this.yMin, this.zMax + (0.5 * this.markerHeight), math.PI / 2.0, 0, 0));

        this.renderLabel(this.xMinText, this.xMin.toFixed(2), 'blue', 0.1, this.xMinDeltaX, this.xMinDeltaY, this.xMinDeltaZ);
        this.renderLabel(this.xMaxText, this.xMax.toFixed(2), 'blue', 0.1, this.xMaxDeltaX, this.xMaxDeltaY, this.xMaxDeltaZ);

        this.renderLabel(this.yMinText, this.yMin.toFixed(2), 'green', 0.1, this.yMinDeltaX, this.yMinDeltaY, this.yMinDeltaZ);
        this.renderLabel(this.yMaxText, this.yMax.toFixed(2), 'green', 0.1, this.yMaxDeltaX, this.yMaxDeltaY, this.yMaxDeltaZ);

        this.renderLabel(this.zMinText, this.zMin.toFixed(2), 'red', 0.1, this.zMinDeltaX, this.zMinDeltaY, this.zMinDeltaZ);
        this.renderLabel(this.zMaxText, this.zMax.toFixed(2), 'red', 0.1, this.zMaxDeltaX, this.zMaxDeltaY, this.zMaxDeltaZ);
    }

    renderCartesianGraph(graphInfo) {
        let graph = new Three.BufferGeometry();
        let vertices = this.populateCartesianVertices(graphInfo);
        let colors = this.colorByHeight(vertices);
        graph.addAttribute('position', new Three.BufferAttribute(vertices, 3));
        graph.addAttribute('color', new Three.BufferAttribute(colors, 3));
        this.graphMesh = new Three.Mesh(graph, this.basicMaterial);
        this.scene.add(this.graphMesh);
    }

    renderParametricGraph(graphInfo) {
        let graph = new Three.BufferGeometry();
        let vertices = this.populateParametricVertices(graphInfo);
        let colors = this.colorByHeight(vertices);
        graph.addAttribute('position', new Three.BufferAttribute(vertices, 3));
        graph.addAttribute('color', new Three.BufferAttribute(colors, 3));
        this.graphMesh = new Three.Line(graph, this.parametricMaterial);
        this.scene.add(this.graphMesh);
    }

    renderNewGraph(graphInfo) {
        let graph = new Three.BufferGeometry();
        let vertices = this.populateNewVertices(graphInfo);
        let colors = this.colorByHeight(vertices);
        graph.addAttribute('position', new Three.BufferAttribute(vertices, 3));
        graph.addAttribute('color', new Three.BufferAttribute(colors, 3));
        this.graphMesh = new Three.Mesh(graph, this.basicMaterial);
        this.scene.add(this.graphMesh);
    }

    destroyScene() {
        this.scene.remove(this.graphMesh);
        this.scene.remove(this.gridMesh);
        this.scene.remove(this.xAxisMesh);
        this.scene.remove(this.yAxisMesh);
        this.scene.remove(this.zAxisMesh);
        this.scene.remove(this.xMarkerMesh);
        this.scene.remove(this.yMarkerMesh);
        this.scene.remove(this.zMarkerMesh);
        this.scene.remove(this.xMinText);
        this.scene.remove(this.xMaxText);
        this.scene.remove(this.yMinText);
        this.scene.remove(this.yMaxText);
        this.scene.remove(this.zMinText);
        this.scene.remove(this.zMaxText);
        this.graphMesh.geometry.dispose();
        this.gridMesh.geometry.dispose();
        this.xAxisMesh.geometry.dispose();
        this.yAxisMesh.geometry.dispose();
        this.zAxisMesh.geometry.dispose();
        this.xMarkerMesh.geometry.dispose();
        this.yMarkerMesh.geometry.dispose();
        this.zMarkerMesh.geometry.dispose();
        this.xMinText.translateX(-this.xMinDeltaX);
        this.xMinText.translateY(-this.xMinDeltaY);
        this.xMinText.translateZ(-this.xMinDeltaZ);
        this.xMaxText.translateX(-this.xMaxDeltaX);
        this.xMaxText.translateY(-this.xMaxDeltaY);
        this.xMaxText.translateZ(-this.xMaxDeltaZ);
        this.yMinText.translateX(-this.yMinDeltaX);
        this.yMinText.translateY(-this.yMinDeltaY);
        this.yMinText.translateZ(-this.yMinDeltaZ);
        this.yMaxText.translateX(-this.yMaxDeltaX);
        this.yMaxText.translateY(-this.yMaxDeltaY);
        this.yMaxText.translateZ(-this.yMaxDeltaZ);
        this.zMinText.translateX(-this.zMinDeltaX);
        this.zMinText.translateY(-this.zMinDeltaY);
        this.zMinText.translateZ(-this.zMinDeltaZ);
        this.zMaxText.translateX(-this.zMaxDeltaX);
        this.zMaxText.translateY(-this.zMaxDeltaY);
        this.zMaxText.translateZ(-this.zMaxDeltaZ);
    }

    renderScene(graphInfo) {
        //this.setState({clicked: true});
        if(this.state.clicked) {
            this.destroyScene();
        }
        this.setState({clicked: true});
        if(this.state.mode === 'cartesian') {
            this.renderCartesianGraph(graphInfo);
        } else if(this.state.mode === 'parametric') {
            this.renderParametricGraph(graphInfo);
        } else {
            this.renderNewGraph(graphInfo);
        }
        this.renderBounds();
        this.initializeCamera();
        this.animate();
    }

    render() {
        if(this.state.mode === 'cartesian') {
            return (
                <div>
                    <div className="m-auto" id="boardCanvas" style={{width: "100vw", height: "100vh", overflow: "hidden", position: "absolute"}} ref={mount => {this.mount = mount;}} />
                    <div style={{width: this.state.mathFormWidth}}>
                        <Button className="mb-2" onClick={this.toggleMathForm} style={{position: "relative", width: "100%"}}>Graph Specs</Button>
                        <Collapse isOpen={this.state.mathFormShowing} style={{position: "absolute"}}>
                            <MathModeForm onSubmit={this.changeMode} mode="cartesian" />
                            <CartesianMathForm onSubmit={this.renderScene} />
                        </Collapse>
                    </div>
                    <div style={{width: this.state.mathFormWidth, position: "absolute", right: "0", top: "0"}}>
                        <Button className="mb-2" onClick={this.toggleEvalForm} style={{position: "relative", width: "100%"}}>Eval Form</Button>
                        <Collapse isOpen={this.state.evalFormShowing} style={{position: "absolute"}}>
                            <p style={{color: "#FFFFFF"}} >{this.state.value1 + ""}</p>
                            <CartesianEvalForm onSubmit={this.evaluateCartesian} />
                        </Collapse>
                    </div>
                </div>
            );
        } else if(this.state.mode === 'parametric') {
            return (
                <div>
                    <div className="m-auto" id="boardCanvas" style={{width: "100vw", height: "100vh", overflow: "hidden", position: "absolute"}} ref={mount => {this.mount = mount;}} />
                    <div style={{width: this.state.mathFormWidth}}>
                        <Button className="mb-2" onClick={this.toggleMathForm} style={{position: "relative", width: "100%"}}>Graph Specs</Button>
                        <Collapse isOpen={this.state.mathFormShowing} style={{position: "relative"}}>
                            <MathModeForm onSubmit={this.changeMode} mode="parametric" />
                            <ParametricMathForm onSubmit={this.renderScene} />
                        </Collapse>
                    </div>
                    <div style={{width: this.state.mathFormWidth, position: "absolute", right: "0", top: "0"}}>
                        <Button className="mb-2" onClick={this.toggleEvalForm} style={{position: "relative", width: "100%"}}>Eval Form</Button>
                        <Collapse isOpen={this.state.evalFormShowing} style={{position: "relative"}}>
                            <p style={{color: "#FFFFFF"}}>{this.state.value1 + ", " + this.state.value2 + ", " + this.state.value3}</p>
                            <ParametricEvalForm onSubmit={this.evaluateParametric} />
                        </Collapse>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="m-auto" id="boardCanvas" style={{width: "100vw", height: "100vh", overflow: "hidden", position: "absolute"}} ref={mount => {this.mount = mount;}} />
                    <div style={{width: this.state.mathFormWidth}}>
                        <Button className="mb-2" onClick={this.toggleMathForm} style={{position: "relative", width: "100%"}}>Graph Specs</Button>
                        <Collapse isOpen={this.state.mathFormShowing} style={{position: "relative"}}>
                            <MathModeForm onSubmit={this.changeMode} mode="new" />
                            <NewMathForm onSubmit={this.renderScene} />
                        </Collapse>
                    </div>
                    <div style={{width: this.state.mathFormWidth, position: "absolute", right: "0", top: "0"}}>
                        <Button className="mb-2" onClick={this.toggleEvalForm} style={{position: "relative", width: "100%"}}>Eval Form</Button>
                        <Collapse isOpen={this.state.evalFormShowing} style={{position: "relative"}}>
                            <p style={{color: "#FFFFFF"}}>{this.state.value1 + ", " + this.state.value2 + ", " + this.state.value3}</p>
                            <NewEvalForm onSubmit={this.evaluateNew} />
                        </Collapse>
                    </div>
                </div>
            );
        }
    }
}

export default MathDisplay
