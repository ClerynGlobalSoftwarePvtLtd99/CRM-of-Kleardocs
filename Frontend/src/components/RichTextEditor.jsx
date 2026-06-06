import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...', height = 600 }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (content) => {
    if (onChange) {
      onChange(content);
    }
  };
  

  return (
    <div className="rich-text-editor-container" style={{ width: '100%' }}>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: 'file edit view insert format tools table help',
          license_key: 'gpl', // Acknowledging GPL license usage for self-hosted version
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'pagebreak'
          ],
          toolbar:
            'undo redo | blocks fontfamily fontsize | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'forecolor backcolor | table link image | pagebreak preview code | fullscreen help | removeformat',
          
          // CRUCIAL FOR SELF-HOSTED: Let TinyMCE know where to find the skin and content CSS
          skin_url: '/tinymce/skins/ui/oxide',
          content_css: '/tinymce/skins/content/default/content.min.css',

          // Prevent TinyMCE from converting absolute URLs to relative paths
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,

          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              font-size: 14pt; 
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              background-color: #fff;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              min-height: 100%;
            }
            /* A4 Paper Styling for previewing documents */
            @media print {
              body {
                box-shadow: none;
                margin: 0;
                padding: 0;
              }
            }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
};

export default RichTextEditor;
