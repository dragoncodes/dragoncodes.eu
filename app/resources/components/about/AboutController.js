import * as PIXI from 'pixi.js';
import { constants } from '../../../constants/AppConstants.js';
import AnimationStore from '../../../stores/AnimationStore.js'
import React from 'react';

function CustomFilter (fragmentSource, vertexSource, uniforms) {

    PIXI.Filter.call(this,
        // vertex shader
        vertexSource,
        // fragment shader
        fragmentSource,

        {
            filterArea: {
                type: '4fv',
                value: new Float32Array([ 0, 0, 0, 0 ])
            },

            pixelSize: {
                type: 'f',
                value: 6
            },

            mousePos: {
                type: '2v',
                value: new Float32Array([ 0, 0 ])
            },

            textureDimens: {
                type: '2v',
                value: new Float32Array([ 0, 0 ])
            },

            coverTexture: {
                type: 'sampler2D', value: PIXI.Texture.fromImage('/assets/images/batman.jpg')
            }

        }
    );
}

CustomFilter.prototype = Object.create(PIXI.Filter.prototype);
CustomFilter.prototype.constructor = CustomFilter;

class AboutController extends React.Component {
    constructor () {
        super();
    }

    initPixi () {
        let width = 500, height = 500;

        this.pixiRenderer = PIXI.autoDetectRenderer(width, height, { backgroundColor: 0xffffff });

        this.stage = new PIXI.Container();

        let me = PIXI.Sprite.fromImage('https://s3.eu-central-1.amazonaws.com/dragoncodes/images/me.jpg');
        me.width = width;
        me.height = height;

        me.position.x = 0;
        me.position.y = 0;

        me.filters = [ this.createFilter() ];

        this.stage.addChild(me);

        var canvasView = $(this.pixiRenderer.view);

        canvasView.css('width', '17em');

        canvasView.on('mouseover', ()=> {
            this.mouseIn = true;
        });

        canvasView.on('mouseleave', ()=> {
            this.mouseIn = false;
        });

        canvasView.on('mousemove', (e)=> {
            const rect = this.pixiRenderer.view.getBoundingClientRect();
            var x = e.clientX - rect.left, y = e.clientY - rect.top;

            this.filter.uniforms.mousePos = new Float32Array([ x, y ]);
        });

        //canvasView.on('touchstart', () => {
        //  this.mouseIn = true;
        //});
        //
        canvasView.on('touchend', () => {
            this.mouseIn = false;
        });

        canvasView.on('touchmove', (touchEvent)=> {

            this.mouseIn = true;
            const rect = this.pixiRenderer.view.getBoundingClientRect();
            var touch = touchEvent.originalEvent.touches[ 0 ];

            var x = touch.pageX - rect.left, y = touch.pageY - rect.top;
            this.filter.uniforms.mousePos = new Float32Array([ x, y ]);
        });

        this.diretionX = 0;
        this.directionY = 0;
        this.filter.uniforms.pixelSize = 13;

        this.filter.uniforms.textureDimens = new Float32Array([ width, height ]);
        this.filter.uniforms.mousePos = new Float32Array([ width / 4, height / 4 ]);

        $('.me-holder')[ 0 ].appendChild(this.pixiRenderer.view);
    }

    componentDidMount () {
        this.initPixi();

        this.diretionX = 1;
        this.directionY = 1;

        this.binding = this.animate.bind(this);
        AnimationStore.addChangeListener(this.binding);
    }

    componentWillUnmount () {
        AnimationStore.removeListener(constants.ANIMATE, this.binding);
    }

    render () {

        const years = (new Date()).getFullYear() - 1995;

        return (
            <section className="about-container">
                <div className='me-holder'></div>
                <div className="about-info">
                    I am a {years} years old, goofy yet analytical, FullStack from Bulgaria - The Land Of&thinsp;
                    <a target='_blank' className='clear-anchor' href='https://en.wikipedia.org/wiki/Banitsa'>
                        Banitsa</a>
                </div>

                <div className="about-info">
                    I am very skilled at making things ... IoT, Mobile, Desktop, Web whatever, if it's interesting - I
                    am interested.
                </div>

                <div className="about-info">
                    I have a passion for games and the rising&thinsp;
                    <a className='clear-anchor' href='https://en.wikipedia.org/wiki/Gamification' target='_blank'>gamification</a> subject
                </div>
            </section>
        );
    }

