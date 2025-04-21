// widgets/todolist.ts
import { Widget, Window, RoleType } from "../core/ui";
import { Heading } from "./heading";
import { Checkbox } from "./checkbox";
import { ProgressBar } from "./progressbar";

class ToDoList extends Widget {
  private _tasks: string[] = ["Buy supplies", "Update inventory", "Email supplier"];
  private _checkboxes: Checkbox[] = [];
  private _progressBar: ProgressBar;
  private _progressText: Heading;

  constructor(parent: Window) {
    super(parent);
    this.role = RoleType.group;
    this.render();
  }

  render(): void {
    const parentWindow = this.parent as Window;
    const startX = 20;
    let startY = 650;
  
    startY += 40;
  
    for (const task of this._tasks) {
      const checkbox = new Checkbox(parentWindow);
      checkbox.label = task;
      checkbox.move(startX, startY);
      checkbox.onChange(() => this.updateProgress());
      this._checkboxes.push(checkbox);
      startY += 30;
    }
  
    this._progressBar = new ProgressBar(parentWindow);
    this._progressBar.setWidth(200);
    this._progressBar.setIncrement(0);
    this._progressBar.move(startX, startY + 10);
  
    this._progressText = new Heading(parentWindow);
    this._progressText.text = `0% Complete`;
    this._progressText.fontSize = 14;
    this._progressText.move(startX + 210, startY + 10);
  }
  
  private updateProgress(): void {
    const completed = this._checkboxes.filter(cb => cb.checked).length;
    const total = this._checkboxes.length;
    const ratio = total === 0 ? 0 : Math.round((completed / total) * 100);
    this._progressBar.setIncrement(ratio);
    this._progressText.text = `${ratio}% Complete`;
  }

  idleupState(): void {}
  idledownState(): void {}
  pressedState(): void {}
  pressReleaseState(): void {}
  hoverState(): void {}
  hoverPressedState(): void {}
  pressedoutState(): void {}
  moveState(): void {}
  keyupState(): void {}
}

export { ToDoList };
