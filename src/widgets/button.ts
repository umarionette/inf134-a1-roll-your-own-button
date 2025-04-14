// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class Button extends Widget{
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Click me!";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 80;
    private defaultHeight: number = 30;

    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.button;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
    }

    set fontSize(size:number){
        this._fontSize= size;
        this.update();
    }

    private positionText(){
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + 4);
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("black");
        this._text = this._group.text(this._input);
        // Set the outer svg element 
        this.outerSvg = this._group;
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        let eventrect = this._group.rect(this.width, this.height).opacity(0).attr('id', 0);

        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(eventrect);
    }

    override update(): void {
        if(this._text != null)
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();

        if(this._rect != null)
            this._rect.fill(this.backcolor);
        
        super.update();
    }
    
    pressReleaseState(): void{

        if (this.previousState instanceof PressedWidgetState)
            this.raise(new EventArgs(this));
    }

    //TODO: implement the onClick event using a callback passed as a parameter
    onClick(callback: () => void):void{
        this._group.node.addEventListener('click', callback);
    }
    
    //TODO: give the states something to do! Use these methods to control the visual appearance of your
    //widget
    idleupState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#1e88e5');
        this._text.fill('#fff');
    }
    idledownState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#0d47a1');
        this._text.fill('#fff');
    }
    pressedState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#1565c0');
        this._text.fill('#e3f2fd');
    }
    hoverState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#42a5f5');
        this._text.fill('#fff');
    }
    hoverPressedState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#0b3954');
        this._text.fill('#fff');
    }
    pressedoutState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#6c757d');
        this._text.fill('#ddd');
    }
    moveState(): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#17a2b8');
        this._text.fill('#fff');
    }
    keyupState(keyEvent?: KeyboardEvent): void {
        throw new Error("Method not implemented.");
        this._rect.fill('#28a745');
        this._text.fill('#fff');
    }
}

export {Button}