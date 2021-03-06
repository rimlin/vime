import { h, Component, Prop } from '@stencil/core';
import { PlayerProps } from '../../../core/player/PlayerProps';
import { Dispatcher, createDispatcher } from '../../../core/player/PlayerDispatcher';
import { TooltipDirection, TooltipPosition } from '../../tooltip/types';
import { KeyboardControl } from '../control/KeyboardControl';
import { isUndefined } from '../../../../utils/unit';
import { withPlayerContext } from '../../../core/player/PlayerContext';

@Component({
  tag: 'vime-playback-control',
})
export class PlaybackControl implements KeyboardControl {
  private dispatch!: Dispatcher;

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() playIcon = '#vime-play';

  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() pauseIcon = '#vime-pause';

  /**
   * Whether the tooltip is positioned above/below the control.
   */
  @Prop() tooltipPosition: TooltipPosition = 'top';

  /**
   * The direction in which the tooltip should grow.
   */
  @Prop() tooltipDirection: TooltipDirection;

  /**
   * Whether the tooltip should not be displayed.
   */
  @Prop() hideTooltip = false;

  /**
   * @inheritdoc
   */
  @Prop() keys?: string = 'k';

  /**
   * @internal
   */
  @Prop() paused: PlayerProps['paused'] = true;

  /**
   * @internal
   */
  @Prop() i18n: PlayerProps['i18n'] = {};

  constructor() {
    withPlayerContext(this, ['paused', 'i18n']);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private onClick() {
    this.dispatch('paused', !this.paused);
  }

  render() {
    const tooltip = this.paused ? this.i18n.play : this.i18n.pause;
    const tooltipWithHint = !isUndefined(this.keys) ? `${tooltip} (${this.keys})` : tooltip;

    return (
      <vime-control
        label={this.i18n.playback}
        keys={this.keys}
        pressed={!this.paused}
        onClick={this.onClick.bind(this)}
      >
        <vime-icon href={this.paused ? this.playIcon : this.pauseIcon} />

        <vime-tooltip
          hidden={this.hideTooltip}
          position={this.tooltipPosition}
          direction={this.tooltipDirection}
        >
          {tooltipWithHint}
        </vime-tooltip>
      </vime-control>
    );
  }
}
