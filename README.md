# Audiometry Trainer

A professional web application for Pure Tone Audiometry Training designed for audiology students. This application provides a realistic simulation of the Hughson-Westlake procedure, allowing students to practice and master audiometric testing techniques.

![Audiometry Trainer Screenshot](./screenshot.png)

## Features

- **Interactive Audiogram**: Visualize and plot hearing thresholds across different frequencies
- **Virtual Patient System**: Practice with simulated patients having various hearing profiles
- **Hughson-Westlake Procedure**: Learn and apply the standard "5-up, 10-down" testing protocol
- **Educational Feedback**: Receive guidance and performance assessment after each test
- **Keyboard Shortcuts**: Efficient testing with keyboard controls
- **Progress Tracking**: Monitor improvement over time
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility Features**: High contrast mode and screen reader support

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/audiometry-trainer.git
   cd audiometry-trainer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Tutorial Mode

Start with the tutorial to learn the basics of pure tone audiometry and the Hughson-Westlake procedure. The tutorial provides step-by-step instructions and interactive examples.

### Practice Mode

Select a virtual patient from the patients page to begin practicing. Each patient has a unique hearing profile that simulates different types of hearing loss. Follow the Hughson-Westlake procedure to determine the patient's hearing thresholds.

### Keyboard Shortcuts

- **Space**: Present tone
- **Up/Down Arrows**: Adjust intensity
- **Left/Right Arrows**: Change frequency
- **R**: Switch to right ear
- **L**: Switch to left ear
- **M**: Toggle masking
- **Enter**: Record threshold

## Technical Details

### Built With

- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Material UI](https://mui.com/) - UI component library
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio generation and processing

### Architecture

The application follows a component-based architecture with the following structure:

- **Components**: Reusable UI elements
- **Pages**: Main application views
- **Services**: Business logic and data handling
- **Interfaces**: TypeScript type definitions
- **Constants**: Application-wide constants and configuration

### Local Storage

The application uses browser local storage to save:
- User settings and preferences
- Test results and progress
- Recently used virtual patients

## Educational Resources

The application includes educational content about:
- Pure tone audiometry principles
- The Hughson-Westlake procedure
- Audiogram interpretation
- Types of hearing loss
- Masking techniques

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- American Speech-Language-Hearing Association (ASHA) for audiometry guidelines
- British Society of Audiology for recommended procedures
- Audiology educators and students who provided feedback during development
