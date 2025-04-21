import {IdleUpWidgetState, Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"
import {Checkbox} from "./widgets/checkbox";
import {RadioGroup} from "./widgets/radiobutton";
import {Scrollbar} from "./widgets/scrollbar";

let w = new Window(window.innerHeight-10,'100%');

let lbl1= new Heading(w);
lbl1.text = "Button Demo";
lbl1.tabindex = 1;
lbl1.fontSize = 20;
lbl1.move(10, 20);

let lbl2 = new Heading(w);
lbl2.text = "Checkbox Demo";
lbl2.tabindex = 1; 
lbl2.fontSize = 20;
lbl2.move(10, 100);

let lbl3 = new Heading(w);
lbl3.text = "Radio Button Demo";
lbl3.tabindex = 3;
lbl3.fontSize = 20;
lbl3.move(10, 180);

let lbl4 = new Heading(w);
lbl4.text = "Scrollbar Position:";
lbl4.tabindex = 4;
lbl4.fontSize = 20;
lbl4.move(10, 340);

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14
btn.move(12, 50)

let chk = new Checkbox(w);
chk.tabindex = 3;
chk.move(10, 130);

let radio = new RadioGroup(w, ["I'm Option A", "I'm Option B", "I'm Option C"]);
radio.move(10, 220);

let scrollbar = new Scrollbar(w);
scrollbar.move(10, 375);
scrollbar.setHeight(150);
scrollbar.setThumbHeight(30);

// button interactions
btn.onClick(() => {
    lbl1.text = "Button Clicked!";

    // set delay for feedback then reset both heading and button
    setTimeout(() => {
      lbl1.text = "Button Demo";
      btn.setState(new IdleUpWidgetState());
    }, 1000); // 1 second
  });

// checkbox interactions
chk.onChange((checked: boolean) => {
  lbl2.text = checked ? "Checked!" : "Checkbox Demo";
})

// radio interactions
radio.onChange((selectedIndex) => {
  lbl3.text = `Radio Selected: Option ${String.fromCharCode(65 + selectedIndex)}`;
});

// scrollbar interactions
scrollbar.onScroll((direction, ratio) => {
  lbl4.text = `Scroll: ${direction} (${(ratio * 100).toFixed(0)}%)`;
});