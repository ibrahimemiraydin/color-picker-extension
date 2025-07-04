# Color Picker Extension

A lightweight and user-friendly browser extension for picking colors from any webpage or screen. This extension allows users to select colors and view them in multiple color formats (HEX, RGB, HSL, CMYK, HWB, LAB, XYZ) with a simple and accessible interface. Built with HTML, CSS, and JavaScript.

![Color Picker Extension Screenshot](https://github.com/ibrahimemiraydin/color-picker-extension/blob/main/images/color-picker-extension.png?raw=true)

## Features

- **Color Selection**: Pick colors directly from any webpage or screen using an intuitive color picker.
- **Multiple Color Formats**: Displays selected colors in HEX, RGB, HSL, CMYK, HWB, LAB, and XYZ formats.
- **Copy to Clipboard**: Easily copy color codes in any format with a single click.
- **Color History**: View previously selected colors in a history panel (toggleable).
- **Responsive Design**: Supports resizing the extension window for a compact or full view.
- **Accessibility**: Includes ARIA labels and keyboard navigation for improved accessibility.
- **Modern UI**: Clean and minimal design with Google Material Symbols and Inter/Fira Code fonts.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ibrahimemiraydin/color-picker-extension.git
   ```

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (top-right toggle).
   - Click **Load unpacked** and select the cloned repository folder.

3. **Use the Extension**:
   - Pin the extension to your browser toolbar.
   - Click the extension icon to open the color picker popup.
   - Use the "Renk Seç" (Pick Color) button to start selecting colors.

## Usage

- **Pick a Color**: Click the "Renk Seç" button to activate the color picker. Click anywhere on the screen to select a color.
- **View Color Formats**: The selected color is displayed in multiple formats (HEX, RGB, HSL, etc.).
- **Copy Color Codes**: Click the copy button next to any color format to copy it to your clipboard.
- **Toggle Size**: Use the minimize/maximize button in the header to resize the extension window.
- **View History**: Click the color preview area to toggle the color history panel.

## File Structure

- `index.html`: The main HTML file defining the structure of the extension popup.
- `styles.css`: CSS file for styling the extension's UI.
- `popup.js`: JavaScript file containing the logic for color picking, format conversion, and interactions.
- `images/color-picker-extension.png`: Screenshot of the extension for documentation.

## Dependencies

- **Google Fonts**: Uses Inter and Fira Code fonts for typography.
- **Material Symbols**: Google Material Symbols for icons (e.g., colorize, content_copy).

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m "Add feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a pull request.

Please ensure your code follows the existing style and includes appropriate documentation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, feel free to reach out via [GitHub Issues](https://github.com/ibrahimemiraydin/color-picker-extension/issues) or contact me at [emiraydin.me].