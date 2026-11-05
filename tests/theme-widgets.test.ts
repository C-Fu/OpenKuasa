import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import {
  RockerSwitch,
  VuMeter,
  TelemetryBeacon,
  CadCrosshair,
  TapeReel,
} from '@/components/theme-widgets';

describe('Tactile Micro-Widgets Library (src/components/theme-widgets/)', () => {
  describe('RockerSwitch', () => {
    it('renders with role="switch" and aria-checked attribute', () => {
      const htmlOff = renderToString(React.createElement(RockerSwitch, { checked: false, label: 'BUS POWER' }));
      expect(htmlOff).toContain('role="switch"');
      expect(htmlOff).toContain('aria-checked="false"');
      expect(htmlOff).toContain('BUS POWER');

      const htmlOn = renderToString(React.createElement(RockerSwitch, { checked: true, label: 'BUS POWER' }));
      expect(htmlOn).toContain('aria-checked="true"');
      expect(htmlOn).toContain('bg-gradient-to-b from-[#ff6b22]');
    });

    it('honors disabled prop by setting disabled attribute and aria-label', () => {
      const htmlDisabled = renderToString(
        React.createElement(RockerSwitch, { disabled: true, label: 'AUX POWER' })
      );
      expect(htmlDisabled).toContain('disabled=""');
      expect(htmlDisabled).toContain('opacity-50 cursor-not-allowed');
      expect(htmlDisabled).toContain('aria-label="AUX POWER"');
    });
  });

  describe('VuMeter', () => {
    it('renders role="meter" with sanitized min, max, and valuenow attributes', () => {
      const html = renderToString(React.createElement(VuMeter, { value: 75, label: 'OUTPUT LEVEL' }));
      expect(html).toContain('role="meter"');
      expect(html).toContain('aria-valuenow="75"');
      expect(html).toContain('aria-valuemin="0"');
      expect(html).toContain('aria-valuemax="100"');
      expect(html).toContain('OUTPUT LEVEL');
    });

    it('clamps out-of-bounds values strictly to [0, 100] (Threat T-04-04)', () => {
      const htmlHigh = renderToString(React.createElement(VuMeter, { value: 250 }));
      expect(htmlHigh).toContain('aria-valuenow="100"');

      const htmlLow = renderToString(React.createElement(VuMeter, { value: -42 }));
      expect(htmlLow).toContain('aria-valuenow="0"');
    });

    it('renders needle variant with analog scale calibrations', () => {
      const html = renderToString(
        React.createElement(VuMeter, { value: 50, variant: 'needle', channels: 2 })
      );
      expect(html).toContain('CH // L');
      expect(html).toContain('CH // R');
      expect(html).toContain('+3');
      expect(html).toContain('-20');
    });

    it('renders led variant with 16 segment bars', () => {
      const html = renderToString(
        React.createElement(VuMeter, { value: 65, variant: 'led', channels: 1 })
      );
      expect(html).toContain('65%');
      expect(html).toContain('bg-[#00ff66]');
    });

    it('renders strip minimalist progression bar', () => {
      const html = renderToString(
        React.createElement(VuMeter, { value: 40, variant: 'strip' })
      );
      expect(html).toContain('width:40%');
    });
  });

  describe('TelemetryBeacon', () => {
    it('renders status="healthy" with nominal radar ping rings', () => {
      const html = renderToString(
        React.createElement(TelemetryBeacon, { status: 'healthy', showRadar: true })
      );
      expect(html).toContain('role="status"');
      expect(html).toContain('animate-ping');
      expect(html).toContain('bg-[#00ff66]');
    });

    it('renders multi-state health configurations (warning, critical, offline)', () => {
      const htmlWarn = renderToString(React.createElement(TelemetryBeacon, { status: 'warning' }));
      expect(htmlWarn).toContain('bg-[#ffaa00]');

      const htmlCrit = renderToString(React.createElement(TelemetryBeacon, { status: 'critical' }));
      expect(htmlCrit).toContain('bg-[#ff2233]');

      const htmlOff = renderToString(React.createElement(TelemetryBeacon, { status: 'offline' }));
      expect(htmlOff).toContain('bg-neutral-500');
      // Offline status should not pulse
      expect(htmlOff).not.toContain('animate-ping');
    });
  });

  describe('CadCrosshair', () => {
    it('renders CAD coordinates and corner registration marks', () => {
      const html = renderToString(
        React.createElement(
          CadCrosshair,
          { xCoord: '101.424 E', yCoord: '03.158 N', drawingNo: 'DWG-01' },
          React.createElement('div', null, 'Schematic Content')
        )
      );
      expect(html).toContain('X: 101.424 E');
      expect(html).toContain('Y: 03.158 N');
      expect(html).toContain('DWG-01');
      expect(html).toContain('+');
      expect(html).toContain('Schematic Content');
    });
  });

  describe('TapeReel', () => {
    it('renders dual tape spools and respects spinning state', () => {
      const htmlPaused = renderToString(React.createElement(TapeReel, { spinning: false }));
      expect(htmlPaused).toContain('role="img"');
      expect(htmlPaused).toContain('Paused tape reels');
      expect(htmlPaused).toContain('animation:none');

      const htmlSpinning = renderToString(React.createElement(TapeReel, { spinning: true, speed: 'fast' }));
      expect(htmlSpinning).toContain('Spinning tape reels');
      expect(htmlSpinning).toContain('spin 1s linear infinite');
    });
  });
});
