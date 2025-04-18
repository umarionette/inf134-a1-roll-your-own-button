// importing local code, code we have written
import { Window, Widget, RoleType } from "../core/ui";
import { IdleUpWidgetState, HoverWidgetState, PressedWidgetState } from "../core/ui";
// importing code from SVG.js library
import { Circle, Text} from "../core/ui";

type RadioChangeCallback = (selectedIndex: number) => void;

class RadioButton extends Widget {
    private _circle: Circle;
    private _dot: Circle;
    private _label: Text;
    private _checked: boolean = false;
    private _labelText: string;
    private _fontSize: number = 15;
    private _index: number;
    private _callback: (() => void) | null = null;

    constructor(parent: Window, label: string, index: number) {
        super(parent);
        this._labelText = label;
        this._index = index;
        this.width = 150;
        this.height = 30;
        this.role = RoleType.radio;
        this.render();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        // appearance
        this._circle = this._group.circle(16)
            .fill('#ccc')
            .stroke({width: 2, color: '#333'})
            .move(0, 7);

        this._dot = this._group.circle(8)
        .fill('#fff')
        .center(8, 15)
        .hide();

        this._label = this._group.text(this._labelText)
            .font({size: this._fontSize, family: 'Arial'})
            .move(24, 4);

        // interactions
        this._group.on("click", () => {
            if (this._callback) this._callback();
        });

        this._group.on("mouseenter", () => {
            if (!this._checked) {
                this.setState(new HoverWidgetState());
                this.hoverState();
            }
        });
        
        this._group.on("mouseleave", () => {
            if (!this._checked) {
                this.setState(new IdleUpWidgetState());
                this.idleupState();
            }
        });
        
        this._group.on("mousedown", () => {
            if (!this._checked) {
                this.setState(new PressedWidgetState());
                this.pressedState();
            }
        });
        
        this._group.on("mouseup", () => {
            if (!this._checked) {
                this.setState(new HoverWidgetState());
                this.hoverState();
            }
        });
              
    }

    set checked(value: boolean) {
        this._checked = value;
        if (value) {
            this._dot.show();
            this.pressedState();
        }
        else {
            this._dot.hide();
            this.idleupState();
        }
    }

    get checked(): boolean {
        return this._checked;
    }

    setLabel(text: string): void {
        this._labelText = text;
        this._label.text(text);
    }

    onSelect(callback: () => void): void {
        this._callback = callback;
    }

    get index(): number {
        return this._index;
    }

    idleupState(): void {
        this._circle.fill('#ccc');
        this._circle.stroke({width: 2, color: '#333'})
        this._label.fill('#333');
    }
    
    idledownState(): void {}
    
    pressedState(): void {
        this._circle.fill('#606C38');
        this._circle.stroke({width: 2, color: '#333'});
        this._dot.fill('#DDA15E').show();
        this._label.fill('#333');
    }
    
    hoverState(): void {
        this._circle.fill('#DDA15E');
        this._circle.stroke({ width: 2, color: '#333'});
    }
    
    hoverPressedState(): void {}
    pressedoutState(): void {}
    pressReleaseState(): void {}
    moveState(): void {}    
    keyupState(): void {}   
}

export {RadioButton};

class RadioGroup extends Widget {
    private _buttons: RadioButton[] = [];
    private _selectedIndex: number = -1;
    private _onChange: RadioChangeCallback | null = null;
    private _labels: string[];
    private _x: number = 0;
    private _y: number = 0;

    constructor(parent: Window, labels: string[]) {
        super(parent);
        this._labels = labels;
        this.width = 150;
        this.height = labels.length * 35;
        this.role = RoleType.group
        this.render();
    }

    render(): void { 
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;
        this._createButtons();
    }

    move(x: number, y: number): void {
        this._x = x;
        this._y = y;
        this._buttons.forEach((btn, i) => {
            btn.move(x, y + i * 35);
        });
    }    

    private _createButtons(): void {
        this._labels.forEach((label, i) => {
            const btn = new RadioButton(this.parent as Window, label, i);
            btn.move(this._x, this._y + i * 35);
            btn.onSelect(() => this._handleSelect(i));
            this._buttons.push(btn);
        });
    }

    private _handleSelect(index: number): void {
        this._buttons.forEach((btn, i) => {
            btn.checked = (i === index);
        });
        this._selectedIndex = index;
        if (this._onChange) this._onChange(index);
    }    

    onChange(callback: RadioChangeCallback): void {
        this._onChange = callback;
    }

    setSelectedIndex(index: number): void {
        if (index >= 0 && index < this._buttons.length){
            this._handleSelect(index);
        }
    }

    getSelectedIndex(): number {
        return this._selectedIndex;
    }

    setLabel(index: number, label: string): void {
        if (index >= 0 && index < this._buttons.length) {
            this._buttons[index].setLabel(label);
        }
    }

    idleupState(): void {}
    idledownState(): void {}
    pressedState(): void {}
    pressReleaseState(): void {}
    hoverState(): void {}
    hoverPressedState(): void {}
    pressedoutState(): void {}
    keyupState(): void {}
    moveState(): void {}
}

export {RadioGroup};