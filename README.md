# Desert Festival Experience

A deeply immersive, scroll-based web application designed to showcase the Desert Festival. features full-screen cinematic video backgrounds, interactive artist galleries, and a seamless narrative flow.

## 🌟 Features

*   **Cinematic Experience:** Full-screen video backgrounds utilizing **Git LFS** for high-quality playback without performance compromise.
*   **Immersive Audio:** Global background audio that persists across navigation, featuring a user-friendly mute toggle.
*   **Interactive Design:**
    *   Smooth scroll transitions.
    *   Dynamic text overlays and animations.
    *   Interactive artist and speaker cards.
*   **Responsive Layout:** Fully optimized for different screen sizes.
*   **Narrative Flow:** Use of "Harmonium-style" pagination and sand-themed transitions to guide the user through the journey from Jaisalmer to the festival venues.

## 🛠️ Tech Stack

*   **Framework:** [React 18](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Animation:** `tailwindcss-animate`, Custom CSS transitions
*   **Asset Management:** Git LFS (Large File Storage) for video assets

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn
*   Git LFS installed (`git lfs install`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rashmikauthaa/Final_desert-main.git
    cd Final_desert-main
    ```

2.  **Pull LFS assets (Important):**
    This project uses Git LFS for video files. You must pull them to ensure they play correctly.
    ```bash
    git lfs pull
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:8080](http://localhost:8080) (or the port shown in your terminal) to view the project.

## 📂 Project Structure

*   `public/assets`: Static assets including images, audio, and LFS-tracked videos.
*   `src/components/pages`: Individual page components representing each section of the scroll journey.
*   `src/components`: Shared UI components (PlayPauseToggle, BackgroundAudio, etc.).
*   `src/pages/Index.tsx`: Main sequencer and layout controller.

## 🤝 Contribution

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
