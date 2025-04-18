// importing local code, code we have written
import {IdleUpWidgetState, HoverWidgetState, PressedWidgetState} from "../core/ui";
import {Window, Widget, RoleType} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text} from "../core/ui";

class Checkbox extends Widget {
    private _box: Rect;
    private _label: Text;
    private _checked: boolean = false;
    private _callback: ((checked: boolean) => void) | null = null;
    private _labelText: string = "I'm a checkbox";
    private _fontSize: number = 15;
  
    constructor(parent: Window) {
      super(parent);
      this.width = 20;
      this.height = 20;
      this.role = RoleType.checkbox;
      this.setState(new IdleUpWidgetState());
      this.render();
    }
  
    render(): void {
      // set outerSvg  
      this._group = (this.parent as Window).window.group();  
      this.outerSvg = this._group;

      this._box = this._group.rect(this.width, this.height)
        .move(10, 5).fill("#fff")
        .stroke({ width: 2, color: "#606C38" })
        .radius(4);
  
      this._label = this._group.text(this._labelText)
        .move(35, 8)
        .font({ size: this._fontSize, family: "Arial" })
        .fill("#333");
  
      // register interactions  
      this.registerEvent(this._group);
      this.update();
      if (this._callback) this._callback(this._checked);
    }
  
    // changes the colors of the checkbox and text when clicked
    private updateVisual() {
      this._box.fill(this._checked ? "#606C38" : "#fff");
      this._label.fill(this._checked ? "#969696" : "#333");
    }
  
    // uses callback to update visual appearance of checkbox 
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

    // widget methods
    idleupState(): void {
        this.setState(new IdleUpWidgetState());
        this.updateVisual();
    }

    pressedState(): void {
        this.setState(new PressedWidgetState());
        this.toggle();
    }

    hoverState(): void {
        this.setState(new HoverWidgetState());
        this._box.fill('#DDA15E');
    }

    hoverPressedState(): void {
        this._box.stroke({color: '#FEFAE0'});
    }

    keyupState(keyEvent?: KeyboardEvent): void {
      this.toggle();
  }

    idledownState(): void {}
    pressReleaseState(): void {}
    pressedoutState(): void {}
    moveState(): void {}
  }

export {Checkbox};