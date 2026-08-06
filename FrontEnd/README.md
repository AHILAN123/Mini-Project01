# Login Page (React)

## Files
- `LoginPage.jsx` — the component, structured into named containers (see the comment block at the top of the file).
- `LoginPage.css` — the glassmorphism styling. Imported directly by the component.

## Using it
1. Drop both files into your project (e.g. `src/components/`).
2. Install the one icon dependency used for the username/lock icons:
   ```
   npm install lucide-react
   ```
3. Render it anywhere:
   ```jsx
   import LoginPage from "./components/LoginPage";

   function App() {
     return <LoginPage />;
   }
   ```

## Adding your watermark image
Open `LoginPage.css` and find `.login-page`. Replace the placeholder gradient with your photo:
```css
.login-page {
  background: url('/your-watermark.jpg') center / cover no-repeat;
}
```

## Container map
```
.login-page                 full-screen background
  .glass-frame               outer glass panel
    .navbar                   top pill nav
      .nav-left                 Home / About
      .nav-right                Log in / Contact us
    .hero                      two-column row
      .branding                 institute name + tagline (left)
      .auth-card                login/sign-up card (right)
        .auth-tabs                Log in / Sign up switcher
        .auth-form                 username + password + submit + forgot link
```
Rename classes/text freely — nothing is hard-wired beyond this file.
