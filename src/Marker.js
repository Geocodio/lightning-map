import { defaultMarkerOptions } from './defaultOptions';

export default class Marker {
  constructor(coords, options = {}, meta = {}) {
    this._coords = coords;
    this._options = Object.assign({}, defaultMarkerOptions, options);
    this._meta = meta;
  }

  get coords() {
    return this._coords;
  }

  get options() {
    return this._options;
  }

  get meta() {
    return this._meta;
  }

  get size() {
    switch (this.options.type) {
      case 'marker':
        return [
          17.698069,
          24.786272
        ];

      case 'circle': {
        const strokeMargin = this.options.enableStroke
          ? this.options.lineWidth
          : 0;

        return [10 + strokeMargin, 10 + strokeMargin];
      }

      case 'donut':
        return [14, 14];

      case 'image':
        return this.options.image
          ? [this.options.image.width, this.options.image.height]
          : null;

      default:
        return null;
    }
  }

  get offset() {
    switch (this.options.type) {
      case 'marker':
        return [
          0,
          -(this.size[1] / 2)
        ];

      case 'image':
        return this.options.offset || [0, 0];

      default:
        return [0, 0];
    }
  }

  render(context, position, mapZoom) {
    let renderFunction = null;

    switch (this.options.type) {
      case 'marker':
        renderFunction = this.renderMarker;
        break;

      case 'circle':
        renderFunction = this.renderCircle;
        break;

      case 'donut':
        renderFunction = this.renderDonut;
        break;

      case 'image':
        renderFunction = this.renderImage;
        break;
    }

    if (!renderFunction) {
      throw new Error(`Unsupported marker type: "${this.options.type}"`);
    } else {
      renderFunction = renderFunction.bind(this);
      renderFunction(context, position, mapZoom);
    }
  }

  renderCircle(context, position) {
    context.fillStyle = this.options.color;
    context.strokeStyle = this.options.strokeStyle;
    context.lineWidth = this.options.lineWidth;

    context.save();
    context.beginPath();
    context.arc(position[0], position[1], this.size[0] / 2, 0, 2 * Math.PI);
    context.fill();

    if (this.options.enableStroke) {
      context.stroke();
    }

    context.restore();
  }

  renderDonut(context, position) {
    context.fillStyle = this.options.color;
    context.strokeStyle = this.options.color;

    context.save();
    context.beginPath();
    context.lineWidth = 5;
    context.arc(position[0], position[1], this.size[0] / 2, 0, 2 * Math.PI);
    context.stroke();
    context.restore();
  }

  renderMarker(context, position, mapZoom) {
    this.renderShadow(context, position, mapZoom);

    context.fillStyle = this.options.color;
    context.strokeStyle = this.options.color;

    const size = this.size;

    const x = position[0] - size[0] / 2;
    const y = position[1] - size[1];

    context.save();
    context.transform(0.184386, 0.000000, 0.000000, 0.184386, 0.551658 + x, 4.095760 + y);
    context.beginPath();
    context.lineWidth = 1.667195;
    context.moveTo(45.000000, -22.212949);
    context.bezierCurveTo(18.494941, -22.212949, -2.991863, -0.726145, -2.991863, 25.778914);
    context.bezierCurveTo(-2.991863, 52.282306, 45.000000, 112.212950, 45.000000, 112.212950);
    context.bezierCurveTo(45.000000, 112.212950, 92.991863, 52.282306, 92.991863, 25.777247);
    context.bezierCurveTo(92.991863, -0.726145, 71.505059, -22.212949, 45.000000, -22.212949);
    context.moveTo(45.000000, 43.827962);
    context.bezierCurveTo(33.553042, 43.827962, 24.273437, 34.550024, 24.273437, 23.103067);
    context.bezierCurveTo(24.273437, 11.656109, 33.553042, 2.376504, 45.000000, 2.376504);
    context.bezierCurveTo(56.446958, 2.376504, 65.726563, 11.654442, 65.726563, 23.101399);
    context.bezierCurveTo(65.726563, 34.548357, 56.446958, 43.827962, 45.000000, 43.827962);
    context.fill();
    context.restore();
  }

  renderImage(context, position, mapZoom) {
    if (this.options.image) {
      this.renderShadow(context, position, mapZoom);

      const size = this.size;
      const x = position[0] - size[0] / 2 + this.offset[0];
      const y = position[1] - size[1] / 2 + this.offset[1];

      context.drawImage(this.options.image, x, y, size[0], size[1]);
    }
  }

  renderShadow(context, position, mapZoom) {
    if (this.options.enableShadow && mapZoom > 8) {
      context.save();
      context.fillStyle = context.strokeStyle = context.shadowColor = 'rgb(227, 213, 217)';
      context.shadowBlur = 5;

      context.beginPath();
      context.ellipse(position[0], position[1] + 2, 5, 2.5, Math.PI, 0, 2 * Math.PI);
      context.fill();
      context.restore();
    }
  }
}
