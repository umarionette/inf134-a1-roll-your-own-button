import {IdleUpWidgetState, Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"
import {Checkbox} from "./widgets/checkbox";

let w = new Window(window.innerHeight-10,'100%');

let lbl1= new Heading(w);
lbl1.text = "Button Demo";
lbl1.tabindex = 1;
lbl1.fontSize = 20;
lbl1.move(10,20);

let lbl2 = new Heading(w);
lbl2.text = "Checkbox Demo";
lbl2.tabindex = 1; 
lbl2.fontSize = 20;
lbl2.move(10, 100);

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14
btn.move(12, 50)

let chk = new Checkbox(w);
chk.tabindex = 3;
chk.move(10, 130);

// button interactions
btn.onClick(() => {
    lbl1.text = "Button Clicked!";

    // set delay for feedback then reset both heading abd button
    setTimeout(() => {
      lbl1.text = "Button Demo";
      btn.setState(new IdleUpWidgetState());
    }, 1000); // 1 second
  });

// checkbox interactions
chk.onChange((checked: boolean) => {
  lbl2.text = checked ? "Checked!" : "Checkbox Demo";
})