import Editor, { CursorCommand, CursorTransformation, cursorOperations, LineBox } from '@taleweaver/core';
import CursorExtension from '../CursorExtension';

export default function moveHeadToRightOfLine(cursorExtension: CursorExtension): CursorCommand {
  return (editor: Editor): CursorTransformation => {
    const transformation = new CursorTransformation();
    const cursor = editor.getCursor();
    if (!cursor) {
      return transformation;
    }
    const head = cursor.getHead();
    const docLayout = editor.getLayoutEngine().getDocLayout();
    const position = docLayout.resolvePosition(head);
    const lineBoxLevelPosition = position.getLineBoxLevel();
    const lineBox = lineBoxLevelPosition.getLayoutNode();
    if (!(lineBox instanceof LineBox)) {
      throw new Error(`Expecting position to be referencing an line box.`);
    }
    if (lineBoxLevelPosition.getSelectableOffset() < lineBox.getSelectableSize() - 1) {
      transformation.addOperation(new cursorOperations.MoveHeadTo(head - lineBoxLevelPosition.getSelectableOffset() + lineBox.getSelectableSize() - 1));
    } else {
      transformation.addOperation(new cursorOperations.MoveHeadTo(head));
    }
    return transformation;
  };
}