
  const form = document.getElementById('markdown-form');
  const input = document.getElementById('markdown-input');
  const output = document.getElementById('converted-output');

  const boldButton = document.querySelector('.boldBtn');
  
  const convertBtn = document.querySelector('.convertBtn');

document.addEventListener('DOMContentLoaded', function() {
  boldButton.addEventListener('click', insertTextAndMoveCaret);

  convertBtn.addEventListener('mouseenter', () => convertBtn.style.background = '#0099ff');
  convertBtn.addEventListener('mousedown', () => convertBtn.style.background = '#0066aa');
  convertBtn.addEventListener('mouseout', () => convertBtn.style.background = '#2b2d31');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = input.value;
    const lines = text.split('\n');

    var convertedText = text.replace(/# /g, '<h1>');
    const preElement = document.createElement('pre');

    output.addEventListener('mouseover', function() {
      //preElement.style.display = 'none';
      //output.innerHTML = `<div class="converted-text"><code><pre>${convertedText}</pre></code></div>`;
    });

    output.addEventListener('mouseout', function() {
      //preElement.style.display = 'block'; // Or 'inline-block' depending on your styling
      //output.innerHTML = ``;

    });

    const containsCarriageReturn = text.includes('\n');

    // Initialize a flag to check if we're inside an ordered list
    let insideOl = false;

    // Iterate through each line
    convertedLines = lines.map((line) => {
      //////// Detect Markdown to HTML Converstion
      if (line.startsWith('# ')) {
				console.log(`Line 45: (line.startsWith #)`);
        return `<h1 class="discord_HeaderL">${line.substring(2)}</h1>`;
      } else if (line.startsWith('## ')) {
				console.log(`Line 48: (line.startsWith ##)`);
        return `<h2 class="discord_HeaderM">${line.substring(3)}</h2>`;
      } else if (line.startsWith('**')) {
				console.log(`Line 51: (line.startsWith **)`);
        // Handle **text**
        let modifiedLine = line;
        const length = line.length;
        let asteriskCount = (line.match(/\*/g) || []).length;
				console.log(`Line 51—56: (line.startsWith **) —> asteriskCount: ${asteriskCount}`);

        while (modifiedLine.includes('**')) {
					console.log('Line 58');
          const startIndex = modifiedLine.indexOf('**');
          const endIndex = modifiedLine.indexOf('**', startIndex + 2);
          if (startIndex !== -1 && endIndex !== -1) {
            const boldText = modifiedLine.substring(startIndex + 2, endIndex);
            modifiedLine = modifiedLine.replace(`**${boldText}**`, `<strong class="discord_BoldText">${boldText}</strong>`);
          } else {
            break;
          }
        }
        return modifiedLine;
      } else if (line.includes('**')) {
					console.log('Line 71');
        let modifiedLine = line;
        const length = line.length;
        let asteriskCount = (line.match(/\*/g) || []).length;

        while (modifiedLine.includes('**')) {
					console.log('Line 77');
          const startIndex = modifiedLine.indexOf('**');
          const endIndex = modifiedLine.indexOf('**', startIndex + 2);
          if (startIndex !== -1 && endIndex !== -1) {
					console.log('Line 81');
            const boldText = modifiedLine.substring(startIndex + 2, endIndex);
            modifiedLine = modifiedLine.replace(`**${boldText}**`, `<strong class="discord_BoldText2">${boldText}</strong>`);
          } else {
            break;
          }
        }
			  console.log('Line 88 return modifiedLine');
        return modifiedLine;
      } else if (line.startsWith('1. ')) {
			  console.log('Line 91');
        // Start an ordered list if not already inside one
        if (!insideOl) {
			 		 console.log('Line 94');
          insideOl = true;
          return `<ol>\n<li style="color: #0f0">${line.substring(3)}</li>`;
        }
			  console.log('Line 98');
        // Add list items
        return `<li class="discord_ListItem" style="color: #0f0">${line.substring(3)}</li>`;
      } else if (line.match(/^\d{1,2}\.\s/)) {
			  console.log('Line 102');
        // For lines matching the pattern, wrap them in <li> tags
        return `<li class="discord_ListItem" style="color: #f00">${line.substring(3)}</li>`;
      } else {
			  console.log('Line 106');
        // Stop the ordered list if inside one and the current line doesn't start with "1. "
        if (insideOl) {
			  console.log('Line 109');
          insideOl = false;
          return '</ol>\n' + line;
        }
        //////// Detect HTML to Markdown Converstion
        if (line.startsWith('<h1 class="discord_HeaderL">')) {
			  console.log('Line 114');
          const endIndex = line.indexOf('</h1>'); // Find the index of the closing </h1> tag
          if (endIndex !== -1) {
            return `# ${line.substring(28, endIndex)}`; // Extract the content between <h1> and </h1>
          }
        } else if (line.startsWith('<h1>')) {
			  console.log('Line 121');
          const endIndex = line.indexOf('</h1>'); // Find the index of the closing </h1> tag
          if (endIndex !== -1) {
			  		console.log('Line 124');
            return `# ${line.substring(4, endIndex)}`; // Extract the content between <h1> and </h1>
          }
        }
			  console.log('Line 128');
        return line;
      }
    });

    // Close the ordered list if inside one after processing all lines
    if (insideOl) {
			  console.log('Line 135');
      convertedLines.push('</ol>');
    }

    convertedText = convertedLines.join('\n');
		console.log('Line 140');
    const previewElement = document.createElement('div');
    previewElement.className = 'previewElement';
    previewElement.innerHTML = `<div class="converted-text"><code><pre>${convertedText}</pre></code></div>`;

    preElement.textContent = convertedText;

    if (text && !text.includes("</")) {
		console.log('Line 148');
      output.appendChild(preElement);
      //output.appendChild(previewElement);
    }
    if (text && text.includes("</")) {
		console.log('Line 148');
      output.appendChild(preElement);
      console.log("Text contains HTML code");
    }

  });
});


