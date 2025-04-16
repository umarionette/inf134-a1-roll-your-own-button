// importing local code, code we have written
import {IdleUpWidgetState, IdleDownWidgetState, HoverWidgetState, HoverPressedWidgetState, PressedOutWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text} from "../core/ui";

class Checkbox extends Widget {
    private _box: Rect;
    private _label: Text;
    private _checked: boolean = false;
    private _callback: ((checked: boolean) => void) | null = null;
    private _labelText: string = "Check me!";
    private _fontSize: number = 14;
  
    constructor(parent: Window) {
      super(parent);
      this.width = 120;
      this.height = 30;
      this.role = RoleType.checkbox;
      this.setState(new IdleUpWidgetState());
      this.render();
    }
  
    render(): void {
      // set outerSvg  
      this._group = (this.parent as Window).window.group();  
      this.outerSvg = this._group;
      this._box = this._group.rect(20, 20)
        .move(10, 5).fill("#fff")
        .stroke({ width: 2, color: "#4A90E2" })
        .radius(4);
  
      this._label = this._group.text(this._labelText)
        .move(35, 8)
        .font({ size: this._fontSize, family: "Arial" })
        .fill("#333");
  
      // register interactions  
      this.registerEvent(this._group);
      this.update();
    }
  
    private updateVisual() {
      this._box.fill(this._checked ? "#4A90E2" : "#fff");
      this._label.fill(this._checked ? "#4A90E2" : "#333");
      this._label.font({weight: this._checked ? 'italic' : 'normal'});
    }
  
    toggle() {
      this._checked = !this._checked;
      this.updateVisual();
      if (this._callback) this._callback(this._checked);
    }
  
    onChange(callback: (checked: boolean) => void) {
      this._callback = callback;
    }
  
    set label(value: string) {
      this._labelText = value;
      if (this._label){
        this._label.text(value);
      }
    }
  
    get label(): string {
      return this._labelText;
    }
  
    set checked(value: boolean) {
      this._checked = value;
      this.updateVisual();
    }
  
    get checked(): boolean {
      return this._checked;
    }

    // Widget methods
    idleupState(): void {

    }

    idledownState(): void {
        
    }

    pressedState(): void {
        this.toggle();
    }

    pressReleaseState(): void {
        
    }

    hoverState(): void {
        
    }

    hoverPressedState(): void {
        
    }

    pressedoutState(): void {
        
    }

    moveState(): void {
        
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.toggle();
    }
  }

  export {Checkbox};