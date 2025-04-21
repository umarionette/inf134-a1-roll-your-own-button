import { Widget, Window, RoleType } from "../core/ui";
import { Rect, Text } from "../core/ui";
import { IdleUpWidgetState, PressedWidgetState, HoverWidgetState } from "../core/ui";

type ProgressCallback = (value: number) => void;
type StateChangeCallback = (state: string) => void;

class ProgressBar extends Widget {
    private _bar: Rect;
    private _track: Rect;
    private _label: Text;
    private _x: number = 0;
    private _y: number = 0;
    private _value: number = 0;
    private _width: number = 200;
    private _height: number = 20;
    private _increment: number = 10;

    private _onIncrement: ProgressCallback | null = null;
    private _onStateChange: StateChangeCallback | null = null;

    constructor(parent: Window) {
        super(parent);
        this.height = this._height;
        this.width = this._width;
        this.role = RoleType.progressbar;
        this.setState(new IdleUpWidgetState());
        this.render();
    }

    override move(x: number, y: number): void {
        this._x = x;
        this._y = y;
        super.move(x, y);
        if (this._group) {
            this._group.clear();
            this.render();
        }
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        // track
        this._track = this._group.rect(this._width, this._height)
            .fill('#eee')
            .radius(5)
            .move(this._x, this._y);

        // progress bar
        const progressWidth = Math.round((this._value / 100) * this._width);
        if (progressWidth > 0) { 
            this._bar = this._group.rect(progressWidth, this._height)
            .fill('#76c7c0')
            .radius(5)
            .move(this._x, this._y);
        }

        // text label
        this._label = this._group.text(`${this._value.toFixed(0)}%`)
            .font({ size: 12 })
            .center(this._x + this._width / 2, this._y + this._height / 2);
    }

    // Progress bar controls
    setWidth(width: number): void {
        this._width = width;
        this.width = width;
        this.render();
    }

    setIncrement(value: number): void {
        this._value = Math.max(0, Math.min(100, value));
        this.render();
    }

    getIncrement(): number {
        return this._increment;
    }

    incrementBy(value: number): void {
        const oldValue = this._value;
        this._value = Math.max(0, Math.min(100, this._value + value));
        if (this._value !== oldValue && this._onIncrement) {
            this._onIncrement(this._value);
        }
        this.render();
    }

    onIncrement(callback: ProgressCallback): void {
        this._onIncrement = callback;
    }

    onStateChange(callback: StateChangeCallback): void {
        this._onStateChange = callback;
    }

    // Widget state visuals
    idleupState(): void {
        this.setState(new IdleUpWidgetState());
        this._onStateChange?.("idleup");
    }

    pressedState(): void {
        this.setState(new PressedWidgetState());
        this._onStateChange?.("pressed");
    }

    hoverState(): void {
        this.setState(new HoverWidgetState());
        this._onStateChange?.("hover");
    }

    hoverPressedState(): void {
        this._bar.stroke({ color: "#FEFAE0", width: 2 });
        this._onStateChange?.("hoverpressed");
    }

    keyupState(): void {
        this.incrementBy(this._increment);
    }

    moveState(): void {
        this._bar.fill("#bbb");
        this._onStateChange?.("move");
    }
    idledownState(): void {}
    pressReleaseState(): void {}
    pressedoutState(): void {}
}

export { ProgressBar };
