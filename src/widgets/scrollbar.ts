import { Widget, Window, RoleType } from "../core/ui";
import { Rect, Text } from "../core/ui";
import { IdleUpWidgetState, HoverWidgetState, PressedWidgetState, IdleDownWidgetState, PressedOutWidgetState, HoverPressedWidgetState } from "../core/ui";

type ScrollDirection = "up" | "down" | "none";
type ScrollCallback = (direction: ScrollDirection, scrollRatio: number) => void;

class Scrollbar extends Widget {
    private _track: Rect;
    private _thumb: Rect;
    private _thumbHeight: number = 40;
    private _defaultHeight: number = 100;
    private _scrollRatio: number = 0;
    private _callback: ScrollCallback | null = null;
    private _upButton: Rect;
    private _downButton: Rect;
    private _scrollAmount: number = 10;

    constructor(parent: Window) {
        super(parent);
        this.width = 20;
        this.height = 100;
        this.role = RoleType.scrollbar;
        this.setState(new IdleUpWidgetState());
        this.render();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;
        
        const {trackY, trackHeight} = this.getScrollBounds();

        // up button 
        this._upButton = this._group
            .rect(this.width, this.width)
            .fill('#aaa')
            .radius(3)
            .move(0,0);

        this._group.text('^')
            .font({size: 14})
            .center(this.width / 2, this.width / 2);

        // scroll track
        this._track = this._group
            .rect(this.width, trackHeight)
            .fill('#eee')
            .move(0, trackY)
            .radius(10);

        // thumb
        this._thumb = this._group
            .rect(this.width, this._thumbHeight)
            .fill('#777')
            .radius(10)
            .move(0, trackY);

        // down button
        this._downButton = this._group
            .rect(this.width, this.width)
            .fill('#aaa')
            .move(0, this.height - this.width)
            .radius(3);

        this._group.text('v')
            .font({size: 14})
            .center(this.width / 2, this.height - this.width / 2);

        // up button click interaction
        this._upButton.on("click", () => {
            this.moveThumbBy(-this._scrollAmount, "up");
        });

        // down button click interaction
        this._downButton.on("click", () => {
            this.moveThumbBy(this._scrollAmount, "down");
        });

        // thumb drag interaction
        let isDraggable = false;
        let offsetY = 0; 

        this._thumb.on("mousedown", (e: MouseEvent) => {
            isDraggable = true;
            offsetY = e.offsetY - (this._thumb.y() as number);
        });

        this._group.on("mousemove", (e: MouseEvent) => {
            if (!isDraggable) return;
            const mouseY = e.offsetY;
            const { trackY, trackHeight, minY, maxY } = this.getScrollBounds();
            let newY = mouseY - offsetY;
            newY = Math.max(minY, Math.min(newY, maxY));

            const oldRatio = this._scrollRatio;
            this._thumb.y(newY);

            this._scrollRatio = (newY - trackY) / (trackHeight - this._thumbHeight);
            this.notifyScroll(this._scrollRatio > oldRatio ? "down" : "up");
        });

        this._group.on("mouseup", () => {
            isDraggable = false;
        });

        // click on track to jump thumb
        this._track.on("click", (e: MouseEvent) => {
            const clickedY = e.offsetY;
            const oldRatio = this._scrollRatio;
            const { trackY, trackHeight, minY, maxY } = this.getScrollBounds();
            const newY = Math.max(minY, Math.min(clickedY - this._thumbHeight / 2, maxY));

            this._thumb.y(newY);
            this._scrollRatio = (newY - trackY) / (trackHeight - this._thumbHeight);
            this.notifyScroll(this._scrollRatio > oldRatio ? "down" : "up");
        })

        this.scrollRatio = this._scrollRatio;
    }

    moveThumbBy(delta: number, direction: ScrollDirection): void {
        const {trackY, trackHeight, minY, maxY} = this.getScrollBounds();
        let newY = (this._thumb.y() as number) + delta;

        newY = Math.max(minY, Math.min(newY, maxY));

        this._thumb.y(newY);
        this._scrollRatio = (newY - trackY) / (trackHeight - this._thumbHeight);
        this.notifyScroll(direction);
    }

    notifyScroll(direction: ScrollDirection): void {
        if (this._callback) this._callback(direction, this._scrollRatio);
    }

    // API methods
    setHeight(value: number) {
        this._defaultHeight = value;
        this.height = value;
        if (this._group) this._group.clear();
        this.render();
    }

    getHeight(): number {
        return this._defaultHeight;
    }

    getThumbPosition(): number {
        return Number(this._thumb.y());
    }

    onScroll(callback: ScrollCallback): void {
        this._callback = callback;
    }

    setThumbHeight(height: number): void {
        this._thumbHeight = Math.max(10, Math.min(this.height - 2 * this.width, height));
        if (this._thumb) this._thumb.height(this._thumbHeight);
        this.scrollRatio = this._scrollRatio;
    }

    set scrollRatio(value: number) {
        value = Math.max(0, Math.min(1, value));
        const { trackY, trackHeight } = this.getScrollBounds();
        const newY = trackY + value * (trackHeight - this._thumbHeight);
        this._thumb.y(newY);
        this._scrollRatio = value;
    }

    get scrollRatio(): number {
        return this._scrollRatio;
    }

    getScrollBounds() {
        const trackY = this.width;
        const trackHeight = this.height - 2 * this.width;
        const minY = trackY;
        const maxY = trackY + trackHeight - this._thumbHeight;

        return {trackY, trackHeight, minY, maxY};
    }

    // widget methods
    idleupState(): void {
        this.setState(new IdleUpWidgetState());
        this._thumb.fill("#777"); // default thumb color
    }
    
    pressedState(): void {
        this.setState(new PressedWidgetState());
        this._thumb.fill("#444"); // pressed color
    }
    
    hoverState(): void {
        this.setState(new HoverWidgetState());
        this._thumb.fill("#999"); // lighter on hover
    }
    
    hoverPressedState(): void {
        this._thumb.stroke({ color: "#FEFAE0", width: 2 });
    }
    
    keyupState(keyEvent?: KeyboardEvent): void {
        // optional: respond to up/down keys
        if (keyEvent?.key === "ArrowDown") this.moveThumbBy(this._scrollAmount, "down");
        else if (keyEvent?.key === "ArrowUp") this.moveThumbBy(-this._scrollAmount, "up");
    }
    
    idledownState(): void {
        this._thumb.fill("#555"); // optional down state
    }
    
    pressReleaseState(): void {
        this._thumb.stroke({ color: "none" });
    }
    
    pressedoutState(): void {
        this._thumb.stroke({ color: "#ccc" }); // e.g. after drag release
    }
    
    moveState(): void {
        // optional: during mouse drag
        this._thumb.fill("#666");
    }
}

export {Scrollbar}