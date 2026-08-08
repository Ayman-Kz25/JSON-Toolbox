# JSON Toolbox

A simple browser-based developer utility for working with JSON.

JSON Toolbox lets you format, validate, minify, convert, copy, download, and manage JSON from one clean interface.

## Features

* Format JSON
* Minify JSON
* Validate JSON
* Convert JSON to:

  * CSV
  * XML
  * YAML
* Upload JSON files
* Copy processed JSON
* Download JSON
* Clear the editor
* View line and character counts
* Display JSON validation errors
* Line-numbered JSON editor
* Light/dark theme support
* Responsive layout
* Toast notifications for actions and errors

## Tech Stack

* HTML5
* CSS3
* JavaScript ES Modules
* Font Awesome
* Inter
* JetBrains Mono
* js-yaml

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Open the project folder:

```bash
cd json-toolbox
```

Then open `index.html` using a local development server.

For example, you can use VS Code with the **Live Server** extension.

## Usage

1. Paste or write JSON in the **Input** editor.
2. Choose an operation from the toolbar.
3. View the processed result in the **Result** editor.
4. Copy or download the result when needed.

### Available Operations

| Operation   | Description                            |
| ----------- | -------------------------------------- |
| Format      | Formats JSON with readable indentation |
| Minify      | Removes unnecessary whitespace         |
| Validate    | Checks whether the JSON is valid       |
| JSON → CSV  | Converts JSON data to CSV              |
| JSON → XML  | Converts JSON data to XML              |
| JSON → YAML | Converts JSON data to YAML             |
| Upload JSON | Loads a JSON file into the editor      |
| Clear       | Clears the current editor              |
| Copy        | Copies the result to the clipboard     |
| Download    | Downloads the result                   |

The exact structure may vary depending on how the CSS and JavaScript files are organized in your project.

## External Resources

The project uses:

* Google Fonts for **Inter** and **JetBrains Mono**
* Font Awesome for icons
* js-yaml for YAML support

## Browser Support

JSON Toolbox is designed to run in modern browsers that support:

* ES modules
* Modern DOM APIs
* FileReader
* Clipboard API
* CSS Flexbox and Grid

## License

This project is available under the license included in the repository.

## Author

**JSON Toolbox**

A lightweight developer utility for working with JSON.