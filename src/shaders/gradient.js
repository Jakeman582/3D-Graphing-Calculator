export function vertexShader() {
    return `
        varying vec3 vColor;
        void main() {
            vColor = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
}

export function fragmentShader() {
    return `
    varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;
}
