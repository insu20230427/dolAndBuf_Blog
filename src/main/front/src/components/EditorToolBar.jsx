import './QuillStyle.css'
import {Quill} from "react-quill";
import ImageResize from "quill-image-resize-module-react/src/ImageResize";

// Quill 에디터에서 폰트 크기와 폰트 스타일에 대한 목록을 명시적으로 지정
const Size = Quill.import("formats/size");
Size.whitelist = ["medium", "large", "huge"];
Quill.register(Size, true);

const Font = Quill.import("attributors/class/font");
Font.whitelist = ["noto-sans-kr", "roboto", "merriweather", "lato", "buri"];
Quill.register(Font, true);

Quill.register('modules/imageResize', ImageResize);

const EditorToolBar = () => {
    return (
        <div id="toolbar">
      <span className="ql-formats">
         <select className="ql-font" defaultValue="noto-sans-kr">
                    <option value="noto-sans-kr">Noto Sans KR</option>
                    <option value="roboto">Roboto</option>
                    <option value="merriweather">Merriweather</option>
                    <option value="lato">Lato</option>
                    <option value="buri">Buri</option>
         </select>
        <select className="ql-size" defaultValue="medium">
          {/*<option value="medium">Medium</option>*/}
            <option value="large">Large</option>
            <option value="huge">Huge</option>
        </select>
        <select className="ql-header">
          <option value="1">Header 1</option>
          <option value="2">Header 2</option>
          <option value="3">Header 3</option>
          <option value="4">Header 4</option>
          <option value="5">Header 5</option>
          <option value="6">Header 6</option>
        </select>
      </span>
            <span className="ql-formats">
        <button className="ql-bold"/>
        <button className="ql-italic"/>
        <button className="ql-underline"/>
        <button className="ql-strike"/>
        <button className="ql-blockquote"/>
      </span>
            <span className="ql-formats">
        <select className="ql-color"/>
        <select className="ql-background"/>
      </span>
            <span className="ql-formats">
        <button className="ql-image"/>
        <button className="ql-video"/>
      </span>
            <span className="ql-formats">
        <button className="ql-clean"/>
      </span>
        </div>
    );
};

export default EditorToolBar;
