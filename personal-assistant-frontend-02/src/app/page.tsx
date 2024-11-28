import styles from "./page.module.css";
import SignIn from '../templates/sign-in/SignIn.js';

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignIn />
    </div>
  );
}