function insertTextAndMoveCaret() {
  var textarea = document.getElementById('markdown-input');
  var selectionStart = textarea.selectionStart;
  var selectionEnd = textarea.selectionEnd;
  var textToInsert = '****';
  var currentText = textarea.value;
  var newText = currentText.substring(0, selectionStart) + textToInsert + currentText.substring(selectionEnd);
  textarea.value = newText;
  var newCursorPosition = selectionStart + textToInsert.length / 2;
  textarea.setSelectionRange(newCursorPosition, newCursorPosition);
  textarea.focus();
}


function convertText(lines) {
  let insideOl = false; // Track if inside an ordered list

  // Iterate through each line
  var convertedLines = lines.map((line) => {
    //////// Detect Markdown to HTML Conversion
    if (line.startsWith('# ')) {
      return `<h1 class="discord_HeaderL">${line.substring(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      return `<h2 class="discord_HeaderM">${line.substring(3)}</h2>`; 
}
else if (line.startsWith('### ')) {
      return `<h3 class="discord_HeaderS">${line.substring(4)}</h3>`;
    } 
		else if (line.startsWith('#### ')) {
      return `<h4 class="discord_HeaderXL">${line.substring(5)}</h4>`;
    } 
else if (line.startsWith('**')) {
      // Handle **text** and **text** separately
      let modifiedLine = line;
      const length = line.length;
      let asteriskCount = (line.match(/\*/g) || []).length;

      while (modifiedLine.includes('**')) {
        const startIndex = modifiedLine.indexOf('**');
        const endIndex = modifiedLine.indexOf('**', startIndex + 2);
        if (startIndex !== -1 && endIndex !== -1) {
          const boldText = modifiedLine.substring(startIndex + 2, endIndex);
          modifiedLine = modifiedLine.replace(`**${boldText}**`, `<strong class="discord_BoldText">${boldText}</strong>`);
        } else {
          break;
        }
      }

      return modifiedLine;
    } else if (line.includes('**')) {
      let modifiedLine = line;
      const length = line.length;
      let asteriskCount = (line.match(/\*/g) || []).length;

      while (modifiedLine.includes('**')) {
        const startIndex = modifiedLine.indexOf('**');
        const endIndex = modifiedLine.indexOf('**', startIndex + 2);
        if (startIndex !== -1 && endIndex !== -1) {
          const boldText = modifiedLine.substring(startIndex + 2, endIndex);
          modifiedLine = modifiedLine.replace(`**${boldText}**`, `<strong class="discord_BoldText2">${boldText}</strong>`);
        } else {
          break;
        }
      }
      return modifiedLine;
    } else if (line.startsWith('1. ')) {

      // Start an ordered list if not already inside one
      if (!insideOl) {
        insideOl = true;
        return `<ol>\n<li style="color: #0f0">${line.substring(3)}</li>`;
      }

      // Add list items
      return `<li class="discord_ListItem" style="color: #0f0">${line.substring(3)}</li>`;
    } else if (line.match(/^\d{1,2}\.\s/)) {
      // For lines matching the pattern, wrap them in <li> tags
      return `<li class="discord_ListItem" style="color: #f00">${line.substring(3)}</li>`;
    } else {
      // Stop the ordered list if inside one and the current line doesn't start with "1. "
      if (insideOl) {
        insideOl = false;
        return '</ol>\n' + line;
      }
      //////// Detect HTML to Markdown Conversion
      if (line.startsWith('<h1 class="discord_HeaderL">')) {
		console.log('Line 244 : ');

        const endIndex = line.indexOf('</h1>'); // Find the index of the closing </h1> tag
        if (endIndex !== -1) {
          return `# ${line.substring(28, endIndex)}`; // Extract the content between <h1> and </h1>
        }
      } else if (line.startsWith('<h1>')) {
		console.log('Line 251 : ');

        const endIndex = line.indexOf('</h1>'); // Find the index of the closing </h1> tag
        if (endIndex !== -1) {
          return `# ${line.substring(4, endIndex)}`; // Extract the content between <h1> and </h1>
        }
      }
		console.log('Line 258 : return line ');
      return line;
    }
  });
		console.log('Line 262 : set convertedText variable ');

  convertedText = convertedLines.join('\n');
		console.log('Line 265 : convertedText variable set and lines joined ');

  return convertedText;
}

function updatePreview() {
  const markdownText = input.value;
  const htmlText = markdownText;
  const lines = markdownText.split('\n');
  const containsCarriageReturn = markdownText.includes('\n');
  convertText(lines);


const regex2 = /^(?!<div\s*class="discord_).*$/gm;
// Check if convertedText contains <div> and </div>
if (convertedText.match(regex2) && convertedText.includes('</div>')) {
convertedText = convertedText.replace(/<div/g, '<code>&lt;div').replace(/<\/div>/g, '&lt;/div&gt;</code>');
}

  output.innerHTML = `<div class="converted-text"><code><pre>${convertedText}</pre></code></div>`;

  console.log(markdownText);
}


input.addEventListener('input', updatePreview);
