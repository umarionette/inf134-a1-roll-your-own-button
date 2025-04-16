import {IdleUpWidgetState, Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"


let w = new Window(window.innerHeight-10,'100%');

let lbl1= new Heading(w);
lbl1.text = "Button Demo";
lbl1.tabindex = 1;
lbl1.fontSize = 20;
lbl1.move(10,20);

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14
btn.move(12, 50)

btn.onClick(() => {
    lbl1.text = "Button Clicked!";

    // set delay for feedback then reset both heading abd button
    setTimeout(() => {
      lbl1.text = "Button Demo";
      btn.setLabel("Click me!");
      btn.setState(new IdleUpWidgetState());
    }, 1000); // 1 second
  });