    onCreate () {

        //super.onCreate();
        //
        //this.diretionX = 1;
        //this.directionY = 1;
        //
        //this.binding = this.animate.bind(this);
        //AnimationStore.addChangeListener(this.binding);
    }

    onDestroy () {
        //super.onDestroy();
        //AnimationStore.removeListener(constants.ANIMATE, this.binding);
    }

    createFilter () {
        this.filter = new CustomFilter(`
      varying vec2 vTextureCoord;

      uniform vec4 filterArea;
      uniform vec2 mousePos;
      uniform vec2 textureDimens;
      uniform float pixelSize;
      uniform sampler2D uSampler;
      uniform sampler2D coverTexture;

      vec2 mapCoord( vec2 coord )
      {
          coord *= filterArea.xy;
          coord += filterArea.zw;

          return coord;
      }

      vec2 unmapCoord( vec2 coord )
      {
          coord -= filterArea.zw;
          coord /= filterArea.xy;

          return coord;
      }

      vec2 pixelate(vec2 coord, vec2 size)
      {
          return floor( coord / size ) * size;
      }

      vec2 getMod(vec2 coord, vec2 size)
      {
          return mod( coord , size) / size;
      }

      float character(float n, vec2 p)
      {
          p = floor(p*vec2(4.0, -4.0) + 2.5);
          if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)
          {
              if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;
          }
          return 0.06;
      }

      void main()
      {

        float radius = 0.2;
        float mouseX = ( mousePos.x / textureDimens.x ) / textureDimens.x * 1000.0;
        float mouseY = ( mousePos.y / textureDimens.y ) / textureDimens.y * 1000.0;

        float xDelta = (vTextureCoord.x - mouseX);
        float yDelta = (vTextureCoord.y - mouseY);

        bool isIn = (xDelta * xDelta) + ( yDelta * yDelta ) < (radius * radius);

        if(isIn){
          //gl_FragColor = vec4(1., .3, .3, 1.);
          gl_FragColor = texture2D(coverTexture, vTextureCoord);
          gl_FragColor *= texture2D(uSampler, vTextureCoord);
return;
          vec2 coord = mapCoord(vTextureCoord);

          // get the rounded color..
           vec2 pixCoord = pixelate(coord, vec2(pixelSize));
          pixCoord = unmapCoord(pixCoord);

          vec4 color = texture2D(uSampler, /*pixCoord*/ vTextureCoord );

          // determine the character to use
          float gray = (color.r + color.g + color.b) / 3.0;

          float n = 13199452.0; // 65536.0;             // .
          if (gray > 0.2) n = 23385164.0;// 65600.0;    // :
          if (gray > 0.3) n = 332772.0;   // *
          if (gray > 0.4) n = 15255086.0; // o
          if (gray > 0.5) n = 23385164.0; // &
          if (gray > 0.6) n = 15252014.0; // 8
          if (gray > 0.7) n = 13199452.0; // @
          if (gray > 0.8) n = 11512810.0; // #

          // get the mod..
          vec2 modd = getMod(coord, vec2(pixelSize));

          //vec2 modd = getMod(coord, vec2(8.0));

          //gl_FragColor = texture2D(uSampler, vTextureCoord);
          gl_FragColor = color * character( n, vec2(-1.) + modd * 2.);

        } else {
          gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
      }
    `,
            null
        );

        return this.filter;
    }

    animate () {

        if (!this.mouseIn) {
            let mousePos = this.filter.uniforms.mousePos;
            if (mousePos[ 0 ] !== NaN) {
                let x = mousePos[ 0 ];
                let y = mousePos[ 1 ];

                if (mousePos[ 0 ] >= 200) {
                    this.diretionX = -1;
                } else if (mousePos[ 0 ] <= 50) {
                    this.diretionX = 1;
                }

                x += 1. * this.diretionX;

                if (y >= 200) {
                    this.directionY = -1;
                } else if (y <= 50) {
                    this.directionY = 1;
                }

                y += 1. * this.directionY;

                this.filter.uniforms.mousePos = new Float32Array([ x, y ]);
            }
        }

        this.pixiRenderer.render(this.stage);
    }

}

export default  AboutController;
