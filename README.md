# audio-wizard

**Code Generation Request Prompt:**

Generate a Vite React Tailwind application using JavaScript that replicates the functionalities of the provided Python script for advanced audio streaming and processing. Below are the specific requirements:

### Functional Requirements:

1. **Authentication:**
   - User login with username and password.
   - Display success or error messages based on credentials.

2. **Audio Recording:**
   - Interface to record audio and save it locally.
   - Display and play the recorded audio.

3. **Audio Playback:**
   - Play audio files using an audio player.

4. **Audio Enhancements:**
   - Volume, bass, treble controls.
   - Options to add reverb and echo.
   - Gain control.
   - Display enhanced audio.

5. **Audio Visualization:**
   - Plot waveform and spectrogram.

6. **Silence Removal:**
   - Remove silence from audio and save the edited file.

7. **Vocal Isolation:**
   - Isolate vocals from audio files.

8. **Batch Processing:**
   - Select and enhance multiple audio files.

9. **Audio Streaming:**
   - Stream audio files from the server.

10. **Live Audio Streaming:**
    - Implement live audio streaming using WebRTC.

11. **File Management:**
    - Interface for users to upload and manage their audio files.
    - Provide options for organizing files into folders or playlists.

12. **Audio Effects Presets:**
    - Allow users to save and apply custom presets for audio enhancements.

13. **Advanced Audio Analysis:**
    - Include functionalities for more advanced audio analysis like pitch detection, tempo estimation, and beat tracking.

14. **Audio Effects Library:**
    - Provide a library of pre-made audio effects (e.g., distortions, delays, filters) that users can apply to their audio files.

15. **Metadata Editing:**
    - Allow users to edit metadata for their audio files, such as title, artist, album, genre, and cover art.

16. **Cross-Platform Compatibility:**
    - Ensure the application is compatible with both desktop and mobile browsers.

17. **Dark Mode:**
    - Provide an option for users to switch between light and dark themes.

18. **Audio Format Conversion:**
    - Allow users to convert audio files between different formats (e.g., MP3 to WAV, AAC to FLAC).

19. **Bookmarking:**
    - Enable users to bookmark specific time points in audio files for quick access.

20. **Audio Transcription:**
    - Provide a feature to transcribe audio files into text.

### Technical Requirements:

1. **Frontend:**
   - Use React with Tailwind CSS for styling.
   - Create functional React components for each feature.
   - Implement a unique, aesthetically pleasing theme with a focus on clean, modern design.

2. **Backend:**
   - Use Node.js and Express.js for server-side functionalities.
   - Implement audio processing with suitable libraries (e.g., ffmpeg).

### Theme Instructions:

- **Color Scheme:** Use a unique color scheme with a primary color of soft teal (#38b2ac) and complementary colors such as deep navy (#1a202c) and light gray (#edf2f7).
- **Typography:** Use a clean, modern sans-serif font like "Poppins" for headings and "Roboto" for body text.
- **Layout:** Ensure a responsive design with a focus on simplicity and ease of use. Utilize white space effectively to create an airy and uncluttered interface.
- **Buttons and Controls:** Design buttons and controls with rounded corners and subtle shadows for a sleek look.
- **Icons:** Use modern, flat icons from a library like Font Awesome or Material Icons to enhance the visual appeal.

### Instructions:

- **React Components:** Create components for user authentication, audio recording, playback, enhancement, visualization, batch processing, streaming, live streaming, file management, audio effects presets, advanced audio analysis, audio effects library, metadata editing, dark mode, audio format conversion, bookmarking, and audio transcription.
- **API Endpoints:** Implement backend endpoints for handling audio processing tasks.
- **Audio Processing:** Use appropriate JavaScript libraries.
- **Styling:** Apply Tailwind CSS for styling and incorporate the unique theme guidelines.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React with shadcn-ui and Tailwind CSS.

- Vite
- React
- shadcn/ui
- Tailwind CSS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/audio-wizard.git
cd audio-wizard
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
